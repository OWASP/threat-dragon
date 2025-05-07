<template>
    <b-container>
        <b-row class="mt-3 mb-3">
            <b-col>
                <h1>{{ $t('threatmodel.new.title') }}</h1>
                <p class="lead">
                    {{ $t('threatmodel.new.description') }}
                </p>
            </b-col>
        </b-row>
        <b-row>
            <b-col lg="8" offset-lg="2">
                <b-card class="mt-3 mb-5">
                    <b-form @submit.prevent="saveModel">
                        <b-form-group
                            :label="$t('threatmodel.title') + ' *'"
                            label-for="threat-model-title"
                            class="required-field"
                        >
                            <b-form-input
                                id="threat-model-title"
                                v-model="threatModel.summary.title"
                                required
                                :placeholder="$t('threatmodel.placeholder.title')"
                            />
                        </b-form-group>

                        <b-form-group :label="$t('threatmodel.owner')" label-for="threat-model-owner">
                            <b-form-input
                                id="threat-model-owner"
                                v-model="threatModel.summary.owner"
                                :placeholder="$t('threatmodel.placeholder.owner')"
                            />
                        </b-form-group>

                        <b-form-group :label="$t('threatmodel.description')" label-for="threat-model-description">
                            <b-form-textarea
                                id="threat-model-description"
                                v-model="threatModel.summary.description"
                                rows="3"
                                :placeholder="$t('threatmodel.placeholder.description')"
                            />
                        </b-form-group>

                        <b-form-group :label="$t('threatmodel.reviewer')" label-for="threat-model-reviewer">
                            <b-form-input
                                id="threat-model-reviewer"
                                v-model="threatModel.detail.reviewer"
                                :placeholder="$t('threatmodel.placeholder.reviewer')"
                            />
                        </b-form-group>

                        <div class="text-right mt-4">
                            <b-button type="submit" variant="primary">
                                {{ $t('forms.save') }}
                            </b-button>
                        </div>
                    </b-form>
                    <small class="text-muted mt-3">* {{ $t('forms.requiredField') }}</small>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapState } from 'vuex';

import isElectron from 'is-electron';
import { getProviderType } from '@/service/provider/providers.js';
import tmActions from '@/store/actions/threatmodel.js';

export default {
    name: 'NewThreatModel',
    components: {
    },
    data() {
        return {
            threatModel: {
                summary: {
                    title: '',
                    owner: '',
                    description: '',
                    id: 0
                },
                detail: {
                    contributors: [],
                    diagrams: [],
                    diagramTop: 0,
                    reviewer: '',
                    threatTop: 0
                }
            }
        };
    },
    computed: mapState({
        providerType: (state) => getProviderType(state.provider.selected),
        version: (state) => state.packageBuildVersion
    }),
    mounted() {
        this.$store.dispatch(tmActions.clear);
        this.threatModel.version = this.version;
    },
    methods: {
        saveModel() {
            // Store the threat model in Vuex
            this.$store.dispatch(tmActions.selected, this.threatModel);

            const params = Object.assign({}, this.$route.params, {
                threatmodel: this.threatModel.summary.title
            });

            if (isElectron()) {
                // tell the desktop server that the model has changed
                window.electronAPI.modelOpened(this.threatModel.summary.title);
            }

            // Route based on provider type
            if (this.providerType === 'local' || this.providerType === 'desktop') {
                this.$router.push({ name: `${this.providerType}ThreatModelEdit`, params });
            } else if (this.providerType === 'google') {
                // For Google provider, first go to DriveAccess to select save location
                // Store the model in Vuex first
                this.$store.dispatch(tmActions.update, {
                    title: this.threatModel.summary.title,
                    data: this.threatModel
                });

                // Then navigate to the save screen
                this.$router.push({
                    name: `${this.providerType}SaveModel`,
                    params: {
                        ...this.$route.params
                    }
                });
            } else {
                // Other Git providers
                this.$router.push({ name: `${this.providerType}ThreatModelCreate`, params });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.required-field label {
    font-weight: 600;
}

.form-group {
    margin-bottom: 2.5rem;
    /* Increased from 1.5rem to 2.5rem */
}

.form-group label {
    margin-top: 1rem;
}
</style>
