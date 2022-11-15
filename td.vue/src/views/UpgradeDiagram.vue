<template>
    <div>
        <td-upgrade-modal ref="upgradeModal" />
        <div>
            <b-row>
                <b-col>
                    <b-jumbotron class="text-center">
                        <p class="td-instructions">{{ $t('upgrade.instructions') }}</p>
                        <b-btn
                            variant="success"
                            size="lg"
                            @click="continueToModel"
                            class="td-upgrade-continue"
                        >
                            <font-awesome-icon
                                icon="project-diagram"
                                class="mr-1"
                            ></font-awesome-icon>
                            {{ $t('upgrade.continue') }}
                        </b-btn>

                    </b-jumbotron>
                </b-col>
            </b-row>
        </div>
        <div v-if="model && model.detail && model.detail.diagrams">
            <b-row
                v-for="(diagram, idx) in model.detail.diagrams"
                :key="idx"
                class="mt-3"
            >
                <b-col md="3" class="text-center td-diagram-details">
                    <h2 class="td-diagram-title">{{ diagram.title }}</h2>
                    <b-btn
                        variant="primary"
                        @click="edit(diagram)"
                        class="td-diagram-edit-btn"
                    >
                        <font-awesome-icon
                            icon="edit"
                            class="mr-1 mb-1"
                        ></font-awesome-icon>
                        {{ $t('forms.edit') }}
                    </b-btn>
                </b-col>
                <b-col md="9">
                    <td-read-only-diagram :diagram="diagram" />
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.td-diagram-details {
    margin-top: 25px;
}

.td-diagram-edit-btn {
    margin-top: 30px;
}
</style>

<script>
import { mapState } from 'vuex';

import { getProviderType } from '@/service/provider/providers.js';
import TdReadOnlyDiagram from '@/components/ReadOnlyDiagram.vue';
import TdUpgradeModal from '@/components/UpgradeModal.vue';
import { THREATMODEL_DIAGRAM_SELECTED, THREATMODEL_UPDATE } from '@/store/actions/threatmodel.js';

export default {
    name: 'UpgradeDiagram',
    components: {
        TdReadOnlyDiagram,
        TdUpgradeModal
    },
    computed: {
        ...mapState({
            model: (state) => state.threatmodel.data,
            providerType: (state) => getProviderType(state.provider.selected),
            version: (state) => state.packageBuildVersion
        })
    },
    mounted() {
        this.$refs.upgradeModal.show();
    },
    methods: {
        edit(diagram) {
            this.$store.dispatch(THREATMODEL_DIAGRAM_SELECTED, diagram);
            const params = Object.assign({}, this.$route.params, { diagram: diagram.title });
            this.$router.push({ name: `${this.providerType}DiagramEdit`, params });
        },
        continueToModel() {
            // update version to latest
            this.$store.dispatch(THREATMODEL_UPDATE, { version: this.version });
            this.$router.push({ name: `${this.providerType}ThreatModel`, params: this.$route.params });
        }
    }
};

</script>
