<template>    
    <b-col lg>
        <b-jumbotron class="text-center">
            <router-link :to="to">
                <font-awesome-icon
                :icon="[iconPreface, icon]"
                size="3x"
                class="action-icon"
                ></font-awesome-icon>
            </router-link>
            <br />
            {{ description }}
        </b-jumbotron>
    </b-col>
</template>

<style lang="scss" scoped>
.action-icon {
    color: $theme-primary;
    margin-bottom: 15px;
}
</style>

<script>
export default {
    name: 'TdDashboardAction',
    props: {
        to: String,
        icon: String,
        iconPreface: {
            type: String,
            default: 'fas'
        },
        description: String
    }
};
</script>
