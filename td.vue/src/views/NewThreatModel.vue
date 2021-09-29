<template>
    <div></div>
</template>

<script>
import { mapState } from 'vuex';

import { getProviderType } from '@/service/provider/providers.js';
import { providerTypes } from '@/service/provider/providerTypes.js';
import tmActions from '@/store/actions/threatmodel.js';

export default {
    name: 'NewThreatModel',
    computed: mapState({
        providerType: state => getProviderType(state.provider.selected)
    }),
    mounted() {
        this.$store.dispatch(tmActions.clear);
        const newTm = {
            summary: {
                title: 'New Threat Model',
                owner: '',
                description: '',
                id: 0
            },
            detail: {
                contributors: [],
                diagrams: [],
                reviewer: ''
            }
        };
        if (this.providerType === providerTypes.local) {
            this.$store.dispatch(tmActions.selected, newTm);
        } else {
            this.$store.dispatch(tmActions.create, newTm);
        }
        const params = Object.assign({}, this.$route.params, {
            threatmodel: newTm.summary.title
        });
        this.$router.push({ name: `${this.providerType}ThreatModelEdit`, params });
    }
};
</script>