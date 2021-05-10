<template>
    <div>
        <b-row>
            <b-col>
                <b-jumbotron header="Welcome!">
                    <p>
                        You're ready to start making your application designs more secure.
                        You can open an existing threat model or create a new one by choosing
                        one of the options below.
                    </p>
                </b-jumbotron>
            </b-col>
        </b-row>
        <b-row>
            <td-dashboard-action
                v-for="(action, idx) in actions"
                :key="idx"
                :to="action.to"
                :icon="action.icon"
                :iconPreface="action.iconPreface"
                :description="action.description"
            ></td-dashboard-action>
        </b-row>
    </div>
</template>

<style lang="scss" scoped>
.action-icon {
    color: $orange;
    margin-bottom: 15px;
}
</style>

<script>
import { mapState } from 'vuex';

import TdDashboardAction from '@/components/DashboardAction.vue';
import { getDashboardActions } from '@/service/providers.js';

export default {
    name: 'Dashboard',
    components: {
        TdDashboardAction
    },
    computed: mapState({
        actions: state => getDashboardActions(state.provider.selected)
    })
};
</script>
