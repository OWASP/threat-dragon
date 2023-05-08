<script>
export default {
  name: 'ReportModel'
};
</script>
<script setup>
import TdCoversheet from '@/components/report/Coversheet.vue';
import TdDiagramDetail from '@/components/report/DiagramDetail.vue';
import TdExecutiveSummary from '@/components/report/ExecutiveSummary.vue';
import TdFormButton from '@/components/FormButton.vue';
import TdPrintCoversheet from '@/components/printed-report/Coversheet.vue';
import TdPrintExecutiveSummary from '@/components/printed-report/ExecutiveSummary.vue';
import { useThreatModelStore } from '@/stores/threatmodel';
import { useProviderStore } from '@/stores/provider';
import isElectron from 'is-electron';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import threatService from '@/service/threats/index.js';
import { getProviderType } from '@/service/provider/providers';

const threatModelStore = useThreatModelStore();
const providerStore = useProviderStore();
const router = useRouter();
const { t } = useI18n();

const model = computed(() => threatModelStore.data);
const providerType = computed(() => getProviderType(providerStore.selected));

const allThreats = computed (() => {
  return threatService.filter(threatModelStore.data.detail.diagrams, {
    showOutOfScope: true,
    showMitigated: true
  });
});

const display = ref({
  outOfScope: true,
  mitigated: true,
  diagrams: true,
  branding: true
});

const onCloseClick = () => {
  console.log(providerType.value);
  router.push({ name: `${providerType.value}ThreatModel`, params: router.currentRoute.value.params });
};
const print = () => {
  window.print();
};
const printPdf = () => {
  if (isElectron()) {
    // request electron server to print PDF
    window.electronAPI.modelPrint('PDF');
  }
};
</script>

<template>
  <div class="td-report">
    <b-row class="no-print td-report-options sticky">
      <b-col>
        <b-form class="">
          <b-form-row>
            <b-col>
              <b-form-group
                id="outofscope-group"
                label-cols="auto"
              >
                <b-form-checkbox
                  id="show_outofscope"
                  v-model="display.outOfScope"
                >
                  {{ t('report.options.showOutOfScope') }}
                </b-form-checkbox>
              </b-form-group>
            </b-col>

            <b-col>
              <b-form-group
                id="mitigated-group"
                label-cols="auto"
              >
                <b-form-checkbox
                  id="show_mitigated"
                  v-model="display.mitigated"
                >
                  {{ t('report.options.showMitigatedThreats') }}
                </b-form-checkbox>
              </b-form-group>
            </b-col>

            <b-col>
              <b-form-group
                id="model-group"
                label-cols="auto"
              >
                <b-form-checkbox
                  id="show_models"
                  v-model="display.diagrams"
                >
                  {{ t('report.options.showModelDiagrams') }}
                </b-form-checkbox>
              </b-form-group>
            </b-col>

            <b-col>
              <b-form-group
                id="branding-group"
                label-cols="auto"
              >
                <b-form-checkbox
                  id="show_branding"
                  v-model="display.branding"
                >
                  {{ t('report.options.showBranding') }}
                </b-form-checkbox>
              </b-form-group>
            </b-col>
          </b-form-row>
        </b-form>
      </b-col>

      <b-col class="text-right right">
        <b-btn-group>
          <td-form-button
            v-if="isElectron()"
            id="td-print-pdf-btn"
            :on-btn-click="printPdf"
            icon="file-pdf"
            :text="t('forms.savePdf')"
          />
          <td-form-button
            id="td-print-btn"
            :on-btn-click="print"
            icon="print"
            :text="t('forms.print')"
          />
          <td-form-button
            id="td-return-btn"
            :is-primary="true"
            :on-btn-click="onCloseClick"
            icon="times"
            :text="t('forms.close')"
          />
        </b-btn-group>
      </b-col>
    </b-row>

    <div
      v-if="!!model"
      class="td-report-container"
    >
      <div class="td-report-section">
        <td-coversheet :branding="display.branding" />
        <td-print-coversheet
          :title="model.summary.title"
          :owner="model.summary.owner"
          :reviewer="model.detail.reviewer"
          :contributors="threatModelStore.contributors"
          :branding="display.branding"
        />
      </div>

      <div class="td-report-section">
        <td-executive-summary
          :summary="model.summary.description"
          :threats="allThreats"
        />
        <td-print-executive-summary
          :summary="model.summary.description"
          :threats="allThreats"
        />
      </div>

      <td-diagram-detail
        v-for="(diagram, idx) in model.detail.diagrams"
        :key="idx"
        :diagram="diagram"
        :show-out-of-scope="display.outOfScope"
        :show-mitigated="display.mitigated"
        :show-diagram="display.diagrams"
      />
    </div>
  </div>
</template>

<style lang="scss">
.td-report-options label {
  padding-top: 4px;
  font-size: 12px !important;
}

.card-header {
  font-size: 16px;
}
</style>

<style lang="scss" scoped>
.td-branding {
  padding-left: 50px;
}

.td-report {
  font-size: 12px;
}

.td-report-section {
  margin-top: 15px;
}

.td-report-container {
  margin-top: 5px;
}

.sticky {
  position: sticky;
  top: $header-height + 10;
  width: 100%;
  background-color: $white;
  padding-top: 15px;
  z-index: 9999;
}

.right {
  right: 0;
}
</style>
