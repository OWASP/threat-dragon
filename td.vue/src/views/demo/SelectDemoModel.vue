<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <td-hero class="text-center">
                    <h4>
                        {{ $t('demo.select') }}
                    </h4>
                </td-hero>
            </b-col>
        </b-row>
        <b-row>
            <b-col md=6 offset=3>
                <b-list-group>
                    <b-list-group-item
                        v-for="(model, idx) in models"
                        :key="idx"
                        href="#"
                        @click.prevent="onModelClick(model)"
                        :data-model-name="model.name"
                    >{{ model.name }}</b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapState } from 'vuex';
import { getProviderType } from '@/service/provider/providers.js';
import { providerTypes } from '@/service/provider/providerTypes.js';
import demo from '@/service/demo/index.js';
import TdHero from '@/components/Hero.vue';
import tmActions from '@/store/actions/threatmodel.js';
import schema from '@/service/schema/ajv';
import { importOtm } from '@/service/migration/otm/otm';
import { importTmbom } from '@/service/migration/tmBom/tmBom';

export default {
    name: 'SelectDemoModel',
    components: {
        TdHero
    },
    data() {
        return {
            models: demo.models
        };
    },
    computed: mapState({
        providerType: (state) => getProviderType(state.provider.selected),
        selectedProvider: (state) => state.provider.selected
    }),
    mounted() {
        this.$store.dispatch(tmActions.clear);
        this.$store.dispatch(tmActions.loadDemos);
    },
    methods: {
        onModelClick(model) {
            if (schema.isTmBom(model.model)) {
                this.$store.dispatch(tmActions.selected, importTmbom(model.model));
            } else if (schema.isOtm(model.model)) {
                this.$store.dispatch(tmActions.selected, importOtm(model.model));
            } else {
                this.$store.dispatch(tmActions.selected, model.model);
            }
            if (this.providerType === providerTypes.desktop) {
                window.electronAPI.modelOpened(model.name);
                const params = Object.assign({}, this.$route.params, { threatmodel: model.name });
                this.$router.push({ name: 'desktopThreatModel', params });
            } else if (this.providerType === providerTypes.local) {
                const params = Object.assign({}, this.$route.params, { threatmodel: model.name });
                this.$router.push({ name: 'localThreatModel', params });
            } else {
                // Git providers: Navigate through repo/branch selection (same flow as creating new model)
                // Google Drive: Navigate through folder selection (same flow as creating new model)
                // Model data is already stored in state via tmActions.selected above
                this.$store.dispatch(tmActions.stash);
                this.$router.push({
                    name: this.providerType === providerTypes.git ? `${this.providerType}Repository` : `${this.providerType}Folder`,
                    params: { provider: this.selectedProvider },
                    query: { action: 'create' }
                });
            }
        }
    }
};

</script>
