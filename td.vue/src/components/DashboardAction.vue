<template>
    <b-col lg>
        <router-link :to="to" class="action-pane-link">
            <b-container class="text-center action-pane p-4 bg-light rounded shadow-sm">
                <font-awesome-icon :icon="[iconPreface, icon]" size="4x" class="action-icon" />
                <br>
                {{ t(`dashboard.actions.${description}`) }}
            </b-container>
        </router-link>
    </b-col>
</template>

<script>
import { useI18n } from '@/i18n';

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
    setup() {
        // Use the Composition API to access i18n
        const { t } = useI18n();
        
        // Return the translation function to make it available in the template
        return { t };
    }
};
</script>

<style lang="scss" scoped>
    @use '@/styles/colors.scss' as colors;
    .action-icon {
        color: colors.$orange;
        margin-bottom: 15px;
    }

    .action-pane {
        min-height: 100%;
        margin-bottom: 0px;
    }
    .action-pane:hover {
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }
    .action-pane-link:hover {
        text-decoration: none;
    }
</style>
