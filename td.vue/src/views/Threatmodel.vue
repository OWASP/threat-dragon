<template>
    <div>
        <!-- metadata -->
        <b-row class="mb-4">
            <b-col>
                <b-card
                    header="Ttile Goes Here">
                    <b-row class="tm-card">
                        <b-col md=2>
                            <div>
                                <strong>Owner:</strong>
                            </div>
                            <div>
                                The Owner
                            </div>
                        </b-col>
                        <b-col md=2>
                            <div>
                                <strong>Reviewer:</strong>
                            </div>
                            <div>
                                The Reviewer(s)
                            </div>
                        </b-col>
                        <b-col md=2>
                            <div>
                                <strong>Contributors:</strong>
                            </div>
                            <div>
                                The Contributors
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
                            <p>This is where the description goes</p>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
        </b-row>

        <!-- Diagrams -->
        <b-row class="mb-4">
            <b-col
                md="3"
                v-for="(diagram, idx) in diagrams"
                :key="idx"
            >
                <b-card>
                    <template #header>
                        <h6 class="diagram-header-text">
                            <router-link to="/">{{ diagram.name }}</router-link>
                        </h6>
                    </template>
                    <router-link to="/">
                        <b-img-lazy
                            class="m-auto d-block"
                            :src="require(`../assets/thumbnail.${diagram.type.toLowerCase()}.jpg`)"
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
                        :onClick="onEditClick"
                        icon="edit"
                        text="Edit" />
                    <td-form-button
                        :onClick="onReportClick"
                        icon="file-alt"
                        text="Report" />
                    <td-form-button
                        :onClick="onDeleteClick"
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
import TdFormButton from '@/components/FormButton.vue';

export default {
    name: 'ThreatModel',
    components: {
        TdFormButton
    },
    data() {
        return {
            // TODO: All props will be computed using mapState and will come from the API
            diagrams: [
                { name: 'foo', type: 'LINDDUN' },
                { name: 'foo', type: 'STRIDE' },
                { name: 'foo', type: 'CIA' }
            ]
        };
    },
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
