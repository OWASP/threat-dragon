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
                <b-card :header="$t('threatmodel.description')">
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
            <b-col class="tm_diagram" lg="3" v-for="(diagram, idx) in model.detail.diagrams" :key="idx">
                <b-card>
                    <template #header>
                        <h6 class="diagram-header-text">
                            <a href="#" @click.prevent="editDiagram(diagram)" class="diagram-edit">
                                {{ diagram.title }}
                            </a>
                        </h6>
                    </template>
                    <a href="#" @click.prevent="editDiagram(diagram)">
                        <!-- "thumbnail": "./public/content/images/thumbnail.jpg", --> <td-image
                            class="td-diagram-thumb"
                            :src="require(`../assets/${diagram.thumbnail ? diagram.thumbnail.split('/').pop() : 'thumbnail.jpg'}`)"
                            :alt="diagram.title"
                            lazy
                        />
                    </a>
                    <h6 v-if=diagram.description class="diagram-description-text">
                        {{ diagram.description }}
                    </h6>
                </b-card>
            </b-col>
        </b-row>
        <b-row>
            <b-col class="text-right">
                <b-btn-group>
                    <td-form-button id="td-edit-btn" :isPrimary="true" :onBtnClick="onEditClick" icon="edit"
                        :text="$t('forms.edit')" />
                    <td-form-button id="td-report-btn" :onBtnClick="onReportClick" icon="file-alt"
                        :text="$t('forms.report')" />
                    <td-dropdown right variant="secondary" :text="$t('forms.export')" id="manage-model-btn" v-if="enableExport || enableTemplates">
                        <template #default="{ close }">
                            <button v-if="enableTemplates"
                                type="button"
                                class="td-dropdown-item"
                                @click="(evt) => { onExportTemplateClick(evt); close(); }"
                                id="export-template-option"
                            >
                                <font-awesome-icon icon="file-import" ></font-awesome-icon>
                                {{ $t('forms.exportTemplate') }}
                            </button>
                            <button v-if="enableExport"
                                type="button"
                                class="td-dropdown-item"
                                @click="(evt) => { onExportTmBomClick(evt); close(); }"
                                id="export-tmbom-option"
                            >
                                <font-awesome-icon icon="file-import" ></font-awesome-icon>
                                {{ $t('forms.exportTmBom') }}
                            </button>
                        </template>
                    </td-dropdown>
                    <td-form-button id="td-close-btn" :onBtnClick="onCloseClick" icon="times"
                        :text="$t('forms.closeModel')" />
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

.diagram-description-text a {
    color: $black;
}

.td-diagram-thumb {
    display: block;
    margin: auto;
    max-width: 200px;
    max-height: 160px;
}
</style>

<script>
import { mapState } from 'vuex';

import { getProviderType } from '@/service/provider/providers.js';
import { writeFile } from '@/service/save.js';
import TdDropdown from '@/components/Dropdown.vue';
import TdFormButton from '@/components/FormButton.vue';
import TdImage from '@/components/Image.vue';
import TdThreatModelSummaryCard from '@/components/ThreatModelSummaryCard.vue';
import tmActions from '@/store/actions/threatmodel.js';

export default {
    name: 'ThreatModel',
    components: {
        TdDropdown,
        TdFormButton,
        TdImage,
        TdThreatModelSummaryCard
    },
    computed: mapState({
        enableTemplates: (state) => ['github', 'local'].includes(state.provider.selected),
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
        onExportTemplateClick(evt) {
            evt.preventDefault();
            // Demo models live on the local route; use the matching export route to avoid missing params
            const isLocalRoute = this.$route.name && this.$route.name.startsWith('local');
            const routeName = isLocalRoute
                ? 'localThreatModelExportTemplate'
                : `${this.providerType}ThreatModelExportTemplate`;
            this.$router.push({ name: routeName, params: this.$route.params });
        },
        async onExportTmBomClick(evt) {
            evt.preventDefault();
            const tmBom = this.$store.getters.tmBomExport;
            console.debug('Export to TM-BOM ' + JSON.stringify(tmBom, null, 2));
            await writeFile(tmBom, '');
        },
        getThumbnailUrl(diagram) {
            if (!diagram || !diagram.diagramType) {
                return '../assets/thumbnail.jpg';
            }
            return `../assets/thumbnail.${diagram.diagramType.toLowerCase()}.jpg`;
        },
        editDiagram(diagram) {
            this.$store.dispatch(tmActions.diagramSelected, diagram);
            const path = `${this.$route.path}/edit/${encodeURIComponent(diagram.title)}`;
            this.$router.push(path);
        }
    },
    mounted() {
        // make sure we are compatible with version 1.x and early 2.x
        const threatTop = this.model.detail.threatTop === undefined ? 100 : this.model.detail.threatTop;
        const diagramTop = this.model.detail.diagramTop === undefined ? 10 : this.model.detail.diagramTop;
        const update = { diagramTop: diagramTop, version: this.version, threatTop: threatTop };
        this.$store.dispatch(tmActions.update, update);
        // if a diagram has just been closed, the history insists on marking the model as modified
        this.$store.dispatch(tmActions.notModified);
    }
};
</script>
