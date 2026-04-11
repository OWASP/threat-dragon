<template>
    <div
        :id="id"
        class="b-form-tags form-control h-auto"
        role="group"
        tabindex="-1"
        @click="focusInput"
    >
        <ul class="b-form-tags-list list-unstyled mb-0 d-flex flex-wrap align-items-center">
            <li
                v-for="tag in tags"
                :key="tag"
                class="b-form-tag d-inline-flex align-items-baseline mw-100 badge"
                :class="[tagClass, `badge-${variant}`]"
            >
                <span class="b-form-tag-content flex-grow-1 text-truncate">
                    {{ tag }}
                </span>
                <button
                    v-if="!noTagRemove"
                    type="button"
                    class="close b-form-tag-remove"
                    :aria-label="tagRemoveLabel"
                    @click.stop="removeTag(tag)"
                >
                    &times;
                </button>
            </li>
            <li class="b-form-tags-field flex-grow-1" role="none">
                <div class="d-flex" role="group">
                    <input
                        :id="inputId"
                        ref="input"
                        v-model="newTag"
                        class="b-form-tags-input w-100 flex-grow-1 p-0 m-0 bg-transparent border-0"
                        :placeholder="placeholder"
                        type="text"
                        :disabled="disabled"
                        @input="onInput"
                        @keydown.enter.prevent="commitInput"
                    >
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'TdFormTags',
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: ''
        },
        noTagRemove: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: ''
        },
        separator: {
            type: [String, Array],
            default: ''
        },
        tagClass: {
            type: [String, Array, Object],
            default: ''
        },
        tagRemoveLabel: {
            type: String,
            default: 'Remove tag'
        },
        value: {
            type: Array,
            default: () => []
        },
        variant: {
            type: String,
            default: 'secondary'
        }
    },
    data() {
        return {
            newTag: ''
        };
    },
    computed: {
        inputId() {
            return `${this.id || 'td-form-tags'}__input__`;
        },
        separators() {
            return []
                .concat(this.separator || [])
                .join('')
                .split('')
                .filter(Boolean);
        },
        tags() {
            return this.cleanTags(this.value);
        }
    },
    methods: {
        cleanTags(tags) {
            return []
                .concat(tags || [])
                .map((tag) => String(tag).trim())
                .filter((tag, index, arr) => tag && arr.indexOf(tag) === index);
        },
        commitInput() {
            this.addTags(this.splitTags(this.newTag));
            this.newTag = '';
        },
        focusInput() {
            if (!this.disabled && this.$refs.input) {
                this.$refs.input.focus();
            }
        },
        addTags(tags) {
            const nextTags = this.cleanTags(this.tags.concat(tags));

            if (nextTags.length !== this.tags.length || nextTags.some((tag, index) => tag !== this.tags[index])) {
                this.$emit('input', nextTags);
                this.$emit('change', nextTags);
            }
        },
        onInput() {
            if (this.separators.length === 0 || !this.separators.some((separator) => this.newTag.includes(separator))) {
                return;
            }

            const endsWithSeparator = this.separators.includes(this.newTag.slice(-1));
            const parts = this.splitTags(this.newTag);
            const tags = endsWithSeparator ? parts : parts.slice(0, -1);

            this.addTags(tags);
            this.newTag = endsWithSeparator ? '' : parts[parts.length - 1] || '';
        },
        removeTag(tag) {
            if (this.disabled) {
                return;
            }

            const nextTags = this.tags.filter((existingTag) => existingTag !== tag);
            this.$emit('input', nextTags);
            this.$emit('change', nextTags);
        },
        splitTags(value) {
            const pattern = this.separators.length > 0
                ? new RegExp(`[${this.separators.map((separator) => separator.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')).join('')}]`)
                : null;

            return this.cleanTags(pattern ? String(value || '').split(pattern) : [value]);
        }
    }
};
</script>

<style scoped>
.b-form-tags-input {
    outline: 0;
    min-width: 5rem;
}
</style>
