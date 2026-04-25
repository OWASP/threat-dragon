<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <div class="text-center p-5 mb-4 bg-light rounded-3">
                    <h4>
                        <slot></slot>
                    </h4>
                </div>
            </b-col>
        </b-row>
        <b-row>
            <b-col md=6 offset=3>
                <b-form>
                    <b-row>
                        <b-col>
                            <b-form-group id="filter-group">
                                <b-form-input
                                    id="filter"
                                    v-model:model-value="localFilter"
                                    :placeholder="$t('forms.search')"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-form>
            </b-col>
        </b-row>

        <b-row>
            <b-col md=6 offset=3>
                <b-list-group>
                    <button
                        v-if="showBackItem"
                        type="button"
                        class="list-group-item list-group-item-action"
                        @click="onBackClick">
                        ...
                    </button>

                    <button
                        v-if="items.length === 0 && !!emptyStateText"
                        type="button"
                        class="list-group-item list-group-item-action"
                        @click="onEmptyStateClick">
                        {{ emptyStateText }}
                    </button>

                    <button
                        v-for="(item, idx) in displayedItems"
                        :key="idx"
                        type="button"
                        class="list-group-item list-group-item-action"
                        @click="onItemClick(item)">
                        <span v-if="typeof item === 'string'">{{ item }}</span>
                        <span v-else class="d-flex justify-content-between align-items-center">
                            {{ item.value }}
                            <font-awesome-icon
                                v-if="item.icon"
                                :icon="item.icon"
                                v-b-tooltip.hover
                                :title="$t(item.iconTooltip) || ''"
                            ></font-awesome-icon>
                        </span>
                    </button>
                </b-list-group>
            </b-col>
        </b-row>

        <b-row>
            <b-col md=6 offset=3>
                <div class="pagination">
                    <button @click="paginate(--pageRef)" :disabled="!pagePrev">Previous</button>
                    <button class="btn" data-toggle="buttons" :disabled="true">{{ pageRef }}</button>
                    <button @click="paginate(++pageRef)" :disabled="!pageNext">Next</button>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    name: 'TdSelectionPage',
    data() {
        return {
            pageRef: this.page,
            localFilter: this.filter
        };
    },
    watch: {
        filter(newFilter) {
            this.localFilter = newFilter;
        },
        localFilter(newFilter) {
            this.$emit('update:filter', newFilter);
        }
    },
    props: {
        filter: {
            required: false,
            type: String,
            default: ''
        },
        items: {
            required: true,
            type: Array,
            validator: (value) => {
                return value.every((item) => {
                    return typeof item === 'string' || (item.value && typeof item.value === 'string')
                        && (!item.icon || typeof item.icon === 'string')
                        && (!item.iconTooltip || (typeof item.iconTooltip === 'string' && item.icon));
                });
            }
        },
        page: {
            required: false,
            type: Number,
            default: 1
        },
        pageNext: {
            required: false,
            type: Boolean,
            default: false
        },
        pagePrev: {
            required: false,
            type: Boolean,
            default: false
        },
        paginate: {
            required: false,
            type: Function
        },
        onItemClick: {
            required: true,
            type: Function
        },
        emptyStateText: {
            required: false,
            type: String
        },
        onEmptyStateClick: {
            required: false,
            type: Function,
            default: () => {
            }
        },
        showBackItem: {
            required: false,
            type: Boolean,
            default: false
        },
        onBackClick: {
            required: false,
            type: Function,
            default: () => {
            }
        },
        isGoogleProvider: {
            required: false,
            type: Boolean,
            default: false
        }
    },
    computed: {
        displayedItems: function () {
            if (!this.filter) {
                return this.items;
            }
            if (this.$props.isGoogleProvider) {
                return this.items.filter(x => x.name.toLowerCase().includes(this.filter.toLowerCase()));
            } else {
                console.log(this.items);
                return this.items.filter(x => (x.value || x).toLowerCase().includes(this.filter.toLowerCase()));
            }
        }
    }
};
</script>
