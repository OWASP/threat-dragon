<template>
    <div v-if="!!model && model.summary">
        <b-row class="mb-4" id="title_row">
            <b-col>
                <td-threat-model-summary-card />
            </b-col>
        </b-row>
        <!-- Description -->
        <b-row class="mb-4">
            <b-col>
                <b-card
                    :header="$t('threatmodel.description')">
                    <b-row class="tm-card">
                        <b-col>
                            <p id="tm_description">{{ model.summary.description }}</p>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
        </b-row>
        <!-- Diagrams -->
        <b-row class="mb-4">
            <b-col
                class="tm_diagram"
                lg="3"
                v-for="(diagram, idx) in model.detail.diagrams"
                :key="idx"
            >
                <b-card>
                    <template #header>
                        <h6 class="diagram-header-text">
                            <a href="javascript:void(0)" @click="editDiagram(diagram)" class="diagram-edit">
                                {{ diagram.title }}
                            </a>
                        </h6>
                    </template>
                    <h6 v-if="diagram.description" class="diagram-description-text">
                        <a href="javascript:void(0)" @click="editDiagram(diagram)" class="diagram-edit">
                            {{ diagram.description }}
                        </a>
                    </h6>
                    <a v-else href="javascript:void(0)" @click="editDiagram(diagram)">
                        <b-img-lazy
                            class="m-auto d-block td-diagram-thumb"
                            :src="getThumbnailUrl(diagram)"
                            :alt="diagram.title" />
                    </a>
                </b-card>
            </b-col>
        </b-row>
        <b-row>
            <b-col class="text-right">
                <BButtonGroup>
                    <td-form-button
                        id="td-edit-btn"
                        :isPrimary="true"
                        :onBtnClick="onEditClick"
                        icon="edit"
                        :text="$t('forms.edit')" />
                    <td-form-button
                        id="td-report-btn"
                        :onBtnClick="onReportClick"
                        icon="file-alt"
                        :text="$t('forms.report')" />
                    <td-form-button
                        id="td-close-btn"
                        :onBtnClick="onCloseClick"
                        icon="times"
                        :text="$t('forms.closeModel')" />
                </BButtonGroup>
            </b-col>
        </b-row>
    </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colors.scss' as colors; /* Import the SCSS file with color variables */
.tm-card {
    font-size: 14px;
    white-space: pre-wrap;
}
.diagram-header-text a {
    color: colors.$black;
}
.diagram-description-text a {
    color: colors.$black;
}
.td-diagram-thumb {
    max-width: 200px;
    max-height: 160px;
}
</style>
<script>
import { mapState } from 'vuex';
import { getProviderType } from '@/service/provider/providers.js';
import TdFormButton from '@/components/FormButton.vue';
import TdThreatModelSummaryCard from '@/components/ThreatModelSummaryCard.vue';
import tmActions from '@/store/actions/threatmodel.js';
export default {
    name: 'ThreatModel',
    components: {
        TdFormButton,
        TdThreatModelSummaryCard
    },
    computed: mapState({
        model: (state) => state.threatmodel.data,
        providerType: (state) => getProviderType(state.provider.selected),
        version: (state) => state.packageBuildVersion
    }),
    methods: {
        onEditClick(evt) {
            evt.preventDefault();
            this.$router.push({ name: `${this.providerType}ThreatModelEdit`, params: this.$route.params });
        },
        onReportClick(evt) {
            evt.preventDefault();
            this.$router.push({ name: `${this.providerType}Report`, params: this.$route.params });
        },
        onCloseClick(evt) {
            evt.preventDefault();
            this.$store.dispatch(tmActions.clear);
            this.$router.push('/dashboard');
        },
        getThumbnailUrl(diagram) {
            if (!diagram || !diagram.diagramType) {
                return require('@/assets/thumbnail.jpg');
            }
            return require(`@/assets/thumbnail.${diagram.diagramType.toLowerCase()}.jpg`);
        },
        editDiagram(diagram) {
            this.$store.dispatch(tmActions.diagramSelected, diagram);
            const path = `${this.$route.path}/edit/${encodeURIComponent(diagram.title)}`;
            this.$router.push(path);
        }
    },
    mounted() {
        let threatTop = this.model.detail.threatTop === undefined ? 100 : this.model.detail.threatTop;
        let diagramTop = this.model.detail.diagramTop === undefined ? 10 : this.model.detail.diagramTop;
        let update = { diagramTop: diagramTop, version: this.version, threatTop: threatTop };
        console.debug('updates: ' + JSON.stringify(update));
        this.$store.dispatch(tmActions.update, update);
        this.$store.dispatch(tmActions.notModified);
    }
};
</script>