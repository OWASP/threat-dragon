# Vue 3 Migration Plan – Threat Dragon (td.vue)

Pragmatic, PR-by-PR plan to move from Vue 2.x (EOL) to Vue 3, using the [Vue 3 Migration Build](https://v3-migration.vuejs.org/migration-build) where possible to keep changes small and reviewable.

**References**

- [Vue 3 Migration Guide](https://v3-migration.vuejs.org)
- [Migration Build – Known Limitations](https://v3-migration.vuejs.org/migration-build#known-limitations)

---

## Current state (after migration build PR)


| Item           | Current                             | Notes                                                                                          |
| -------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Vue**        | ^3.4.21 + @vue/compat               | Migration build; alias `vue` → `@vue/compat`, compatConfig MODE: 2.                            |
| **Build**      | Vue CLI 5 (@vue/cli-service ~5.0.8) | Webpack-based; no Vite.                                                                        |
| **Desktop**    | vue-cli-plugin-electron-builder     | Electron app; router history mode can cause blank page with Vue 3 – use hash history.          |
| **portal-vue** | ^2.1.7 (dev)                        | No direct use in src; likely transitive (e.g. bootstrap-vue). Vue 3 has built-in `<Teleport>`. |
| **Install**    | `npm install --legacy-peer-deps`    | Required: some deps still declare Vue 2 peer; use `.npmrc` or CI must pass the flag.           |


---

## Dependency audit (Vue 3 readiness)

### ✅ Works with Vue 3 / migration build


| Dependency                       | Current | Vue 3 path                          | Notes                                                                                                                                                             |
| -------------------------------- | ------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **vue-router**                   | 3.5.4   | **vue-router 4**                    | New API: `createRouter`, `createWebHashHistory`. Use hash history for Electron.                                                                                   |
| **vuex**                         | 3.6.2   | **Vuex 4**                          | Minor API changes; store creation changes.                                                                                                                        |
| **vue-i18n**                     | 8.27.2  | **vue-i18n 9**                      | New API: `createI18n()` instead of `new VueI18n()`. Legacy mode eases migration. Breaking: `$t`/`$tc` return strings only; `dateTimeFormats` → `datetimeFormats`. |
| **vue-toastification**           | 1.7.14  | **vue-toastification 2**            | Vue 3 version; different plugin registration.                                                                                                                     |
| **@fortawesome/vue-fontawesome** | 2.0.8   | **3.x**                             | Vue 3–compatible; register with `createApp`.                                                                                                                      |
| **bootstrap-vue**                | 2.23.1  | **Keep on 2.23.x with @vue/compat** | 2.23.0+ supports Vue 3 via `@vue/compat` in **MODE: 2** only. Long term: move to BootstrapVueNext (Bootstrap 5).                                                  |
| **vuex-persist**                 | 3.1.3   | **Same or swap**                    | May work with Vue 3; if not, use vuex-persister or vuex-persistedstate 4.x.                                                                                       |


### ⚠️ Needs upgrade or replacement


| Dependency                | Current | Vue 3 path                                  | Notes                                                                                                                                                                  |
| ------------------------- | ------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **@antv/x6**              | ^2.18.1 | **Stay on 2.x with compat, or move to 3.x** | Vue shape: **@antv/x6-vue-shape** (Vue 2). For native Vue 3: **@antv/x6-vue3-shape** (typically with X6 3.x). Prefer trying current stack under migration build first. |
| **portal-vue**            | 2.1.7   | **Remove**                                  | Replace with Vue 3 `<Teleport>` when dropping bootstrap-vue (or if we find direct usage).                                                                              |
| **Bootstrap (CSS)**       | 4.6.1   | **4.x with compat, then 5.x**               | Bootstrap-vue 2.23 requires Bootstrap 4. BootstrapVueNext requires Bootstrap 5.                                                                                        |
| **vue-template-compiler** | 2.7.16  | **Remove**                                  | Replaced by `@vue/compiler-sfc` when using migration build.                                                                                                            |


### 🔧 Tooling


| Item           | Current                             | Vue 3 path                                                         |
| -------------- | ----------------------------------- | ------------------------------------------------------------------ |
| **Vue loader** | Via Vue CLI 5                       | Vue CLI 5 uses vue-loader 16; fine for migration build.            |
| **Compiler**   | vue-template-compiler               | @vue/compiler-sfc (with migration build).                          |
| **Unit tests** | @vue/test-utils 1.x, @vue/vue2-jest | @vue/test-utils 2, vue3-jest (or Vitest) after switching to Vue 3. |
| **Electron**   | vue-cli-plugin-electron-builder     | Keep; use hash history for router to avoid blank page in Vue 3.    |


---

## Migration strategy in short

1. **Use the migration build early**: Switch to Vue 3 + `@vue/compat` (MODE: 2) so the app runs on Vue 3 with compatibility warnings. Fix compile-time errors and high-value warnings first.
2. **One major change per PR**: Each PR does one upgrade or one coherent set of changes (e.g. “Vue Router 4 only”).
3. **Leave Bootstrap for later**: Keep bootstrap-vue 2.23 on compat; the “beast” is moving to Bootstrap 5 + BootstrapVueNext (or similar) in a dedicated phase.
4. **i18n in one step**: Move to vue-i18n 9 in a single PR (createI18n + legacy mode, then fix any `$t`/`$tc`/plural/format breakages).

---

## PR-by-PR plan

### Phase A – (folded into B1)

Version pinning and housekeeping are done as part of the migration build PR (B1); no separate A1 PR.

---

### Phase B – Migration build (Vue 3 in compat mode)

During migration, pin versions for vue, @vue/compat, and @vue/compiler-sfc (e.g. ^3.4.21); use compat mode globally. Use `npm install --legacy-peer-deps` (or `.npmrc` with `legacy-peer-deps=true`) because some deps still declare Vue 2 peer.


| PR     | Scope                                                            | What to do                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------ | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **B1** | Introduce Vue 3 migration build + app working + tests restorable | In package.json: `vue` ^3.4.21, `@vue/compat`, `@vue/compiler-sfc`; remove `vue-template-compiler`. Add **Vuex 4**, **Vue Router 4** (hash history), **vue-i18n 9** (legacy mode). In vue.config.js: alias `vue` → `@vue/compat`, `compilerOptions.compatConfig: { MODE: 2 }`. Entry: **createApp**, `app.use(store)`, `app.use(router)`, `app.use(i18n)`, plugins. Add `.npmrc` `legacy-peer-deps=true`. **Unit tests:** Jest `moduleNameMapper` `vue` → `@vue/compat`; add `@vue/vue3-jest`, `@vue/test-utils` 2; add `tests/unit/helpers/vueTestUtils.js` (createLocalVue, mountOptions). Migrate specs from createLocalVue + Vuex.Store to createLocalVue + createStore + mountOptions(localVue, { store, mocks }). Three specs migrated as template; remaining specs use same pattern (see helper and app.spec, importModel.spec, graphThreats.spec). |
| **B2** | Transition class names (optional early PR)                       | Project-wide: rename transition classes per [Vue 3 transition breakings](https://v3-migration.vuejs.org/breaking-changes/transition.html) (e.g. `v-enter` → `v-enter-from`, `v-leave` → `v-leave-from`). Reduces compat warnings.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **B3** | Optional: fix more compat warnings                               | Address other runtime warnings that originate from **our** code (not from dependencies), where low-effort. Document remaining warnings from deps for later PRs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |


*After B1 the app runs on Vue 3 with compat; store/router/i18n inject correctly. Unit tests: run with `npm run test:unit`; migrate any remaining failing specs using the pattern in `tests/unit/helpers/vueTestUtils.js` and the three migrated specs.*

**Migrating a unit spec to VTU 2:** (1) Import `createLocalVue` and `mountOptions` from `../helpers/vueTestUtils` (or `../../helpers/vueTestUtils` from nested dirs). (2) Import `createStore` from `'vuex'`; replace `new Vuex.Store(...)` with `createStore(...)`. (3) Remove `localVue.use(Vuex)`. (4) Replace `shallowMount(Component, { localVue, store, mocks })` with `shallowMount(Component, mountOptions(localVue, { store, mocks }))`. (5) Prefer DOM selectors (e.g. `wrapper.find('.class')`) over `findComponent(BootstrapComponent)` where stubs hide content. (6) Replace `$emit` mocks with `wrapper.emitted('eventName')` where needed.

---

### Phase C – Core Vue 3 dependencies (one PR per dependency)

**Note:** C1, C2, and C3 are included in B1 so the app runs and tests can use the new stack. The following rows are for reference if splitting into separate PRs later.


| PR     | Scope                | What to do                                                                                                         |
| ------ | -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **C1** | Vue Router 4         | ✅ In B1. createRouter({ history: createWebHashHistory(), routes }), app.use(router).                               |
| **C2** | Vuex 4               | ✅ In B1. createStore(), app.use(store).                                                                            |
| **C3** | Vue I18n 9           | ✅ In B1. createI18n({ legacy: true }), app.use(i18n); tc() via get().global.tc(key).                               |
| **C4** | Vue Toastification 2 | Upgrade to vue-toastification 2; update plugin registration for Vue 3 (createApp). Replace any deprecated options. |
| **C5** | Font Awesome Vue 3   | Upgrade @fortawesome/vue-fontawesome to 3.x; register with `app.component()` (or equivalent) in Vue 3 app setup.   |


*Each PR keeps the migration build and compat mode; no Bootstrap or X6 change yet.*

---

### Phase D – Bootstrap (the “beast”)


| PR     | Scope                                   | What to do                                                                                                                                                                                                                                                                                                                                        |
| ------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **D1** | Bootstrap 5 + BootstrapVueNext (part 1) | Add Bootstrap 5 and bootstrap-vue-next. Replace bootstrap-vue in **a subset of views/components** (e.g. 2–3 high-traffic components or one view). Update vue.config.js and remove vue-cli-plugin-bootstrap-vue for the new stack. Keep bootstrap-vue and Bootstrap 4 in parallel for unchanged components if needed, or do full cutover in D1/D2. |
| **D2** | Bootstrap 5 + BootstrapVueNext (part 2) | Replace remaining bootstrap-vue usage across the rest of the app (~30 files with `<b-`*). Remove bootstrap-vue, vue-cli-plugin-bootstrap-vue, and portal-vue. Align on Bootstrap 5 class names (e.g. start/end instead of left/right).                                                                                                            |


*If the team prefers a single large Bootstrap PR, D1+D2 can be one PR; otherwise two keeps reviews manageable.*

---

### Phase E – Diagram & persistence


| PR     | Scope               | What to do                                                                                                                                                                                       |
| ------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **E1** | AntV X6 Vue 3 shape | If staying on X6 2.x: verify @antv/x6-vue-shape under @vue/compat; fix any issues. If moving to X6 3.x: add @antv/x6-vue3-shape, update diagram/shape registration and any Vue 2–specific usage. |
| **E2** | Vuex persistence    | Verify vuex-persist with Vue 3 + Vuex 4. If broken, replace with vuex-persister (or vuex-persistedstate 4.x) and update store plugin in one place.                                               |


---

### Phase F – Electron, test stack, and full Vue 3


| PR     | Scope                     | What to do                                                                                                                                                               |
| ------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **F1** | Electron + Vue 3          | Ensure vue-cli-plugin-electron-builder works with Vue 3 (router already on hash in C1). Fix blank page or build issues; document any workarounds.                        |
| **F2** | Remove migration build    | Remove `@vue/compat` alias and use Vue 3 directly. Set compiler to Vue 3 mode (no compatConfig or MODE: 3). Fix any remaining compat-only behavior; run full test suite. |
| **F3** | Unit test stack for Vue 3 | Upgrade to @vue/test-utils 2 and vue3-jest (or migrate to Vitest). Update tests that rely on Vue 2 APIs (e.g. mounting, stubs). Run test:unit and test:desktop.          |


*Optional later: separate PR to migrate build from Vue CLI to Vite.*

---

## Suggested order (summary)

1. **A1** – Housekeeping
2. **B1** – Migration build
3. **B2** – Transition classes (optional)
4. **C1** – Vue Router 4 (hash for Electron)
5. **C2** – Vuex 4
6. **C3** – Vue I18n 9
7. **C4** – Toastification 2
8. **C5** – Font Awesome 3
9. **B3** – Optional compat warning cleanup
10. **D1** – Bootstrap 5 + BootstrapVueNext (part 1)
11. **D2** – Bootstrap 5 + BootstrapVueNext (part 2)
12. **E1** – X6 Vue 3 shape
13. **E2** – Vuex persistence
14. **F1** – Electron
15. **F2** – Drop compat
16. **F3** – Test utils / vue3-jest

---

## Risks and mitigations


| Risk                           | Mitigation                                                                                                                         |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| BootstrapVueNext still “alpha” | Stay on bootstrap-vue 2.23 + compat until BootstrapVueNext is stable, or adopt a minimal Bootstrap 5 + custom components approach. |
| i18n 9 breaking $t/$tc usage   | Use vue-i18n 9 in legacy mode; audit and fix plural/format usage in one PR (C3).                                                   |
| Electron blank page            | Use hash history (createWebHashHistory) for router in C1; document in F1.                                                          |
| Large Bootstrap PR             | Split into D1 (pilot components) and D2 (rest).                                                                                    |
| Regression in diagrams         | Isolate X6 and shape usage in E1; run e2e that cover diagram flows.                                                                |


---

## Out of scope for this plan

- Migrating from Vue CLI to Vite (can be a follow-up).
- Migrating from Vuex to Pinia (optional later).
- Migrating from Options API to Composition API / `<script setup>` (optional, incremental).

---

*Document generated for the td.vue Vue 3 migration. Update this file as PRs land or constraints change.*