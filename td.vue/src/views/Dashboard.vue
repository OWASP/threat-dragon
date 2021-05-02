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
    color: $theme-primary;
    margin-bottom: 15px;
}
</style>

<script>
import TdDashboardAction from '@/components/DashboardAction.vue';
import { getDashboardActions } from '@/service/providers.js';

export default {
    name: 'Dashboard',
    components: {
        TdDashboardAction
    },
    data() {
        return {
            actions: getDashboardActions(this.$store.state.auth.provider)
        };
    }
};
</script>
