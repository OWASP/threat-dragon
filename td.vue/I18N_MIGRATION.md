# Vue 3 I18n Migration Tracking

This document tracks the migration from Vue 2 Options API style internationalization to Vue 3 Composition API style for OWASP Threat Dragon.

## Migration Pattern

### Before (Options API)

```vue
<template>
  <div>
    <h1>{{ $t('example.title') }}</h1>
    <p :title="$t('example.tooltip')">{{ $t('example.content') }}</p>
    <button @click="doSomething">{{ $t('example.button') }}</button>
  </div>
</template>

<script>
export default {
  name: 'ExampleComponent',
  methods: {
    doSomething() {
      logger.info(this.$t('example.message'));
    }
  }
}
</script>
```

### After (Composition API)

```vue
<template>
  <div>
    <h1>{{ t('example.title') }}</h1>
    <p :title="t('example.tooltip')">{{ t('example.content') }}</p>
    <button @click="doSomething">{{ t('example.button') }}</button>
  </div>
</template>

<script>
import { useI18n } from '@/i18n';

export default {
  name: 'ExampleComponent',
  setup() {
    const { t } = useI18n();
    
    const doSomething = () => {
      logger.info(t('example.message'));
    };
    
    return {
      t,
      doSomething
    };
  }
}
</script>
```

## Migration Steps

For each component:

1. Add `import { useI18n } from '@/i18n';` to imports
2. Implement the `setup()` method with `const { t } = useI18n();`
3. Return `t` from the setup function
4. Replace all instances of `$t(` with `t(` in templates
5. Replace all instances of `this.$t(` with `t(` in methods
6. Move all methods that use translations into the setup function or separate composable functions
7. Update any associated tests to mock the `useI18n` function properly

## Progress Tracking

### Completed Components

| Component | File Path | PR/Commit |
|-----------|-----------|-----------|
| Graph | src/components/Graph.vue | [threat-editor-enhancements branch] |
| GraphButtons | src/components/GraphButtons.vue | [threat-editor-enhancements branch] |
| KeyboardShortcuts | src/components/KeyboardShortcuts.vue | [threat-editor-enhancements branch] |
| LocaleSelect | src/components/LocaleSelect.vue | [threat-editor-enhancements branch] |
| Navbar | src/components/Navbar.vue | [threat-editor-enhancements branch] |
| ThreatEditDialog | src/components/ThreatEditDialog.vue | [threat-editor-enhancements branch] |
| ThreatModelSummaryCard | src/components/ThreatModelSummaryCard.vue | [threat-editor-enhancements branch] |
| ProviderLoginButton | src/components/ProviderLoginButton.vue | [threat-editor-enhancements branch] |
| DashboardAction | src/components/DashboardAction.vue | [threat-editor-enhancements branch] |
| ThreatSuggestDialog | src/components/ThreatSuggestDialog.vue | [threat-editor-enhancements branch] |

### Components Pending Migration

| Component | File Path | Status |
|-----------|-----------|--------|
| App | src/App.vue | Pending |
| AddBranchDialog | src/components/AddBranchDialog.vue | Pending |
| ConfirmationModal | src/components/ConfirmationModal.vue | Pending |
| FormButton | src/components/FormButton.vue | Pending |
| GraphMeta | src/components/GraphMeta.vue | Completed |
| GraphProperties | src/components/GraphProperties.vue | Completed ✅ |
| GraphThreats | src/components/GraphThreats.vue | Pending |
| KeyValueCard | src/components/KeyValueCard.vue | Pending |
| ReadOnlyDiagram | src/components/ReadOnlyDiagram.vue | Pending |
| SelectionPage | src/components/SelectionPage.vue | Pending |
| TdFormTextareaWrapper | src/components/TdFormTextareaWrapper.vue | Pending |
| Coversheet (report) | src/components/report/Coversheet.vue | Pending |
| DiagramDetail | src/components/report/DiagramDetail.vue | Pending |
| ExecutiveSummary (report) | src/components/report/ExecutiveSummary.vue | Pending |
| ReportEntity (report) | src/components/report/ReportEntity.vue | Pending |
| Coversheet (printed-report) | src/components/printed-report/Coversheet.vue | Pending |
| ExecutiveSummary (printed-report) | src/components/printed-report/ExecutiveSummary.vue | Pending |
| ReportEntity (printed-report) | src/components/printed-report/ReportEntity.vue | Pending |

### Views Pending Migration

| View | File Path | Status |
|------|-----------|--------|
| DiagramEdit | src/views/DiagramEdit.vue | Pending |
| HomePage | src/views/HomePage.vue | Pending |
| ImportModel | src/views/ImportModel.vue | Pending |
| MainDashboard | src/views/MainDashboard.vue | Pending |
| NewThreatModel | src/views/NewThreatModel.vue | Pending |
| OAuthCallback | src/views/OAuthCallback.vue | Pending |
| PrivacyPage | src/views/PrivacyPage.vue | Completed ✅ |
| ReportModel | src/views/ReportModel.vue | Pending |
| ThreatModel | src/views/ThreatModel.vue | Pending |
| ThreatModelEdit | src/views/ThreatModelEdit.vue | Pending |
| ToSPage | src/views/ToSPage.vue | Completed ✅ |
| SelectDemoModel | src/views/demo/SelectDemoModel.vue | Pending |
| BranchAccess | src/views/git/BranchAccess.vue | Pending |
| RepositoryAccess | src/views/git/RepositoryAccess.vue | Pending |
| ThreatModelSelect | src/views/git/ThreatModelSelect.vue | Pending |
| DriveAccess | src/views/google/DriveAccess.vue | Pending |

## Test Updates Required

Tests need to be updated to properly mock the `useI18n` function. This involves:

1. Adding the appropriate mock for `useI18n` in the test file
2. Ensuring the test components receive and use the `t` function correctly

### Test Files Completed

| Test File | Status |
|-----------|--------|
| tests/unit/components/graph.spec.js | Completed |
| tests/unit/components/threatEditDialog.spec.js | Completed |
| tests/unit/components/threatSuggestDialog.spec.js | Completed |
| tests/unit/components/graphMeta.spec.js | Completed ✅ |
| tests/unit/components/localeSelect.spec.js | Completed |

### Test Files Pending Updates

| Test File | Status |
|-----------|--------|
| tests/unit/app.spec.js | Pending |
| tests/unit/components/addBranchDialog.spec.js | Pending |
| tests/unit/components/dashboardAction.spec.js | Pending |
| tests/unit/components/formbutton.spec.js | Pending |
| tests/unit/components/graphButtons.spec.js | Pending |
| tests/unit/components/graphProperties.spec.js | Completed ✅ |
| tests/unit/components/graphThreats.spec.js | Pending |
| tests/unit/components/keyboardShortcuts.spec.js | Pending |
| tests/unit/components/navbar.spec.js | Pending |
| tests/unit/components/providerLoginButton.spec.js | Pending |
| tests/unit/components/readonlyDiagram.spec.js | Pending |
| tests/unit/components/selectionPage.spec.js | Pending |
| tests/unit/components/printed-report/coversheet.spec.js | Pending |
| tests/unit/components/printed-report/executiveSummary.spec.js | Pending |
| tests/unit/components/printed-report/reportEntity.spec.js | Pending |
| tests/unit/components/report/coversheet.spec.js | Pending |
| tests/unit/components/report/diagramDetail.spec.js | Pending |
| tests/unit/components/report/executiveSummary.spec.js | Pending |
| tests/unit/components/report/reportEntity.spec.js | Pending |
| tests/unit/views/branchAccess.spec.js | Pending |
| tests/unit/views/demo/selectDemoModel.spec.js | Pending |
| tests/unit/views/google/driveAccess.spec.js | Pending |
| tests/unit/views/homePage.spec.js | Pending |
| tests/unit/views/importModel.spec.js | Pending |
| tests/unit/views/mainDashboard.spec.js | Pending |
| tests/unit/views/newThreatModel.spec.js | Pending |
| tests/unit/views/oauthCallback.spec.js | Pending |
| tests/unit/views/privacyPage.spec.js | Completed ✅ |
| tests/unit/views/reportModel.spec.js | Pending |
| tests/unit/views/repositoryAccess.spec.js | Pending |
| tests/unit/views/threatmodel.spec.js | Pending |
| tests/unit/views/threatmodelEdit.spec.js | Pending |
| tests/unit/views/threatmodelSelect.spec.js | Pending |
| tests/unit/views/tosPage.spec.js | Completed ✅ |

## Best Practices for I18n in Vue 3

1. Always use the `useI18n` composable from '@/i18n' for consistency
2. Destructure the `t` function in the setup method: `const { t } = useI18n();`
3. Return `t` from the setup function to make it available in the template
4. For components with many translations, consider grouping related translations into separate functions
5. For reusable translation logic, create dedicated composables in the `composables` directory
6. In tests, mock the `useI18n` function to return a predictable `t` function

## Reference Implementation

Example of a fully migrated component:

```vue
<template>
  <div>
    <h1>{{ t('component.title') }}</h1>
    <p>{{ t('component.description') }}</p>
    <button @click="handleAction">{{ t('component.button') }}</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useI18n } from '@/i18n';

export default {
  name: 'MyComponent',
  setup() {
    const { t } = useI18n();
    const count = ref(0);
    
    const handleAction = () => {
      count.value++;
      logger.info(t('component.actionPerformed', { count: count.value }));
    };
    
    return {
      t,
      count,
      handleAction
    };
  }
};
</script>
```

Example of a test for the migrated component:

```js
import { mount } from '@vue/test-utils';
import MyComponent from '@/components/MyComponent.vue';

// Mock the useI18n composable
jest.mock('@/i18n', () => ({
  useI18n: jest.fn().mockReturnValue({
    t: jest.fn(key => key),
    locale: { value: 'eng' },
    availableLocales: ['eng', 'fra', 'deu']
  })
}));

describe('MyComponent.vue', () => {
  let wrapper;
  
  beforeEach(() => {
    wrapper = mount(MyComponent);
  });
  
  it('renders the component with translations', () => {
    expect(wrapper.find('h1').text()).toBe('component.title');
    expect(wrapper.find('p').text()).toBe('component.description');
    expect(wrapper.find('button').text()).toBe('component.button');
  });
  
  it('handles button click', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    await wrapper.find('button').trigger('click');
    expect(consoleSpy).toHaveBeenCalledWith('component.actionPerformed');
  });
});
```