<template>
    <div></div>
</template>

<script>
import { mapState } from 'vuex';

import isElectron from 'is-electron';
import { getProviderType } from '@/service/provider/providers.js';
import tmActions from '@/store/actions/threatmodel.js';

export default {
    name: 'NewThreatModel',
    computed: mapState({
        providerType: (state) => getProviderType(state.provider.selected),
        version: (state) => state.packageBuildVersion
    }),
    mounted() {
        this.$store.dispatch(tmActions.clear);
        const newTm = {
            'version': '2.3.0',
            'summary': {
                'title': 'New Threat Model',
                'owner': '',
                'description': '',
                'id': 0
            },
            'detail': {
                'contributors': [],
                'diagrams': [
                    {
                        'id': 0,
                        'title': 'New generic diagram',
                        'diagramType': 'Generic',
                        'placeholder': 'New generic diagram description',
                        'thumbnail': './public/content/images/thumbnail.stride.jpg',
                        'version': '2.3.0',
                        'cells': []
                    }
                ],
                'diagramTop': 0,
                'reviewer': '',
                'threatTop': 0
            }
        };

        this.$store.dispatch(tmActions.selected, newTm);
        const params = Object.assign({}, this.$route.params, {
            threatmodel: newTm.summary.title
        });
        if (isElectron()) {
            // tell the desktop server that the model has changed
            window.electronAPI.modelOpened(newTm.summary.title);
        }
        if (this.providerType === 'local' || this.providerType === 'desktop') {
            this.$router.push({ name: `${this.providerType}ThreatModelEdit`, params });
        } else {
            this.$router.push({ name: `${this.providerType}ThreatModelCreate`, params });
        }
    }
};
</script>
