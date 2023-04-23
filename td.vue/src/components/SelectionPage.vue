<script>
export default {
  name: 'TdSelectionPage'
};
</script>
<script setup>
import {computed, ref} from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  onItemClick: {
    type: Function,
    required: true
  },
  emptyStateText: {
    type: String,
    required: false,
    default: null
  },
  onEmptyStateClick: {
    type: Function,
    required: false,
    default: () => {}
  }
});

const { t } = useI18n();
const filter = ref('');

const displayedItems = computed(() => {
  if (!filter.value) { return props.items; }
  return props.items.filter(x => x.toLowerCase().includes(filter.value.toLowerCase()));
});
</script>

<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-jumbotron class="text-center">
          <h4>
            <slot />
          </h4>
        </b-jumbotron>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        md="6"
        offset="3"
      >
        <b-form>
          <b-form-row>
            <b-col>
              <b-form-group
                id="filter-group"
              >
                <b-form-input
                  id="filter"
                  v-model="filter"
                  :placeholder="t('forms.search')"
                />
              </b-form-group>
            </b-col>
          </b-form-row>
        </b-form>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        md="6"
        offset="3"
      >
        <b-list-group>
          <b-list-group-item
            v-if="props.items.length === 0 && !!props.emptyStateText"
            href="javascript:void(0)"
            @click="props.onEmptyStateClick"
          >
            {{ props.emptyStateText }}
          </b-list-group-item>

          <b-list-group-item
            v-for="(item, idx) in displayedItems"
            :key="idx"
            href="javascript:void(0)"
            @click="props.onItemClick(item)"
          >
            {{ item }}
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>
