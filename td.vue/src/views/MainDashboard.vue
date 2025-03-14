<template>
    <div>
        <b-row>
            <b-col>
                <b-container class="text-center p-4 bg-light rounded shadow-sm">
                    <h4>
                        {{ $t("dashboard.welcome.title") }}
                    </h4>
                    <p>
                        {{ $t("dashboard.welcome.description") }}
                    </p>
                </b-container>
            </b-col>
        </b-row>

        <b-row>
            <td-dashboard-action
                class="dashboard-action"
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
    color: var(--orange); /* Updated to use CSS custom property */
    margin-bottom: 15px;
}
.dashboard-action {
    padding-bottom: 2rem;
}
</style>

<script>
import { mapState } from "vuex";
import TdDashboardAction from "@/components/DashboardAction.vue";
import { getDashboardActions } from "@/service/provider/providers.js";
export default {
    name: "MainDashboard",
    components: {
        TdDashboardAction,
    },
    computed: mapState({
        actions: (state) => getDashboardActions(state.provider.selected),
    }),
};
</script>