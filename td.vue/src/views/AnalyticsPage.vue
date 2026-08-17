<template>
    <b-container fluid>
        <td-hero id="analytics-page">
            <b-row class="text-center mb-4">
                <b-col md="12">
                    <h1 class="display-4">
                        <font-awesome-icon icon="chart-bar" class="mr-2" />
                        {{ $t("analytics.title") }}
                    </h1>
                </b-col>
            </b-row>

            <b-row>
                <b-col md="10" offset-md="1">
                    <div v-if="plausibleConfig.enabled" class="analytics-status analytics-enabled mb-4">
                        <p id="analytics-status-enabled">
                            <font-awesome-icon icon="check-circle" class="text-success mr-1" />
                            {{ $t("analytics.enabled") }}
                        </p>
                        <p>{{ $t("analytics.description") }}</p>

                        <div class="analytics-details mb-3">
                            <p>
                                <strong>{{ $t("analytics.instanceUrl") }}:</strong>
                                <a id="analytics-instance-url"
                                    :href="plausibleConfig.url"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    {{ plausibleConfig.url }}
                                </a>
                            </p>
                            <p v-if="plausibleConfig.domain">
                                <strong>{{ $t("analytics.trackedDomain") }}:</strong>
                                <span id="analytics-tracked-domain">{{ plausibleConfig.domain }}</span>
                            </p>
                        </div>

                        <div class="mb-3">
                            <a :href="plausibleDataPolicyUrl"
                                target="_blank"
                                rel="noopener noreferrer"
                                id="analytics-data-policy-link">
                                {{ $t("analytics.dataPolicy") }}
                            </a>
                        </div>
                    </div>

                    <div v-else class="analytics-status analytics-disabled mb-4">
                        <p id="analytics-status-disabled">
                            <font-awesome-icon icon="times-circle" class="text-muted mr-1" />
                            {{ $t("analytics.disabled") }}
                        </p>
                    </div>

                    <h2 class="mt-4 mb-3">{{ $t("analytics.trackedEvents") }}</h2>
                    <p class="mb-3">{{ $t("analytics.eventsExplanation") }}</p>

                    <b-table-simple
                        id="analytics-events-table"
                        striped
                        hover
                        responsive
                        class="analytics-events-table">
                        <b-thead>
                            <b-tr>
                                <b-th>{{ $t("analytics.eventName") }}</b-th>
                                <b-th>{{ $t("analytics.eventDescription") }}</b-th>
                            </b-tr>
                        </b-thead>
                        <b-tbody>
                            <b-tr v-for="(event, idx) in eventList" :key="idx">
                                <b-td><code>{{ event.name }}</code></b-td>
                                <b-td>{{ event.description }}</b-td>
                            </b-tr>
                        </b-tbody>
                    </b-table-simple>
                </b-col>
            </b-row>
        </td-hero>
    </b-container>
</template>

<style lang="scss" scoped>
.analytics-status {
    padding: 20px;
    border-radius: 8px;
    font-size: 16px;
}

.analytics-enabled {
    background-color: rgba(40, 167, 69, 0.1);
    border: 1px solid rgba(40, 167, 69, 0.3);
}

.analytics-disabled {
    background-color: rgba(108, 117, 125, 0.1);
    border: 1px solid rgba(108, 117, 125, 0.3);
}

.analytics-events-table code {
    font-size: 13px;
}
</style>

<script>
import { mapGetters } from 'vuex';
import { analyticsEvents, analyticsEventDescriptions } from '@/service/analyticsEvents';
import TdHero from '@/components/Hero.vue';

export default {
    name: 'AnalyticsPage',
    components: {
        TdHero
    },
    computed: {
        ...mapGetters(['plausibleConfig']),
        plausibleDataPolicyUrl () {
            return 'https://plausible.io/data-policy';
        },
        eventList () {
            return Object.values(analyticsEvents).map(name => ({
                name,
                description: analyticsEventDescriptions[name] || name
            }));
        }
    }
};
</script>
