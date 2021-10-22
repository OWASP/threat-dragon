<template>
    <b-row>
        <b-col>
            <b-card :header="`${$t('threatmodel.editing')}: ${model.summary.title}`">
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
                            <h5>{{ $t('threatmodel.diagrams') }}</h5>
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
                                <b-form-input
                                    v-model="model.detail.diagrams[idx].title"
                                    type="text"
                                ></b-form-input>
                                <b-input-group-append>
                                    <b-button variant="secondary" @click="onRemoveDiagramClick(idx)">
                                        <font-awesome-icon icon="times"></font-awesome-icon>
                                        {{ $t('forms.remove') }}
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-col>

                        <b-col md=6>
                            <a href="javascript:void(0)" @click="onAddDiagramClick" class="add-diagram-link m-2">
                                <font-awesome-icon icon="plus"></font-awesome-icon>
                                {{ $t('threatmodel.addNewDiagram') }}
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
    font-size: 14px;
}
</style>

<script>
import { mapState } from 'vuex';

import { getProviderType } from '@/service/provider/providers.js';
import TdFormButton from '@/components/FormButton.vue';
import { THREATMODEL_CONTRIBUTORS_UPDATED } from '@/store/actions/threatmodel.js';

export default {
    name: 'ThreatModelEdit',
    components: {
        TdFormButton
    },
    computed: {
        ...mapState({
            contributorsOld: (state) => (state.threatmodel.data.detail.contributors || []).map(x => x.name),
            model: (state) => state.threatmodel.data,
            providerType: state => getProviderType(state.provider.selected),
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
    data() {
        return {
            diagramNames: []
        };
    },
    methods: {
        onSubmit() {
            console.log('Form sumbitting...');
        },
        onSaveClick(evt) {
            evt.preventDefault();
            console.log('Save - TODO');
        },
        onReloadClick(evt) {
            evt.preventDefault();
            console.log('Reload - TODO');
        },
        onCancelClick(evt) {
            evt.preventDefault();
            this.$router.push({ name: `${this.providerType}ThreatModel`, params: this.$route.params });
            console.log('Cancel - TODO');
        },
        onAddDiagramClick(evt) {
            evt.preventDefault();
            this.model.detail.diagrams.push({ name: '' });
        },
        onRemoveDiagramClick(idx) {
            this.model.detail.diagrams.splice(idx, 1);
        }
    }
};
</script>
