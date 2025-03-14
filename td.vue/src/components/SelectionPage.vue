<template>
<b-container fluid>
        <b-row>
            <b-col>
                <b-container class="text-center p-4 bg-light">
                    <h4>
                        <slot></slot>
                    </h4>
                </b-container>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="6" offset="3">
                <b-form>
                    <b-row>
                        <b-col>
                            <b-form-group id="filter-group">
                                <b-form-input
                                    id="filter"
                                    v-model="filter"
                                    :placeholder="$t('forms.search')"
                                />
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-form>
            </b-col>
        </b-row>

        <b-row>
            <b-col md="6" offset="3">
                <b-list-group>
                    <b-list-group-item v-if="showBackItem" href="#" @click="$emit('back-click')">
                        ...
                    </b-list-group-item>

                    <b-list-group-item v-if="items.length === 0 && !!emptyStateText" href="#" @click="$emit('empty-state-click')">
                        {{ emptyStateText }}
                    </b-list-group-item>

                    <b-list-group-item v-for="(item, idx) in displayedItems" :key="idx" href="#" @click="$emit('item-click', item)">
                        {{ isGoogleProvider ? item.name : item }}
                    </b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>

        <b-row>
            <b-col md="6" offset="3">
                <div class="pagination">
                    <button @click="prevPage" :disabled="!pagePrev">Previous</button>
                    <button class="btn" disabled>{{ pageRef }}</button>
                    <button @click="nextPage" :disabled="!pageNext">Next</button>
                </div>
            </b-col>
        </b-row>
    </b-container>    
</template>

<script>
import { ref, computed } from 'vue';
export default {
    name: 'TdSelectionPage',
    props: {
        items: Array,
        page: Number,
        pageNext: Boolean,
        pagePrev: Boolean,
        paginate: {
            required: false,
            type: Function
        },
        onItemClick: {
            required: true,
            type: Function
        },
        emptyStateText: String,
        showBackItem: Boolean,
        onBackClick: {
            required: false,
            type: Function,
            default: () => {}
        },
        isGoogleProvider: Boolean
    },
    setup(props) {
        const filter = ref('');
        const pageRef = ref(props.page);
        const displayedItems = computed(() => {
            if (!filter.value) return props.items;
            return props.isGoogleProvider
                ? props.items.filter(item => item.name.toLowerCase().includes(filter.value.toLowerCase()))
                : props.items.filter(item => item.toLowerCase().includes(filter.value.toLowerCase()));
        });
        const prevPage = () => {
            if (props.pagePrev) {
                pageRef.value--;
                emit('paginate', pageRef.value);
            }
        };
        const nextPage = () => {
            if (props.pageNext) {
                pageRef.value++;
                emit('paginate', pageRef.value);
            }
        };
        return {
            filter,
            pageRef,
            displayedItems,
            prevPage,
            nextPage
        };
    }
};
</script>