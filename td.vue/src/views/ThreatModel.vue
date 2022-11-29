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
                    <!-- "thumbnail": "./public/content/images/thumbnail.jpg", -->
                    
                    <h6 class="diagram-header-text diagram-edit">
                        {{ diagram.description }}
                    </h6>
                </b-card>
            </b-col>
        </b-row>
        <b-row>
            <b-col class="text-right">
                <b-btn-group>
                    <td-form-button
                        id="tm-edit-btn"
                        :isPrimary="true"
                        :onBtnClick="onEditClick"
                        icon="edit"
                        :text="$t('forms.edit')" />
                    <td-form-button
                        id="tm-report-btn"
                        :onBtnClick="onReportClick"
                        icon="file-alt"
                        :text="$t('forms.report')" />
                    <td-form-button
                        id="tm-delete-btn"
                        :onBtnClick="onDeleteClick"
                        icon="times"
                        :text="$t('forms.delete')" />
                </b-btn-group>
            </b-col>
        </b-row>
    </div>
</template>

<style lang="scss" scoped>
.tm-card {
    font-size: 14px;
    white-space: pre-wrap;
}
.diagram-header-text a {
    color: $black;
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
import { THREATMODEL_DIAGRAM_SELECTED } from '@/store/actions/threatmodel.js';

export default {
    name: 'ThreatModel',
    components: {
        TdFormButton,
        TdThreatModelSummaryCard
    },
    computed: mapState({
        model: (state) => state.threatmodel.data,
        providerType: (state) => getProviderType(state.provider.selected)
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
        onDeleteClick(evt) {
            evt.preventDefault();
            console.log('Delete clicked! Action TBA');
        },
        getThumbnailUrl(diagram) {
            if (!diagram || !diagram.diagramType) {
                return '../assets/thumbnail.jpg';
            }
            return `../assets/thumbnail.${diagram.diagramType.toLowerCase()}.jpg`;
        },
        editDiagram(diagram) {
            this.$store.dispatch(THREATMODEL_DIAGRAM_SELECTED, diagram);
            const path = `${this.$route.path}/edit/${encodeURIComponent(diagram.title)}`;
            this.$router.push(path);
        }
    }
};
</script>
