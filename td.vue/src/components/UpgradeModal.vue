<template>
    <b-modal
        :title="$t('upgrade.modal.header')"
        size="lg"
        centered
        id="upgrade-modal"
    >
        <h4 class="td-welcome-title">{{ $t('upgrade.modal.welcome') }}</h4>
        <p class="td-p1">{{ $t('upgrade.modal.p1') }}</p>
        <p class="td-p2">{{ $t('upgrade.modal.p2') }}</p>

        <template #modal-footer="{ ok }">
            <b-button variant="primary" @click="ok()">
                {{ $t('forms.ok') }}
            </b-button>
        </template>
    </b-modal>
</template>

<style lang="scss" scoped>
.td-welcome-title {
    margin-bottom: 15px;
}
</style>

<script>
export default {
    name: 'TdUpgradeModal',
    methods: {
        show() {
            this.$bvModal.show('upgrade-modal');
        }
    }
};

</script>