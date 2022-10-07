<template>
    <div>
        <b-row>
            <b-col>
                <b-jumbotron class="text-center">
                    <h4>
                        {{ $t('dashboard.actions.import') }}
                    </h4>
                </b-jumbotron>
            </b-col>
        </b-row>
        <b-row>
            <b-col md=8 offset=2>
                <b-form>
                    <b-form-row>
                        <b-col @drop.prevent="dropFile" @dragenter.prevent @dragover.prevent>
                            <b-form-group
                                id="json-input-group"
                                :label="$t('threatmodel.jsonPaste')"
                                label-for="json-input">
                                <b-form-textarea
                                    id="json-input"
                                    v-model="tmJson"
                                    placeholder="{ ... }"
                                    rows="16"
                                ></b-form-textarea>
                            </b-form-group>
                        </b-col>
                    </b-form-row>
                </b-form>
            </b-col>
        </b-row>
        <b-row>
            <b-col md=8 offset=2 class="text-right">
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

import { getProviderType } from '@/service/provider/providers.js';
import TdFormButton from '@/components/FormButton.vue';
import tmActions from '@/store/actions/threatmodel.js';

export default {
    name: 'Import',
    components: {
        TdFormButton
    },
    computed: mapState({
        providerType: state => getProviderType(state.provider.selected)
    }),
    data() {
        return {
            tmJson: ''
        };
    },
    methods: {
        onImportClick() {
            let jsonModel;
            try {
                jsonModel = JSON.parse(this.tmJson);
            } catch (e) {
                this.invalidJSONError();
                return;
            }

            this.$store.dispatch(tmActions.selected, jsonModel);
            const params = Object.assign({}, this.$route.params, {
                threatmodel: jsonModel.summary.title
            });
            this.$router.push({ name: `${this.providerType}ThreatModel`, params });
        },
        dropFile(e) {
            if (e.dataTransfer.files.length === 1) {
                let file = e.dataTransfer.files[0];
                if (file.name.endsWith('.json')) {
                    file.text()
                        .then(text => {
                            this.tmJson = text;
                            this.onImportClick();
                        })
                        .catch(e => this.$toast.error(e));
                } else {
                    this.$toast.error(this.$t('threatmodel.onlyJsonAllowed'));
                }
            } else {
                this.$toast.error(this.$t('threatmodel.dropSingleFileOnly'));
            }
        },
        invalidJSONError() {
            this.$toast.error(this.$t('threatmodel.invalidJson'));
        }
    }
};

</script>
