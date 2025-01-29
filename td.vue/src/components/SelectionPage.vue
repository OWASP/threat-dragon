<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-jumbotron class="text-center">
                    <h4>
                        <slot></slot>
                    </h4>
                </b-jumbotron>
            </b-col>
        </b-row>
        <b-row>
            <b-col md=6 offset=3>
                <b-form>
                    <b-form-row>
                        <b-col>
                            <b-form-group id="filter-group">
                                <b-form-input
                                    id="filter"
                                    v-model="localFilter"
                                    :placeholder="$t('forms.search')"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-form-row>
                </b-form>
            </b-col>
        </b-row>

        <b-row>
            <b-col md=6 offset=3>
                <b-list-group>
                    <b-list-group-item
                        v-if="showBackItem"
                        href="javascript:void(0)"
                        @click="onBackClick">
                        ...
                    </b-list-group-item>

                    <b-list-group-item
                        v-if="items.length === 0 && !!emptyStateText"
                        @click="onEmptyStateClick"
                        href="javascript:void(0)">
                        {{ emptyStateText }}
                    </b-list-group-item>

                    <b-list-group-item
                        v-for="(item, idx) in displayedItems"
                        :key="idx"
                        href="javascript:void(0)"
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
                    </b-list-group-item>
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
