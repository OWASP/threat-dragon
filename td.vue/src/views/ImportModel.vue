<template>
    <div>
        <local-file-picker ref="localFilePicker" @file-selected="onFileSelected" />
        <b-row>
            <b-col>
                <div class="jumbotron text-center">
                    <h4>
                        {{ $t('forms.open') }} /
                        {{ $t('dashboard.actions.importExisting') }}
                    </h4>
                </div>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="8" offset="2">
                <b-form>
                    <b-row>
                        <b-col @drop.prevent="onDropFile" @dragenter.prevent @dragover.prevent>
                            <b-form-group id="json-input-group" label-for="json-input">
                                <b-form-textarea
                                    id="json-input"
                                    v-model="tmJson"
                                    :placeholder="prompt"
                                    rows="16"
                                />
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-form>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="4" offset="2" class="text-left">
                <BButtonGroup>
                    <td-form-button
                        id="td-open-btn"
                        :on-btn-click="onOpenClick"
                        icon="folder-open"
                        :text="$t('forms.open')"
                    />
                </BButtonGroup>
                <!-- Correctly closed -->
            </b-col>
            <b-col md="4" class="text-right">
                <BButtonGroup>
                    <td-form-button
                        id="td-import-btn"
                        :is-primary="true"
                        :on-btn-click="onImportClick"
                        icon="file-import"
                        :text="$t('forms.import')"
                    />
                </BButtonGroup>
                <!-- Correctly closed -->
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import isElectron from 'is-electron';
import { getProviderType } from '@/service/provider/providers.js';
import openThreatModel from '@/service/otm/openThreatModel.js';
import TdFormButton from '@/components/FormButton.vue';
import LocalFilePicker from '@/components/LocalFilePicker.vue';
import tmActions from '@/store/actions/threatmodel.js';
import { isValidSchema } from '@/service/schema/ajv';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('views:ImportModel');
// Components imported automatically via bootstrap-vue-next plugin

// only search for text files
const pickerFileOptions = {
    types: [
        {
            description: 'Threat models',
            accept: {
                'application/json': ['.json']
            }
        }
    ],
    multiple: false
};

export default {
    name: 'ImportModel',
    components: {
        TdFormButton,
        LocalFilePicker
    },
    data() {
        return {
            tmJson: ''
        };
    },
    computed: {
        ...mapState({
            providerType: (state) => getProviderType(state.provider.selected)
        }),
        prompt() {
            return (
                '{ ' +
                this.$t('threatmodel.dragAndDrop') +
                this.$t('threatmodel.jsonPaste') +
                ' ... }'
            );
        }
    },
    methods: {
        onDropFile(event) {
            if (event.dataTransfer.files.length === 1) {
                const file = event.dataTransfer.files[0];
                if (file.name.endsWith('.json')) {
                    file.text()
                        .then((text) => {
                            this.tmJson = text;
                            this.$store.dispatch(tmActions.update, {
                                fileName: file.name
                            });
                            this.onImportClick(file.name);
                        })
                        .catch((e) => this.$toast.error(e));
                } else {
                    this.$toast.error(this.$t('threatmodel.errors.onlyJsonAllowed'));
                }
            } else {
                this.$toast.error(this.$t('threatmodel.errors.dropSingleFileOnly'));
            }
        },
        async onOpenClick() {
            try {
                // For all users, use the native file picker if available
                if ('showOpenFilePicker' in window) {
                    try {
                        const [handle] = await window.showOpenFilePicker(pickerFileOptions);
                        const file = await handle.getFile();
                        if (file.name.endsWith('.json')) {
                            this.tmJson = await file.text();
                            this.$store.dispatch(tmActions.update, {
                                fileName: file.name
                            });
                            this.onImportClick(file.name);
                        } else {
                            this.$toast.error(this.$t('threatmodel.errors.onlyJsonAllowed'));
                        }
                    } catch (e) {
                        // If the user cancels the file picker, don't show an error
                        if (e.name !== 'AbortError') {
                            this.$toast.warning(this.$t('threatmodel.errors.open'));
                            log.warn(e);
                        }
                    }
                } else {
                    // For browsers that don't support the File System Access API,
                    // use a traditional file input element
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.json';

                    input.onchange = async (event) => {
                        const file = event.target.files[0];
                        if (file) {
                            if (file.name.endsWith('.json')) {
                                try {
                                    const text = await file.text();
                                    this.tmJson = text;
                                    this.$store.dispatch(tmActions.update, {
                                        fileName: file.name
                                    });
                                    this.onImportClick(file.name);
                                } catch (e) {
                                    this.$toast.error(this.$t('threatmodel.errors.invalidJson'));
                                    log.error(e);
                                }
                            } else {
                                this.$toast.error(this.$t('threatmodel.errors.onlyJsonAllowed'));
                            }
                        }
                    };

                    // Trigger the file input click
                    input.click();
                }
            } catch (e) {
                this.$toast.warning(this.$t('threatmodel.errors.open'));
                log.warn(e);
            }
        },

        // Handle file selected from our custom file picker
        onFileSelected(fileData) {
            if (fileData && fileData.content) {
                this.tmJson = fileData.content;
                this.$store.dispatch(tmActions.update, {
                    fileName: fileData.name
                });
                this.onImportClick(fileData.name);
            }
        },
        onImportClick(fileName) {
            let jsonModel;
            // check for empty input
            if (!this.tmJson || this.tmJson.trim() === '') {
                this.$toast.error(this.$t('threatmodel.errors.invalidJson'));
                log.error('Empty JSON input');
                return;
            }

            // check for JSON syntax errors, schema errors come later
            try {
                jsonModel = JSON.parse(this.tmJson);
            } catch (e) {
                this.$toast.error(this.$t('threatmodel.errors.invalidJson'));
                log.error(e);
                return;
            }

            // check for schema errors
            if (!isValidSchema(jsonModel)) {
                this.$toast.warning(this.$t('threatmodel.errors.invalidJson'));
            }

            // Identify if threat model is in OTM format and if so, convert OTM to dragon format
            if (Object.hasOwn(jsonModel, 'otmVersion')) {
                jsonModel = openThreatModel.convertOTMtoTD(jsonModel);
            }

            // save the threat model in the store
            this.$store.dispatch(tmActions.selected, jsonModel);

            if (isElectron()) {
                // tell the desktop server that the model has changed
                window.electronAPI.modelOpened(fileName);
            }

            let params;
            // this will deliberately fail if the threat model does not have a title in the summary
            try {
                params = Object.assign({}, this.$route.params, {
                    threatmodel: jsonModel.summary.title
                });
            } catch (e) {
                this.$toast.error(
                    this.$t('threatmodel.errors.invalidJson') + ' : ' + e.message
                );
                log.error(e);
                return;
            }

            // Only include the threatmodel parameter for routing
            // Other parameters like provider and folder are handled by the route configuration
            this.$router.push({
                name: `${this.providerType}ThreatModel`,
                params: {
                    threatmodel: params.threatmodel
                }
            });
        }
    }
};
</script>
