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
                                    variant="primary"
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
                        <b-col md=6
                            v-for="(diagram, idx) in model.detail.diagrams"
                            :key="idx"
                        >
                            <b-input-group
                                :id="`diagram-group-${idx}`"
                                :label-for="`diagram-${idx}`"
                                class="mb-3"
                            >
                                <b-input-group-prepend>
                                    <b-dropdown split variant="secondary" class="select-diagram-type" :text="model.detail.diagrams[idx].diagramType">
                                        <b-dropdown-item-button @click="onDiagramTypeClick(idx, 'CIA')">{{ $t('threatmodel.diagram.cia.select') }}</b-dropdown-item-button>
                                        <b-dropdown-item-button @click="onDiagramTypeClick(idx, 'LINDDUN')">{{ $t('threatmodel.diagram.linddun.select') }}</b-dropdown-item-button>
                                        <b-dropdown-item-button @click="onDiagramTypeClick(idx, 'STRIDE')">{{ $t('threatmodel.diagram.stride.select') }}</b-dropdown-item-button>
                                        <b-dropdown-item-button @click="onDiagramTypeClick(idx, 'Generic')">{{ $t('threatmodel.diagram.generic.select') }}</b-dropdown-item-button>
                                    </b-dropdown>
                                </b-input-group-prepend>
                                <b-form-input
                                    v-model="model.detail.diagrams[idx].title"
                                    type="text"
                                    class="td-diagram"
                                ></b-form-input>
                                <b-input-group-append>
                                    <b-button variant="secondary" class="td-remove-diagram" @click="onRemoveDiagramClick(idx)">
                                        <font-awesome-icon icon="times"></font-awesome-icon>
                                        {{ $t('forms.remove') }}
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-col>

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
                                    id="td-cancel-btn"
                                    :onBtnClick="onCancelClick"
                                    icon="times"
                                    :text="$t('forms.cancel')" />
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

select-diagram-type {
    font-size: 12px;
}
</style>

<script>
import { mapState } from 'vuex';

import { getProviderType } from '@/service/provider/providers.js';
import TdFormButton from '@/components/FormButton.vue';
import { THREATMODEL_CONTRIBUTORS_UPDATED, THREATMODEL_RESTORE, THREATMODEL_SAVE } from '@/store/actions/threatmodel.js';
import { tc } from '@/i18n/index.js';

export default {
    name: 'ThreatModelEdit',
    components: {
        TdFormButton
    },
    computed: {
        ...mapState({
            model: (state) => state.threatmodel.data,
            providerType: state => getProviderType(state.provider.selected)
        }),
        contributors: {
            get() {
                return this.$store.getters.contributors;
            },
            set(contributors) {
                this.$store.dispatch(THREATMODEL_CONTRIBUTORS_UPDATED, contributors);
            }
        }
    },
    methods: {
        onSubmit() {
            // noop
        },
        async onSaveClick(evt) {
            evt.preventDefault();
            await this.$store.dispatch(THREATMODEL_SAVE);
            this.$router.push({ name: `${this.providerType}ThreatModel`, params: this.$route.params });
        },
        async onReloadClick(evt) {
            evt.preventDefault();
            await this.restoreAsync();
        },
        async onCancelClick(evt) {
            evt.preventDefault();
            if (await this.restoreAsync()) {
                this.$router.push({ name: `${this.providerType}ThreatModel`, params: this.$route.params });
            }
        },
        onAddDiagramClick(evt) {
            evt.preventDefault();
//            this.model.detail.diagrams.push({ name: '', title: tc('threatmodel.diagram.stride.diagramTitle'), diagramType: 'STRIDE' });
            let newDiagram = {
                name: '',
                title: tc('threatmodel.diagram.stride.diagramTitle'),
                diagramType: 'STRIDE',
                thumbnail: './public/content/images/thumbnail.stride.jpg'
            };
            this.model.detail.diagrams.push(newDiagram);
        },
        onDiagramTypeClick(idx, type) {
            this.model.detail.diagrams[idx].diagramType = type;
            console.log('Diagram[' + idx + '] type set to : ' + type);
            switch (type) {
                case 'CIA':
                    this.model.detail.diagrams[idx].thumbnail = './public/content/images/thumbnail.cia.jpg';
                    break;
                case 'LINDDUN':
                    this.model.detail.diagrams[idx].thumbnail = './public/content/images/thumbnail.linddun.jpg';
                    break;
                case 'STRIDE':
                    this.model.detail.diagrams[idx].thumbnail = './public/content/images/thumbnail.stride.jpg';
                    break;
                default:
                    this.model.detail.diagrams[idx].thumbnail = './public/content/images/thumbnail.generic.jpg';
                    break;
            }
        },
        onRemoveDiagramClick(idx) {
            this.model.detail.diagrams.splice(idx, 1);
        },
        async restoreAsync() {
            if (!this.$store.getters.modelChanged || await this.getConfirmModal()) {
                this.$store.dispatch(THREATMODEL_RESTORE);
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
