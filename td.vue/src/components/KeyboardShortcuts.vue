<template>
    <b-modal
        id="shortcuts"
        size="lg"
        ok-variant="primary"
        header-bg-variant="primary"
        header-text-variant="light"
        ok-only
        :title="$t('threatmodel.shortcuts.title')"
    >
        <b-table :items="shortcuts"></b-table>
    </b-modal>
</template>

<script>
export default {
    name: 'TdKeyboardShortcuts',
    data() {
        return {
            shortcuts: [
                {
                    shortcut: this.$t('threatmodel.shortcuts.copy.shortcut'),
                    action: this.$t('threatmodel.shortcuts.copy.action')
                },
                {
                    shortcut: this.$t('threatmodel.shortcuts.paste.shortcut'),
                    action: this.$t('threatmodel.shortcuts.paste.action')
                },
                {
                    shortcut: this.$t('threatmodel.shortcuts.undo.shortcut'),
                    action: this.$t('threatmodel.shortcuts.undo.action')
                },
                {
                    shortcut: this.$t('threatmodel.shortcuts.redo.shortcut'),
                    action: this.$t('threatmodel.shortcuts.redo.action')
                },
                {
                    shortcut: this.$t('threatmodel.shortcuts.delete.shortcut'),
                    action: this.$t('threatmodel.shortcuts.delete.action')
                },
                {
                    shortcut: this.$t('threatmodel.shortcuts.pan.shortcut'),
                    action: this.$t('threatmodel.shortcuts.pan.action')
                },
                {
                    shortcut: this.$t('threatmodel.shortcuts.multiSelect.shortcut'),
                    action: this.$t('threatmodel.shortcuts.multiSelect.action')
                },
                {
                    shortcut: this.$t('threatmodel.shortcuts.zoom.shortcut'),
                    action: this.$t('threatmodel.shortcuts.zoom.action')
                },
                {
                    shortcut: this.$t('threatmodel.shortcuts.save.shortcut'),
                    action: this.$t('threatmodel.shortcuts.save.action')
                }
            ]
        };
    }
};

</script>
