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
        @hide="closeDialog"
        hide-footer
    >
        <form @submit.prevent="addBranch">
            <b-row>
                <b-col lg="12" class="td-add-branch-field">
                    <b-form-group id="input-group-1" :label="$t('branch.name')" label-for="branchName">
                        <b-form-input
                            type="text"
                            id="branchName"
                            v-model="newBranchName"
                            @input="validate"
                            :state="isError"
                            lazy-formatter
                            trim
                            required
                        />
                        <b-form-invalid-feedback :state="isError">
                            {{ branchNameError }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col lg="12" class="td-add-branch-field">
                    <b-form-group id="input-group-2" :label="$t('branch.refBranch')" label-for="refBranch">
                        <td-form-select id="refBranch" v-model="refBranch" :options="branchNames" size="md"
                            required />
                    </b-form-group>
                </b-col>
            </b-row>
        </form>
        <hr/>
        <div class="td-add-branch-actions">
            <td-overlay
                :show="wait"
                small
            >
                <b-button variant="primary" type="submit" @click="addBranch" class="td-add-branch-button">{{ $t('branch.add') }}</b-button>
            </td-overlay>
            <b-button variant="secondary" @click="closeDialog" class="td-add-branch-button">{{ $t('branch.cancel') }}</b-button>
        </div>
    </b-modal>
</template>
<style lang="scss" scoped>
.td-add-branch-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
}

.td-add-branch-field {
    padding-bottom: 0.5rem;
}

.td-add-branch-button {
    margin: 0.25rem;
}
</style>
<script>
import TdFormSelect from '@/components/FormSelect.vue';
import TdOverlay from '@/components/Overlay.vue';
import branchActions from '@/store/actions/branch.js';

export default {
    name: 'AddBranchModal',
    components: {
        TdFormSelect,
        TdOverlay
    },
    props: {
        branches: {
            type: Array,
            validator: (value) => {
                return value.every((branch) => {
                    return typeof branch === 'string' || (branch.value && typeof branch.value === 'string');
                });
            },
            required: true
        }
    },
    data() {
        return {
            newBranchName: '',
            refBranch: '',
            modalTitle: this.$t('branch.addNew'),
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
    mounted() {
        this.refBranch = this.branchNames.slice(-1)[0];
    },
    watch: {
        branches: function (newBranches) {
            if (newBranches.length > 0) {
                this.refBranch = this.branchNames.slice(-1)[0];
            }
        }
    },
    methods: {
        closeDialog() {
            this.$emit('close-dialog');
        },
        validate() {
            if (this.newBranchName === '') {
                this.branchNameError = this.$t('branch.nameRequired');
                this.isError = false;
            } else if (this.branchNames.includes(this.newBranchName)) {
                this.branchNameError = this.$t('branch.nameExists');
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
            this.$store.dispatch(branchActions.create, {branchName: this.newBranchName, refBranch: this.refBranch});

            // sometimes the branch is not immediately available, so we wait for it (only for 30 seconds)
            for (let i = 0; i < 30; i++) {
                await this.$store.dispatch(branchActions.fetch, { page: 1 });
                if (this.branchNames.includes(this.newBranchName)) {
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            this.wait = false;
            this.closeDialog();
        }
    }
};
</script>
