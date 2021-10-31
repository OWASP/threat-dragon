<template>
    <div>
        <b-modal
            id="threat-edit"
            size="lg"
            ok-variant="primary"
            header-bg-variant="primary"
            header-text-variant="light"
            :title="$t('threats.edit')"
            ref="editModal"
        >
            <!-- TODO: Make into a form -->
            {{ threat }}


            <template #modal-footer>
                <div class="w-100">
                <b-button
                    variant="secondary"
                    class="float-right"
                    @click="hideModal()"
                >
                    {{ $t('forms.close') }}
                </b-button>
                <b-button
                    variant="danger"
                    class="float-left"
                    @click="confirmDelete()"
                >
                    {{ $t('forms.delete') }}
                </b-button>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import { CELL_DATA_UPDATED } from '@/store/actions/cell.js';
import dataChanged from '@/service/x6/graph/data-changed.js';

export default {
    name: 'TdThreatEditModal',
    computed: mapState({
        cellRef: (state) => state.cell.ref
    }),
    data() {
        return {
            threat: {},
            threatIndex: -1
        };
    },
    methods: {
        show(threatId) {
            this.threat = this.cellRef.data.threats.find(x => x.id === threatId);
            this.$refs.editModal.show();
        },
        hideModal() {
            this.$refs.editModal.hide();
        },
        async confirmDelete() {
            const confirmed = await this.$bvModal.msgBoxConfirm(this.$t('threats.confirmDeleteMessage'), {
                title: this.$t('threats.confirmDeleteTitle'),
                okTitle: this.$t('forms.delete'),
                cancelTitle: this.$t('forms.cancel'),
                okVariant: 'danger'
            });

            if (!confirmed) { return; }

            this.cellRef.data.threats = this.cellRef.data.threats.filter(x => x.id !== this.threat.id);
            this.cellRef.data.hasOpenThreats = this.cellRef.data.threats.length > 0;
            this.$store.dispatch(CELL_DATA_UPDATED, this.cellRef.data);
            dataChanged.updateStyleAttrs(this.cellRef);

            this.hideModal();
        }
    }
};

</script>
