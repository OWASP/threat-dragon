<template>
    <b-row>
        <b-col v-if="model && model.summary">
            <b-card
                :header="`${$t('threatmodel.editing')}: ${model.summary.title}`"
                id="parent-card"
            >
                <b-form @submit="onSubmit">

                    <b-form-row>
                        <b-col>
                            <b-form-group
                                id="title-group"
                                :label="$t('threatmodel.title')"
                                label-for="title">
                                <b-form-input
                                    id="title"
                                    v-model="model.summary.title"
                                    @input="onModifyModel()"
                                    type="text"
                                    required
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-form-row>

                    <b-form-row>
                        <b-col md=6>
                            <b-form-group
                                id="owner-group"
                                :label="$t('threatmodel.owner')"
                                label-for="owner">
                                <b-form-input
                                    id="owner"
                                    v-model="model.summary.owner"
                                    @input="onModifyModel()"
                                    type="text"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>

                        <b-col md=6>
                            <b-form-group
                                id="reviewer-group"
                                :label="$t('threatmodel.reviewer')"
                                label-for="reviewer">
                                <b-form-input
                                    id="reviewer"
                                    v-model="model.detail.reviewer"
                                    @input="onModifyModel()"
                                    type="text"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-form-row>

                    <b-form-row>
                        <b-col>
                            <b-form-group
                                id="description-group"
                                :label="$t('threatmodel.description')"
                                label-for="description">
                                <b-form-textarea
                                    id="description"
                                    v-model="model.summary.description"
                                    @input="onModifyModel()"
                                    type="text"
                                ></b-form-textarea>
                            </b-form-group>
                        </b-col>
                    </b-form-row>

                    <b-form-row>
                        <b-col>
                            <b-form-group
                                id="contributors-group"
                                :label="$t('threatmodel.contributors')"
                                label-for="contributors">
                                <b-form-tags
                                    id="contributors"
                                    :placeholder="$t('threatmodel.contributorsPlaceholder')"
                                    v-model="contributors"
                                    @input="onModifyModel()"
                                    variant="primary"
                                    separator=",;"
                                    tag-class="mx-2"
                                ></b-form-tags>
                            </b-form-group>
                        </b-col>
                    </b-form-row>

                    <b-form-row>
                        <b-col>
                            <h5>{{ $t('threatmodel.diagram.diagrams') }}</h5>
                        </b-col>
                    </b-form-row>

                    <b-form-row>
                        <b-col md=10
                            v-for="(diagram, idx) in model.detail.diagrams"
                            :key="idx"
                        >
                            <b-input-group
                                :id="`diagram-group-${idx}`"
                                :label-for="`diagram-${idx}`"
                                class="mb-3"
                            >
                                <b-input-group-prepend>
                                    <b-dropdown variant="secondary" class="select-diagram-type" :text="model.detail.diagrams[idx].diagramType">
                                        <b-dropdown-item-button @click="onDiagramTypeClick(idx, 'CIA')">{{ $t('threatmodel.diagram.cia.select') }}</b-dropdown-item-button>
                                        <b-dropdown-item-button @click="onDiagramTypeClick(idx, 'CIADIE')">{{ $t('threatmodel.diagram.die.select') }}</b-dropdown-item-button>
                                        <b-dropdown-item-button @click="onDiagramTypeClick(idx, 'LINDDUN')">{{ $t('threatmodel.diagram.linddun.select') }}</b-dropdown-item-button>
                                        <b-dropdown-item-button @click="onDiagramTypeClick(idx, 'PLOT4ai')">{{ $t('threatmodel.diagram.plot4ai.select') }}</b-dropdown-item-button>
                                        <b-dropdown-item-button @click="onDiagramTypeClick(idx, 'STRIDE')">{{ $t('threatmodel.diagram.stride.select') }}</b-dropdown-item-button>
                                        <b-dropdown-item-button @click="onDiagramTypeClick(idx, 'Generic')">{{ $t('threatmodel.diagram.generic.select') }}</b-dropdown-item-button>
                                    </b-dropdown>
                                </b-input-group-prepend>
                                <b-form-input
                                    v-model="model.detail.diagrams[idx].title"
                                    type="text"
                                    class="td-diagram"
                                ></b-form-input>
                                <b-form-input
                                    v-model="model.detail.diagrams[idx].description"
                                    :placeholder="model.detail.diagrams[idx].placeholder"
                                    type="text"
                                    class="td-diagram-description"
                                ></b-form-input>
                                <b-input-group-append>
                                    <b-button variant="primary" class="td-duplicate-diagram" @click="onDuplicateDiagramClick(idx)">
                                        <font-awesome-icon icon="clone"></font-awesome-icon>
                                        {{ $t('forms.duplicate') }}
                                    </b-button>
                                    <b-button variant="secondary" class="td-remove-diagram" @click="onRemoveDiagramClick(idx)">
                                        <font-awesome-icon icon="times"></font-awesome-icon>
                                        {{ $t('forms.remove') }}
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-col>
                    </b-form-row>

                    <b-form-row>
                        <b-col md=6>
                            <a href="javascript:void(0)" @click="onAddDiagramClick" class="add-diagram-link m-2">
                                <font-awesome-icon icon="plus"></font-awesome-icon>
                                {{ $t('threatmodel.diagram.addNewDiagram') }}
                            </a>
                        </b-col>
                    </b-form-row>

                    <b-form-row>
                        <b-col class="text-right mt-5">
                            <b-btn-group>
                                <td-form-button
                                    id="td-save-btn"
                                    :isPrimary="true"
                                    :onBtnClick="onSaveClick"
                                    icon="save"
                                    :text="$t('forms.save')" />
                                <td-form-button
                                    id="td-reload-btn"
                                    :onBtnClick="onReloadClick"
                                    icon="undo"
                                    :text="$t('forms.reload')" />
                                <td-form-button
                                    id="td-close-btn"
                                    :onBtnClick="onCloseClick"
                                    icon="times"
                                    :text="$t('forms.close')" />
                            </b-btn-group>
                        </b-col>
                    </b-form-row>

                </b-form>
            </b-card>
        </b-col>
    </b-row>
</template>

<style lang="scss" scoped>
.add-diagram-link {
    color: $orange;
    font-size: 14px;
}

.remove-diagram-btn {
    font-size: 12px;
}

.select-diagram-type {
    font-size: 12px;
}
</style>

<script>
import { mapState } from 'vuex';

import { getProviderType } from '@/service/provider/providers.js';
import TdFormButton from '@/components/FormButton.vue';
import tmActions from '@/store/actions/threatmodel.js';

export default {
    name: 'ThreatModelEdit',
    components: {
        TdFormButton
    },
    computed: {
        ...mapState({
            fileHandle: (state) => state.threatmodel.fileHandle,
            fileName: (state) => state.threatmodel.fileName,
            model: (state) => state.threatmodel.data,
            providerType: (state) => getProviderType(state.provider.selected),
            diagramTop: (state) => state.threatmodel.data.detail.diagramTop,
            version: (state) => state.packageBuildVersion
        }),
        contributors: {
            get() {
                return this.$store.getters.contributors;
            },
            set(contributors) {
                this.$store.dispatch(tmActions.contributorsUpdated, contributors);
            }
        }
    },
    async mounted() {
        this.init();
    },
    methods: {
        init() {
            this.$store.dispatch(tmActions.notModified);
        },
        onSubmit() {
            // noop
        },
        async onSaveClick(evt) {
            evt.preventDefault();
            if (this.$route.name === 'gitThreatModelCreate' || this.$route.name === 'googleThreatModelCreate') {
                await this.$store.dispatch(tmActions.create);
            } else {
                await this.$store.dispatch(tmActions.saveModel);
            }
            // stop the save button from leaving the threat model edit view
            // this.$router.push({ name: `${this.providerType}ThreatModel`, params: this.$route.params });
        },
        async onReloadClick(evt) {
            evt.preventDefault();
            await this.restoreAsync();
        },
        async onCloseClick(evt) {
            evt.preventDefault();
            if (await this.restoreAsync()) {
                this.$router.push({ name: `${this.providerType}ThreatModel`, params: this.$route.params });
            }
        },
        onAddDiagramClick(evt) {
            evt.preventDefault();
            let newDiagram = {
                id: this.diagramTop,
                title: this.$t('threatmodel.diagram.stride.defaultTitle'),
                diagramType: 'STRIDE',
                placeholder: this.$t('threatmodel.diagram.stride.defaultDescription'),
                thumbnail: './public/content/images/thumbnail.stride.jpg',
                version: this.version,
                cells: []
            };
            this.$store.dispatch(tmActions.update, { diagramTop: this.diagramTop + 1 });
            this.model.detail.diagrams.push(newDiagram);
            this.$store.dispatch(tmActions.modified);
        },
        onDiagramTypeClick(idx, type) {
            let defaultTitle;
            let placeholder;
            let thumbnail;
            switch (type) {

            case 'CIA':
                thumbnail = './public/content/images/thumbnail.cia.jpg';
                defaultTitle = this.$t('threatmodel.diagram.cia.defaultTitle');
                placeholder = this.$t('threatmodel.diagram.cia.defaultDescription');
                break;

            case 'DIE':
            case 'CIADIE':
                thumbnail = './public/content/images/thumbnail.die.jpg';
                defaultTitle = this.$t('threatmodel.diagram.die.defaultTitle');
                placeholder = this.$t('threatmodel.diagram.die.defaultDescription');
                break;

            case 'LINDDUN':
                thumbnail = './public/content/images/thumbnail.linddun.jpg';
                defaultTitle = this.$t('threatmodel.diagram.linddun.defaultTitle');
                placeholder = this.$t('threatmodel.diagram.linddun.defaultDescription');
                break;

            case 'PLOT4ai':
                thumbnail = './public/content/images/thumbnail.plot4ai.jpg';
                defaultTitle = this.$t('threatmodel.diagram.plot4ai.defaultTitle');
                placeholder = this.$t('threatmodel.diagram.plot4ai.defaultDescription');
                break;

            case 'STRIDE':
                thumbnail = './public/content/images/thumbnail.stride.jpg';
                defaultTitle = this.$t('threatmodel.diagram.stride.defaultTitle');
                placeholder = this.$t('threatmodel.diagram.stride.defaultDescription');
                break;

            default:
                thumbnail = './public/content/images/thumbnail.jpg';
                defaultTitle = this.$t('threatmodel.diagram.generic.defaultTitle');
                placeholder = this.$t('threatmodel.diagram.generic.defaultDescription');
                type = this.$t('threatmodel.diagram.generic.select');
            }
            this.model.detail.diagrams[idx].diagramType = type;
            this.model.detail.diagrams[idx].placeholder = placeholder;
            this.model.detail.diagrams[idx].thumbnail = thumbnail;
            // if the diagram title is still default, then change it to the new default title
            if (this.model.detail.diagrams[idx].title === this.$t('threatmodel.diagram.cia.defaultTitle')
                || this.model.detail.diagrams[idx].title === this.$t('threatmodel.diagram.die.defaultTitle')
                || this.model.detail.diagrams[idx].title === this.$t('threatmodel.diagram.linddun.defaultTitle')
                || this.model.detail.diagrams[idx].title === this.$t('threatmodel.diagram.plot4ai.defaultTitle')
                || this.model.detail.diagrams[idx].title === this.$t('threatmodel.diagram.stride.defaultTitle')
                || this.model.detail.diagrams[idx].title === this.$t('threatmodel.diagram.generic.defaultTitle')
            ) {
                this.model.detail.diagrams[idx].title = defaultTitle;
            }
            this.$store.dispatch(tmActions.modified);
        },
        onRemoveDiagramClick(idx) {
            this.model.detail.diagrams.splice(idx, 1);
            this.$store.dispatch(tmActions.modified);
        },
        onDuplicateDiagramClick(idx) {
            let newDiagram = JSON.parse(JSON.stringify(this.model.detail.diagrams[idx]));
            newDiagram.id = this.diagramTop;
            this.$store.dispatch(tmActions.update, { diagramTop: this.diagramTop + 1 });
            this.model.detail.diagrams.push(newDiagram);
            this.$store.dispatch(tmActions.modified);
        },
        onModifyModel() {
            this.$store.dispatch(tmActions.modified);
        },
        async restoreAsync() {
            if (!this.$store.getters.modelChanged || await this.getConfirmModal()) {
                await this.$store.dispatch(tmActions.diagramClosed);
                this.$store.dispatch(tmActions.restore);
                this.$store.dispatch(tmActions.notModified);
                return true;
            }
            return false;
        },
        getConfirmModal() {
            return this.$bvModal.msgBoxConfirm(this.$t('forms.discardMessage'), {
                title: this.$t('forms.discardTitle'),
                okVariant: 'danger',
                okTitle: this.$t('forms.ok'),
                cancelTitle: this.$t('forms.cancel'),
                hideHeaderClose: true,
                centered: true
            });
        }
    }
};

</script>
