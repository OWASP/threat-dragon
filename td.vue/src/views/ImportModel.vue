<template>
    <div>
        <b-row>
            <b-col>
                <b-jumbotron class="text-center">
                    <h4>
                        {{ $t('forms.open') }} / {{ $t('dashboard.actions.importExisting') }}
                    </h4>
                </b-jumbotron>
            </b-col>
        </b-row>
        <b-row>
            <b-col md=8 offset=2>
                <b-form>
                    <b-form-row>
                        <b-col @drop.prevent="onDropFile" @dragenter.prevent @dragover.prevent>
                            <b-form-group
                                id="json-input-group"
                                label-for="json-input">
                                <b-form-textarea
                                    id="json-input"
                                    v-model="tmJson"
                                    :placeholder="prompt"
                                    rows="16"
                                ></b-form-textarea>
                            </b-form-group>
                        </b-col>
                    </b-form-row>
                </b-form>
            </b-col>
        </b-row>
        <b-row>
            <b-col md=4 offset=2  class="text-left">
                <b-btn-group>
                    <td-form-button
                        id="td-open-btn"
                        :onBtnClick="onOpenClick"
                        icon="folder-open"
                        :text="$t('forms.open')" />
                </b-btn-group>
            </b-col>
            <b-col md=4 class="text-right">
                <b-btn-group>
                    <td-form-button
                        id="td-import-btn"
                        :isPrimary="true"
                        :onBtnClick="onImportClick"
                        icon="file-import"
                        :text="$t('forms.import')" />
                </b-btn-group>
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
import tmActions from '@/store/actions/threatmodel.js';
import { isValidSchema } from '@/service/schema/ajv';

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
        TdFormButton
    },
    computed: {
        ...mapState({
            providerType: (state) => getProviderType(state.provider.selected)
        }),
        prompt() { return '{ ' + this.$t('threatmodel.dragAndDrop') + this.$t('threatmodel.jsonPaste') + ' ... }'; }
    },
    data() {
        return {
            tmJson: ''
        };
    },
    methods: {
        onDropFile(event) {
            if (event.dataTransfer.files.length === 1) {
                let file = event.dataTransfer.files[0];
                if (file.name.endsWith('.json')) {
                    file.text()
                        .then(text => {
                            this.tmJson = text;
                            this.$store.dispatch(tmActions.update, { fileName: file.name });
                            this.onImportClick(file.name);
                        })
                        .catch(e => this.$toast.error(e));
                } else {
                    this.$toast.error(this.$t('threatmodel.errors.onlyJsonAllowed'));
                }
            } else {
                this.$toast.error(this.$t('threatmodel.errors.dropSingleFileOnly'));
            }
        },
        async onOpenClick() {
            if ('showOpenFilePicker' in window) {
                // Chrome and Edge browsers return an array of file handles
                try {
                    const [handle] = await window.showOpenFilePicker(pickerFileOptions);
                    let file = await handle.getFile();
                    if (file.name.endsWith('.json')) {
                        this.tmJson = await file.text();
                        this.$store.dispatch(tmActions.update, { fileName: file.name });
                        this.onImportClick(file.name);
                    } else {
                        this.$toast.error(this.$t('threatmodel.errors.onlyJsonAllowed'));
                    }
                } catch (e) {
                    // any error is most likely due to the picker being cancelled, which is benign so just warn
                    this.$toast.warning(this.$t('threatmodel.errors.open'));
                    console.warn(e);
                }
            } else {
                this.$toast.error('File picker is not yet supported on this browser: use Paste or Drag and Drop');
            }
        },
        onImportClick(fileName) {
            let jsonModel;
            // check for JSON syntax errors, schema errors come later
            try {
                jsonModel = JSON.parse(this.tmJson);
            } catch (e) {
                this.$toast.error(this.$t('threatmodel.errors.invalidJson'));
                console.error(e);
                return;
            }

            // check for schema errors
            if(!isValidSchema(jsonModel)){
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
                this.$toast.error(this.$t('threatmodel.errors.invalidJson') + ' : ' + e.message);
                console.error(e);
                return;
            }

            this.$router.push({ name: `${this.providerType}ThreatModel`, params });
        }
    }

};

</script>
