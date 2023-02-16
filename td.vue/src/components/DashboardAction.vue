<template>    
    <b-col lg>
        <b-jumbotron class="text-center action-pane">
            <router-link :to="to">
                <font-awesome-icon
                :icon="[iconPreface, icon]"
                size="3x"
                class="action-icon"
                ></font-awesome-icon>
            </router-link>
            <br />
            {{ $t(`dashboard.actions.${description}`) }}
        </b-jumbotron>
    </b-col>
</template>

<style lang="scss" scoped>
.action-icon {
    color: $orange;
    margin-bottom: 15px;
}

.action-pane {
    min-height: 100%;
    margin-bottom: 0px;
}
</style>

<script>
export default {
    name: 'TdDashboardAction',
    props: {
        to: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: true
        },
        iconPreface: {
            type: String,
            default: 'fas',
            required: false
        },
        description: {
            type: String,
            required: true
        }
    }
};
</script>
