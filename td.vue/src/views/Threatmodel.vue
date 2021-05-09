<template>
    <div v-if="model">
        <!-- metadata -->
        <b-row class="mb-4" id="title_row">
            <b-col>
                <b-card
                    :header="model.summary.title">
                    <b-row class="tm-card">
                        <b-col md=2>
                            <div>
                                <strong>Owner:</strong>
                            </div>
                            <div id="tm_owner">
                                {{ model.summary.owner }}
                            </div>
                        </b-col>
                        <b-col md=2>
                            <div>
                                <strong>Reviewer:</strong>
                            </div>
                            <div id="tm_reviewer">
                                {{ model.detail.reviewer }}
                            </div>
                        </b-col>
                        <b-col md=2>
                            <div>
                                <strong>Contributors:</strong>
                            </div>
                            <div id="tm_contributors">
                                {{ contributors }}
                            </div>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
        </b-row>

        <!-- Description -->
        <b-row class="mb-4">
            <b-col>
                <b-card
                    header="High level system description">
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
                md="3"
                v-for="(diagram, idx) in model.detail.diagrams"
                :key="idx"
            >
                <b-card>
                    <template #header>
                        <h6 class="diagram-header-text">
                            <router-link to="/">{{ diagram.title }}</router-link>
                        </h6>
                    </template>
                    <router-link to="/">
                        <b-img-lazy
                            class="m-auto d-block"
                            :src="require(`../assets/thumbnail.${diagram.diagramType.toLowerCase()}.jpg`)"
                            :alt="`${diagram.type} Diagram`" />
                    </router-link>
                </b-card>
            </b-col>
        </b-row>
        <b-row>
            <b-col class="text-right">
                <b-btn-group>
                    <td-form-button
                        :isPrimary="true"
                        :onBtnClick="onEditClick"
                        icon="edit"
                        text="Edit" />
                    <td-form-button
                        :onBtnClick="onReportClick"
                        icon="file-alt"
                        text="Report" />
                    <td-form-button
                        :onBtnClick="onDeleteClick"
                        icon="times"
                        text="Delete" />
                </b-btn-group>
            </b-col>
        </b-row>
    </div>
</template>

<style lang="scss" scoped>
.tm-card {
    font-size: 14px;
}
.diagram-header-text a {
    color: $font-color;
}
</style>

<script>
import { mapState } from 'vuex';

import TdFormButton from '@/components/FormButton.vue';

export default {
    name: 'ThreatModel',
    components: {
        TdFormButton
    },
    computed: mapState({
        model: (state) => state.threatmodel.data,
        contributors: (state) => state.threatmodel.data.detail.contributors.map(x => x.name).join(', ')
    }),
    methods: {
        onEditClick(evt) {
            evt.preventDefault();
            console.log('Edit clicked!');
        },
        onReportClick(evt) {
            evt.preventDefault();
            console.log('Report clicked!');
        },
        onDeleteClick(evt) {
            evt.preventDefault();
            console.log('Delete clicked!');
        }
    }
};
</script>
