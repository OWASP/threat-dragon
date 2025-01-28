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
        @hide="closeAddBranchDialog"
    >
        <form @submit.prevent="addBranch">
            <b-row>
                <b-col lg="12" class="pb-2">
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
                <b-col lg="12" class="pb-2">
                    <b-form-group id="input-group-2" :label="$t('branch.refBranch')" label-for="refBranch">
                        <b-form-select id="refBranch" v-model="refBranch" :options="branches" size="md" required/>
                    </b-form-group>
                </b-col>
            </b-row>
        </form>
        <template #modal-footer>
            <b-button variant="primary" type="submit" @click="addBranch">{{ $t('branch.add') }}</b-button>
            <b-button variant="secondary" @click="closeAddBranchDialog">{{ $t('branch.cancel') }}</b-button>
        </template>
    </b-modal>
</template>
<script>
import branchActions from '@/store/actions/branch.js';

export default {
    name: 'AddBranchModal',
    props: {
        branches: Array,
    },
    data() {
        return {
            newBranchName: '',
            refBranch: '',
            modalTitle: this.$t('branch.addNew'),
            branchNameError: '',
            isError: null,
        };
    },
    mounted() {
        this.refBranch = this.branches.slice(-1)[0];
    },
    watch: {
        branches: function (newBranches) {
            if (newBranches.length > 0) {
                this.refBranch = newBranches[0];
            }
        }
    },
    methods: {
        closeAddBranchDialog() {
            this.$emit('close-add-branch-dialog');
        },
        validate() {
            if (this.newBranchName === '') {
                this.branchNameError = this.$t('branch.nameRequired');
                this.isError = false;
            } else if (this.branches.includes(this.newBranchName)) {
                this.branchNameError = this.$t('branch.nameExists');
                this.isError = false;
            } else {
                this.branchNameError = '';
                this.isError = true;
            }
        },
        addBranch() {
            this.validate();
            if (!this.isError) {
                return;
            }
            this.$store.dispatch(branchActions.create, {branchName: this.newBranchName, refBranch: this.refBranch});
            this.closeAddBranchDialog();
            this.$store.dispatch(branchActions.fetch, 1);
        }
    }
};
</script>
