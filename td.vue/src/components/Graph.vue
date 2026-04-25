<template>
    <div>
        <b-row>
            <b-col md="2">
                <div ref="stencil_container"></div>
            </b-col>
            <b-col md="10">
                <b-row>
                    <b-col>
                        <h3 class="td-graph-title">{{ diagram.title }}</h3>
                    </b-col>
                    <b-col align="right">
                        <td-graph-buttons :graph="graph" @saved="saved" @closed="closed" />
                    </b-col>
                </b-row>
                <b-row>
                    <b-col style="display: flex;    width: 100vw; ">
                        <div
                            id="graph-container"
                            ref="graph_container"
                            style="height: 65vh; width: 100%; flex: 1; "
                        ></div>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <td-graph-meta @threatSelected="threatSelected" @threatSuggest="threatSuggest" />

        <div>
            <td-keyboard-shortcuts />
            <td-threat-edit-dialog ref="threatEditDialog" />
            <td-threat-suggest-dialog ref="threatSuggestDialog" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.td-graph-title {
    margin-right: 15px;
}
</style>

<script>
import { useModal } from 'bootstrap-vue-next';
import { mapState } from 'vuex';

import TdGraphButtons from '@/components/GraphButtons.vue';
import TdGraphMeta from '@/components/GraphMeta.vue';
import TdKeyboardShortcuts from '@/components/KeyboardShortcuts.vue';
import TdThreatEditDialog from '@/components/ThreatEditDialog.vue';
import TdThreatSuggestDialog from './ThreatSuggestDialog.vue';

import { DESKTOP_DIAGRAM_SAVE_REQUEST_EVENT } from '@/service/desktop/save.js';
import { getProviderType } from '@/service/provider/providers.js';
import { providerTypes } from '@/service/provider/providerTypes.js';
import diagramService from '@/service/diagram/diagram.js';
import saveDiagram from '@/service/diagram/save.js';
import stencil from '@/service/x6/stencil.js';
import tmActions from '@/store/actions/threatmodel.js';

export default {
    name: 'TdGraph',
    components: {
        TdGraphButtons,
        TdGraphMeta,
        TdKeyboardShortcuts,
        TdThreatEditDialog,
        TdThreatSuggestDialog
    },
    setup() {
        return {
            modalController: useModal()
        };
    },
    computed: mapState({
        diagram: (state) => state.threatmodel.selectedDiagram,
        providerType: (state) => getProviderType(state.provider.selected)
    }),
    data() {
        return {
            graph: null,
            desktopSaveRequestHandler: null
        };
    },
    async mounted() {
        this.init();
        if (this.providerType === providerTypes.desktop) {
            this.desktopSaveRequestHandler = () => this.handleDesktopSaveRequest();
            window.addEventListener(DESKTOP_DIAGRAM_SAVE_REQUEST_EVENT, this.desktopSaveRequestHandler);
        }
    },
    methods: {
        init() {
            this.graph = diagramService.edit(this.$refs.graph_container, this.diagram);
            stencil.get(this.graph, this.$refs.stencil_container);
            this.$store.dispatch(tmActions.notModified);
            this.graph.getPlugin('history').on('change', () => {
                const updated = Object.assign({}, this.diagram);
                updated.cells = this.graph.toJSON().cells;
                this.$store.dispatch(tmActions.diagramModified, updated);
            });
        },
        threatSelected(threatId,state) {
            this.$refs.threatEditDialog.editThreat(threatId,state);
        },
        threatSuggest(type){
            this.$refs.threatSuggestDialog.showModal(type);
        },
        handleDesktopSaveRequest() {
            if (!this.graph) {
                return;
            }

            saveDiagram.save(this.$store, this.graph, this.diagram);
        },
        saved() {
            console.debug('Save diagram');
            saveDiagram.save(this.$store, this.graph, this.diagram);
        },
        async closed() {
            if (!this.$store.getters.modelChanged || await this.getConfirmModal()) {
                await this.$store.dispatch(tmActions.diagramClosed);
                this.$router.push({ name: `${this.providerType}ThreatModel`, params: this.$route.params });
            }
        },
        async getConfirmModal() {
            const result = await this.modalController.create({
                modelValue: true,
                visible: true,
                body: this.$t('forms.discardMessage'),
                title: this.$t('forms.discardTitle'),
                okVariant: 'danger',
                okTitle: this.$t('forms.ok'),
                cancelTitle: this.$t('forms.cancel'),
                noHeaderClose: true,
                centered: true
            }, { resolveOnHide: true });

            return result.ok;
        }
    },
    unmounted() {
        if (this.desktopSaveRequestHandler) {
            window.removeEventListener(DESKTOP_DIAGRAM_SAVE_REQUEST_EVENT, this.desktopSaveRequestHandler);
        }
        diagramService.dispose(this.graph);
    }
};
</script>
