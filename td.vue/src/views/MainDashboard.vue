<template>
    <div>
        <b-row>
            <b-col>
                <div class="p-5 mb-4 bg-light rounded-3">
                    <h1>{{ $t('dashboard.welcome.title') }}</h1>
                    <p>
                        {{ $t('dashboard.welcome.description') }}
                    </p>
                </div>
            </b-col>
        </b-row>
        <b-row >
            <td-dashboard-action class="dashboard-action"
                v-for="(action, idx) in actions"
                :key="idx"
                :to="action.to"
                :icon="action.icon"
                :iconPreface="action.iconPreface"
                :description="action.key"
            ></td-dashboard-action>
        </b-row>
    </div>
</template>

<style lang="scss" scoped>
.action-icon {
    color: $orange;
    margin-bottom: 15px;
}

.dashboard-action {
    padding-bottom: 2rem;
}

</style>

<script>
import { mapState } from 'vuex';

import TdDashboardAction from '@/components/DashboardAction.vue';
import { getDashboardActions } from '@/service/provider/providers.js';
import tmActions from '@/store/actions/threatmodel.js';

export default {
    name: 'MainDashboard',
    components: {
        TdDashboardAction
    },
    computed: mapState({
        actions: (state) => getDashboardActions(state.provider.selected)
    }),
    mounted() {
        // Clear any stale threatmodel state when returning to dashboard
        // This ensures "New Threat Model" starts fresh, not with leftover template data
        this.$store.dispatch(tmActions.clear);
    }
};
</script>
