<script>
export default {
  name: 'TdGraphProperties'
};
</script>
<script setup>
import { useCellStore } from '@/stores/cell';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import dataChanged from '@/service/x6/graph/data-changed.js';

/**
 * TODO:
 * Note: The data is bound, but the UI is only updated when the unselected event happens.  We may want to find a way to force this as needed.
 */
const cellStore = useCellStore();
const { t } = useI18n();

const cellRef = computed(() => cellStore.ref);

const onChangeName = () => {
  dataChanged.updateName(cellRef);
};
const onChangeScope = () => {
  document.getElementById('reasonoutofscope').disabled = !cellRef.value.data.outOfScope;
  dataChanged.updateStyleAttrs(cellRef);
};
</script>

<template>
  <div id="props-card">
    <!--
            All entities have the following properties:
                - Name (text input)
                - Description (text area)
                - type (not shown in properties)

            Process, Store, Actor, Flow share the following (not boundaries):
                - outOfScope
                - reasonOutOfScope
                - hasOpenThreats
                - threats

            Process:
                - privilegeLevel

            Store:
                - isALog
                - storesCredentials
                - isEncrypted
                - isSigned

            Actor:
                - providesAuthentication

            Flow:
                - protocol
                - isEncrypted
                - isPublicNetwork
        -->

    <b-row v-show="!cellRef">
      <b-col>
        <p>{{ t('threatmodel.properties.emptyState') }}</p>
      </b-col>
    </b-row>

    <b-form v-if="!!cellRef">
      <b-form-row>
        <b-col md="6">
          <b-form-group
            id="name-group"
            label-cols="auto"
            :label="cellRef.data.type === 'tm.Text' ? t('threatmodel.properties.text') : t('threatmodel.properties.name')"
            label-for="name"
          >
            <b-form-textarea
              id="name"
              v-model="cellRef.data.name"
              :rows="cellRef.data.type === 'tm.Text' ? 7 : 2"
              @change="onChangeName()"
            />
          </b-form-group>
        </b-col>

        <b-col
          v-if="cellRef.data.type !== 'tm.Text'"
          md="6"
        >
          <b-form-group
            id="description-group"
            label-cols="auto"
            :label="t('threatmodel.properties.description')"
            label-for="description"
          >
            <b-form-textarea
              id="description"
              v-model="cellRef.data.description"
            />
          </b-form-group>
        </b-col>

        <b-col
          v-if="!cellRef.data.isTrustBoundary && cellRef.data.type !== 'tm.Text'"
          md="6"
        >
          <b-form-group
            id="outofscope-group"
            label-cols="auto"
          >
            <b-form-checkbox
              id="outofscope"
              v-model="cellRef.data.outOfScope"
              @change="onChangeScope()"
            >
              {{ t('threatmodel.properties.outOfScope') }}
            </b-form-checkbox>
          </b-form-group>
        </b-col>

        <b-col
          v-if="!cellRef.data.isTrustBoundary && cellRef.data.type !== 'tm.Text'"
          md="6"
        >
          <b-form-group
            id="reasonoutofscope-group"
            label-cols="auto"
            :label="t('threatmodel.properties.reasonOutOfScope')"
            label-for="reasonoutofscope"
          >
            <b-form-textarea
              id="reasonoutofscope"
              v-model="cellRef.data.reasonOutOfScope"
              :disabled="!cellRef.data.outOfScope"
            />
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Process'">
          <b-form-group
            id="privilegelevel-group"
            label-cols="auto"
            :label="t('threatmodel.properties.privilegeLevel')"
            label-for="privilegelevel"
          >
            <b-form-input
              id="privilegelevel"
              v-model="cellRef.data.privilegeLevel"
              type="text"
            />
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Store'">
          <b-form-group
            id="isalog-group"
            label-cols="auto"
          >
            <b-form-checkbox
              id="isalog"
              v-model="cellRef.data.isALog"
            >
              {{ t('threatmodel.properties.isALog') }}
            </b-form-checkbox>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Store'">
          <b-form-group
            id="storesCredentials-group"
            label-cols="auto"
          >
            <b-form-checkbox
              id="storesCredentials"
              v-model="cellRef.data.storesCredentials"
            >
              {{ t('threatmodel.properties.storesCredentials') }}
            </b-form-checkbox>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Store'">
          <b-form-group
            id="isEncrypted-group"
            label-cols="auto"
          >
            <b-form-checkbox
              id="isEncrypted"
              v-model="cellRef.data.isEncrypted"
            >
              {{ t('threatmodel.properties.isEncrypted') }}
            </b-form-checkbox>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Store'">
          <b-form-group
            id="isSigned-group"
            label-cols="auto"
          >
            <b-form-checkbox
              id="isSigned"
              v-model="cellRef.data.isSigned"
            >
              {{ t('threatmodel.properties.isSigned') }}
            </b-form-checkbox>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Actor'">
          <b-form-group
            id="providesAuthentication-group"
            label-cols="auto"
          >
            <b-form-checkbox
              id="providesAuthentication"
              v-model="cellRef.data.providesAuthentication"
            >
              {{ t('threatmodel.properties.providesAuthentication') }}
            </b-form-checkbox>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Flow'">
          <b-form-group
            id="protocol-group"
            label-cols="auto"
            :label="t('threatmodel.properties.protocol')"
            label-for="protocol"
          >
            <b-form-input
              id="protocol"
              v-model="cellRef.data.protocol"
              type="text"
            />
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Flow'">
          <b-form-group
            id="isEncrypted-group"
            label-cols="auto"
          >
            <b-form-checkbox
              id="isEncrypted"
              v-model="cellRef.data.isEncrypted"
            >
              {{ t('threatmodel.properties.isEncrypted') }}
            </b-form-checkbox>
          </b-form-group>
        </b-col>

        <b-col v-if="cellRef.data.type === 'tm.Flow'">
          <b-form-group
            id="isPublicNetwork-group"
            label-cols="auto"
          >
            <b-form-checkbox
              id="isPublicNetwork"
              v-model="cellRef.data.isPublicNetwork"
            >
              {{ t('threatmodel.properties.publicNetwork') }}
            </b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-form-row>
    </b-form>
  </div>
</template>

<style lang="scss">
label {
  font-size: 12px !important;
}
</style>
