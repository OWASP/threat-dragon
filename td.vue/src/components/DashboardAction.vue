<template>    
    <b-col lg>
    <router-link :to="to" class="action-pane-link">
        <b-jumbotron class="text-center action-pane">
                <font-awesome-icon
                :icon="[iconPreface, icon]"
                size="4x"
                class="action-icon"
                ></font-awesome-icon>
            <br />
            {{ $t(`dashboard.actions.${description}`) }}
        </b-jumbotron>
            </router-link>
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
.action-pane:hover{
box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
.action-pane-link:hover {
    text-decoration: none;
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
