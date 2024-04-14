<template>    
    <b-col lg>
    <router-link :to="to" class="action-pane-link">
        <b-jumbotron class="text-center action-pane" :class="{ 'dark-mode': currentTheme === 'dark' }">
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
.dark-mode {
    background-color: $dark-card-bg; // Dark background for dark mode
    color: $dark-text; // Light text for dark mode
}
</style>

<script>
import { mapGetters } from 'vuex';
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
    },
    computed: {
        ...mapGetters({
            currentTheme: 'theme/currentTheme' // Get the current theme from the store
        })
    }
};
</script>
