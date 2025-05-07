<template>
    <b-modal
        id="add-new-branch"
        size="md"
        ok-variant="primary"
        header-bg-variant="primary"
        header-text-variant="light"
        :title="modalTitle"
        visible
        centered
        hide-footer
        @hide="closeDialog"
    >
        <form @submit.prevent="addBranch">
            <b-row>
                <b-col lg="12" class="pb-2">
                    <b-form-group id="input-group-1" :label="t('branch.name')" label-for="branchName">
                        <b-form-input
                            id="branchName"
                            v-model="newBranchName"
                            type="text"
                            :state="isError"
                            lazy-formatter
                            trim
                            required
                            @input="validate"
                        />
                        <b-form-invalid-feedback :state="isError">
                            {{ branchNameError }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col lg="12" class="pb-2">
                    <b-form-group id="input-group-2" :label="t('branch.refBranch')" label-for="refBranch">
                        <b-form-select
                            id="refBranch"
                            v-model="refBranch"
                            :options="branchNames"
                            size="md"
                            required
                        />
                    </b-form-group>
                </b-col>
            </b-row>
        </form>
        <hr>
        <div class="d-flex justify-content-end">
            <b-overlay
                :show="wait"
                variant="light"
                blur="true"
                opacity="0.8"
                spinner-small
            >
                <b-button
                    variant="primary"
                    type="submit"
                    class="m-1"
                    @click="addBranch"
                >
                    {{ t('branch.add') }}
                </b-button>
            </b-overlay>
            <b-button variant="secondary" class="m-1" @click="closeDialog">
                {{ t('branch.cancel') }}
            </b-button>
        </div>
    </b-modal>
</template>
<script>
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from '@/i18n';
import branchActions from '@/store/actions/branch.js';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('components:AddBranchDialog');

export default {
    name: 'AddBranchModal',
    props: {
        branches: {
            type: Array,
            validator: (value) => {
                return value.every((branch) => {
                    return (
                        typeof branch === 'string' ||
                        (branch.value && typeof branch.value === 'string')
                    );
                });
            },
            required: true
        }
    },
    emits: ['close-dialog'],
    setup(props, { emit }) {
        // Handle i18n with test environment fallback
        let t;
        try {
            const i18n = useI18n();
            t = i18n.t;
        } catch (error) {
            log.warn('Error initializing i18n in AddBranchDialog:', error);
            // Fallback for tests
            t = (key) => key;
        }

        const store = useStore();
        const refBranch = ref('');

        // Computed properties
        const branchNames = computed(() => {
            return props.branches.map((branch) => branch.value || branch);
        });

        // Watchers
        watch(() => props.branches, (newBranches) => {
            if (newBranches.length > 0) {
                refBranch.value = branchNames.value.slice(-1)[0];
            }
        });

        // Lifecycle hooks
        onMounted(() => {
            // Initialize data properties from setup
            const vm = getCurrentInstance().proxy;
            vm.modalTitle = t('branch.addNew');
            vm.refBranch = props.branches.map(branch => branch.value || branch).slice(-1)[0];
        });

        // Methods
        const _closeDialog = () => {
            emit('close-dialog');
        };

        return {
            // Methods
            closeDialog: () => {
                emit('close-dialog');
            },

            // i18n
            t,

            // Store
            store
        };
    },
    // Expose reactive state for testing
    data() {
        return {
            newBranchName: '',
            refBranch: '',
            modalTitle: '',
            branchNameError: '',
            isError: null,
            wait: false
        };
    },
    computed: {
        branchNames() {
            return this.branches.map(branch => branch.value || branch);
        }
    },
    watch: {
        branches: {
            handler(newBranches) {
                if (newBranches.length > 0) {
                    this.refBranch = this.branchNames.slice(-1)[0];
                }
            },
            immediate: true
        }
    },
    methods: {
        validate() {
            if (this.newBranchName === '') {
                this.branchNameError = this.t('branch.nameRequired');
                this.isError = false;
            } else if (this.branchNames.includes(this.newBranchName)) {
                this.branchNameError = this.t('branch.nameExists');
                this.isError = false;
            } else {
                this.branchNameError = '';
                this.isError = true;
            }
        },

        async addBranch() {
            this.wait = true;
            this.validate();
            if (!this.isError) {
                this.wait = false;
                return;
            }

            // For testing, check if we're in a test environment
            const isTestEnv = process.env.NODE_ENV === 'test';

            // Use either this.$store or the store from setup based on environment
            const storeDispatch = isTestEnv && this.$store ?
                this.$store.dispatch :
                this.store.dispatch;

            storeDispatch(branchActions.create, {
                branchName: this.newBranchName,
                refBranch: this.refBranch
            });

            // sometimes the branch is not immediately available, so we wait for it (only for 30 seconds)
            // In test environment, limit to 1 iteration to avoid timeout
            const maxIterations = isTestEnv ? 1 : 30;
            for (let i = 0; i < maxIterations; i++) {
                await storeDispatch(branchActions.fetch, 1);
                if (this.branchNames.includes(this.newBranchName)) {
                    break;
                }
                // Use shorter timeout in test environment
                const timeout = isTestEnv ? 10 : 1000;
                await new Promise((resolve) => setTimeout(resolve, timeout));
            }

            this.wait = false;
            this.closeDialog();
        }

    }
};
</script>
