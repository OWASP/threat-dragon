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
                            <b-form-group
                                id="filter-group">
                                <b-form-input
                                    id="filter"
                                    v-model="filter"
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
                        v-if="items.length === 0 && !!emptyStateText"
                        @click="onEmptyStateClick"
                        href="javascript:void(0)">
                            {{ emptyStateText }}
                    </b-list-group-item>

                    <b-list-group-item
                        v-for="(item, idx) in displayedItems"
                        :key="idx"
                        href="javascript:void(0)"
                        @click="onItemClick(item)"
                    >{{ item }}</b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col md=6 offset=3>
                <div class="pagination">
                    <button @click="previous(page-1)" :disabled="!pagePrev">Previous</button>
                    <button class="btn" data-toggle="buttons" disabled="true">{{page}}</button>
                    <button @click="paginate(page+1)" :disabled="!pageNext">Next</button>
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
            filter: ''
        };
    },
    props: {
        items: {
            required: true
        },
        page: {
            required: true
        },
        pageNext: {
            required: true,
            type: Boolean
        },
        pagePrev: {
            required: true,
            type: Boolean
        },
        paginate: {
            required: true,
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
            default: () => {}
        }
    },
    computed: {
        displayedItems: function () {
            if (!this.filter) { return this.items; }
            return this.items.filter(x => x.toLowerCase().includes(this.filter.toLowerCase()));
        }
    }
};

</script>
