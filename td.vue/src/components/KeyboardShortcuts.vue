<script>
export default {
  name: 'TdKeyboardShortcuts'
};
</script>
<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const shortcuts = ref([]);

onMounted(() => {
  shortcuts.value = [
    {
      shortcut: t('threatmodel.shortcuts.copy.shortcut'),
      action: t('threatmodel.shortcuts.copy.action')
    },
    {
      shortcut: t('threatmodel.shortcuts.paste.shortcut'),
      action: t('threatmodel.shortcuts.paste.action')
    },
    {
      shortcut: t('threatmodel.shortcuts.undo.shortcut'),
      action: t('threatmodel.shortcuts.undo.action')
    },
    {
      shortcut: t('threatmodel.shortcuts.redo.shortcut'),
      action: t('threatmodel.shortcuts.redo.action')
    },
    {
      shortcut: t('threatmodel.shortcuts.delete.shortcut'),
      action: t('threatmodel.shortcuts.delete.action')
    },
    {
      shortcut: t('threatmodel.shortcuts.pan.shortcut'),
      action: t('threatmodel.shortcuts.pan.action')
    },
    {
      shortcut: t('threatmodel.shortcuts.multiSelect.shortcut'),
      action: t('threatmodel.shortcuts.multiSelect.action')
    },
    {
      shortcut: t('threatmodel.shortcuts.zoom.shortcut'),
      action: t('threatmodel.shortcuts.zoom.action')
    }
  ];
});
</script>

<template>
  <b-modal
    id="shortcuts"
    size="lg"
    ok-variant="primary"
    header-bg-variant="primary"
    header-text-variant="light"
    ok-only
    :title="t('threatmodel.shortcuts.title')"
  >
    <b-table :items="shortcuts" />
  </b-modal>
</template>
