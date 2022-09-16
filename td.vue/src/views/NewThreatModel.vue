<template>
    <div></div>
</template>

<script>
import { mapState } from 'vuex';

import { getProviderType } from '@/service/provider/providers.js';
import tmActions from '@/store/actions/threatmodel.js';

export default {
    name: 'NewThreatModel',
    computed: mapState({
        providerType: state => getProviderType(state.provider.selected),
        version: 'packageBuildVersion'
    }),
    mounted() {
        this.$store.dispatch(tmActions.clear);
        const newTm = {
            version: this.version,
            summary: {
                title: 'New Threat Model',
                owner: '',
                description: '',
                id: 0
            },
            detail: {
                contributors: [],
                diagrams: [],
                reviewer: '',
                threatTop: 0
            }
        };

        this.$store.dispatch(tmActions.selected, newTm);
        const params = Object.assign({}, this.$route.params, {
            threatmodel: newTm.summary.title
        });
        this.$router.push({ name: `${this.providerType}ThreatModelEdit`, params });
    }
};
</script>
