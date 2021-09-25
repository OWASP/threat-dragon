<template>
    <b-row>
        <b-col>
            <b-card :header="`Editing: ${model.summary.title}`">
                <b-form @submit="onSubmit">

                    <b-form-row>
                        <b-col>
                            <b-form-group
                                id="title-group"
                                label="Title"
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
                                label="Owner"
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
                                label="Reviewer"
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
                                label="High level system description"
                                label-for="description">
                                <b-form-textarea
                                    id="description"
                                    v-model="model.detail.description"
                                    type="text"
                                ></b-form-textarea>
                            </b-form-group>
                        </b-col>
                    </b-form-row>

                    <b-form-row>
                        <b-col>
                            <b-form-group
                                id="contributors-group"
                                label="Contributors"
                                label-for="contributors">
                                <b-form-tags
                                    id="contributors"
                                    placeholder="Add a new contributor"
                                    v-model="contributors"
                                    variant="primary"
                                ></b-form-tags>
                            </b-form-group>
                        </b-col>
                    </b-form-row>

                    <b-form-row>
                        <b-col>
                            <h5>Diagrams</h5>
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
                                    <!-- TODO: Implement -->
                                    <b-button variant="secondary">
                                        <font-awesome-icon icon="times"></font-awesome-icon>
                                        Remove
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-col>

                        <b-col md=6>
                            <a href="javascript:void(0)" @click="onAddDiagramClick" class="add-diagram-link m-2">
                                <font-awesome-icon icon="plus"></font-awesome-icon>
                                Add a new diagram...
                            </a>
                        </b-col>
                    </b-form-row>

                    <b-form-row>
                        <b-col class="text-right mt-5">
                            <b-btn-group>
                                <td-form-button
                                    :isPrimary="true"
                                    :onBtnClick="onSaveClick"
                                    icon="save"
                                    text="Save" />
                                <td-form-button
                                    :onBtnClick="onReloadClick"
                                    icon="undo"
                                    text="Reload" />
                                <td-form-button
                                    :onBtnClick="onCancelClick"
                                    icon="times"
                                    text="Cancel" />
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

export default {
    name: 'ThreatModelEdit',
    components: {
        TdFormButton
    },
    computed: mapState({
        contributors: (state) => (state.threatmodel.data.detail.contributors || []).map(x => x.name),
        model: (state) => state.threatmodel.data,
        providerType: state => getProviderType(state.provider.selected),
    }),
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
        }
    }
};
</script>
