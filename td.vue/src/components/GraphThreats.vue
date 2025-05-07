<template>
    <b-card class="threat-card h-100">
        <b-card-text>
            <b-row>
                <b-col>
                    <button
                        v-if="!!number"
                        type="button"
                        class="threat-title text-truncate d-block btn btn-link p-0 text-left"
                        @click="threatSelected"
                    >
                        #{{ number }} {{ title || 'Unknown Threat' }}
                    </button>
                    <button
                        v-else
                        type="button"
                        class="threat-title text-truncate d-block btn btn-link p-0 text-left"
                        @click="threatSelected"
                    >
                        {{ title || 'Unknown Threat' }}
                    </button>
                </b-col>
            </b-row>
            <b-row class="mt-2">
                <b-col>
                    <span class="threat-type text-truncate d-block">{{ type }}</span>
                </b-col>
            </b-row>
            <b-row class="mt-2">
                <b-col cols="6">
                    <font-awesome-icon
                        v-if="status !== 'Open'"
                        icon="check"
                        class="threat-icon green-icon"
                        :title="status"
                    />
                    <font-awesome-icon
                        v-if="status === 'Open'"
                        icon="exclamation-triangle"
                        class="threat-icon red-icon"
                        :title="status"
                    />
                    <font-awesome-icon
                        v-if="severity === 'High'"
                        icon="circle"
                        class="threat-icon red-icon"
                        :title="severity"
                    />
                    <font-awesome-icon
                        v-if="severity === 'Medium'"
                        icon="circle"
                        class="threat-icon yellow-icon"
                        :title="severity"
                    />
                    <font-awesome-icon
                        v-if="severity === 'Low'"
                        icon="circle"
                        class="threat-icon green-icon"
                        :title="severity"
                    />
                </b-col>
                <b-col cols="6" class="text-right">
                    <b-badge v-if="!!modelType">
                        {{ modelType }}
                    </b-badge>
                </b-col>
            </b-row>
        </b-card-text>
    </b-card>
</template>

<script>
import { ref } from 'vue';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('components:GraphThreats');

export default {
    name: 'TdGraphThreats',
    props: {
        id: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            default: ''
        },
        severity: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: ''
        },
        mitigation: {
            type: String,
            default: ''
        },
        modelType: {
            type: String,
            default: ''
        },
        number: {
            type: Number,
            default: null
        }
    },
    emits: ['threatSelected'],
    setup(props, { emit }) {
        // Track click state to prevent double-click requirement
        const isProcessing = ref(false);

        // Methods
        const threatSelected = () => {
            // Prevent multiple rapid clicks
            if (isProcessing.value) return;

            isProcessing.value = true;

            // Use a more direct approach to emit the event
            // This bypasses Vue's event batching and ensures immediate processing
            try {
                // Force immediate event emission
                emit('threatSelected', props.id, 'old');

                // Dispatch a custom DOM event as a backup mechanism
                const event = new CustomEvent('threat-selected', {
                    detail: { id: props.id, state: 'old' },
                    bubbles: true
                });
                document.dispatchEvent(event);
            } catch (error) {
                log.error('Error emitting threat selected event:', error);
            }

            // Reset processing state after a short delay
            setTimeout(() => {
                isProcessing.value = false;
            }, 300);
        };

        return {
            threatSelected,
            isProcessing
        };
    }
};
</script>

<style lang="scss" scoped>
@use '@/styles/colors.scss' as colors;

.threat-card {
    font-size: 14px;
    transition: transform 0.2s;
    cursor: pointer;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
}

.threat-title {
    margin-bottom: 5px;
    font-weight: 500;
    line-height: 1.2;
    max-width: 100%;
    color: #007bff;
    text-decoration: none;

    &:hover,
    &:focus {
        color: #0056b3;
        text-decoration: underline;
    }
}

.threat-type {
    font-size: 12px;
    color: #666;
    max-width: 100%;
}

.threat-icon {
    margin: 2px;
}

.green-icon {
    color: colors.$green;
}

.red-icon {
    color: colors.$red;
}

.yellow-icon {
    color: colors.$yellow;
}
</style>