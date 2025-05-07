<template>
    <b-container fluid>
        <div class="welcome-jumbotron">
            <b-row class="text-center mb-2">
                <b-col md="12">
                    <h1 class="display-3 text-center">
                        {{ t('tos.title') }}
                    </h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="12">
                    <div class="td-operator mt-5 text-left">
                        <h2>{{ operator.heading }}</h2>
                    </div>
                    <div class="td-operator mt-5 text-left">
                        {{ t('operator.operatedby') }}
                    </div>
                    <div class="td-operator mt-2 text-left">
                        {{ t('operator.name') }}
                    </div>
                    <div class="td-operator mt-2 text-left">
                        {{ t('operator.contact') }}
                    </div>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="12">
                    <div class="td-description mt-5 text-left">
                        <h2>{{ t('tos.title') }}</h2>
                        <p>{{ t('tos.lastUpdated') }}</p>
                        <p>{{ t('tos.introduction') }}</p>
                        <div v-for="(section, index) in tos.sections" :key="index" class="mt-4">
                            <h2>{{ section.heading }}</h2>
                            <p>{{ section.content }}</p>
                        </div>
                        <p class="mt-4">
                            {{ t('tos.contact') }}
                        </p>
                    </div>
                </b-col>
            </b-row>
        </div>
    </b-container>
</template>

<script>
import { useI18n } from '@/i18n';
import i18n from '@/i18n';

export default {
    name: 'ToSPage',
    setup() {
        const { t, locale } = useI18n();

        // Get the current locale
        const currentLocale = locale.value;

        // Default sections in case i18n.get() is not available (e.g. in tests)
        let tosSections = [
            { heading: 'Section 1', content: 'Content 1' },
            { heading: 'Section 2', content: 'Content 2' }
        ];
        
        try {
            // Access the raw messages to get the sections array directly
            if (i18n && typeof i18n.get === 'function') {
                const messages = i18n.get()?.global?.messages?.value;
                if (messages && messages[currentLocale]?.tos?.sections) {
                    tosSections = messages[currentLocale].tos.sections;
                }
            }
        } catch (error) {
            console.warn('Error accessing i18n messages:', error);
            // Default sections are already set above
        }

        const tos = {
            sections: tosSections
        };

        // Create operator object for the template
        const operator = {
            heading: t('operator.heading')
        };

        return {
            t,
            tos,
            operator
        };
    }
};
</script>

<style lang="scss" scoped>
/* Recreating BootstrapVue's b-jumbotron styling */
.welcome-jumbotron {
    background-color: #f8f9fa;
    /* Light grey background like BootstrapVue jumbotron */
    padding: 3rem 2rem;
    /* Increase padding to match BootstrapVue */
    border-radius: 0.3rem;
    /* Add rounded corners */
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    /* Light shadow */
    margin-bottom: 1.5rem;
    /* Space below jumbotron */
    display: flex;
    flex-direction: column;
}

.td-description {
    font-size: 20px;
    max-width: 80%;
    margin: 10px auto;
    /* Keep horizontal centering of the container */
    text-align: left;
    /* Left-justify the text */
}

.td-operator {
    font-size: 18px;
    max-width: 80%;
    margin: 10px auto;
    font-weight: 500;
}

.td-contact {
    font-size: 18px;
    max-width: 80%;
    margin: 20px auto 10px;
    font-style: italic;
}

/* Custom styling for lists in the content */
.td-description ul {
    display: block;
    /* Change from table to block display */
    text-align: left;
    padding-left: 2rem;
    /* Add some padding for list items */
}

.td-description h2 {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    text-align: left;
    /* Left-justify headings */
}
</style>
