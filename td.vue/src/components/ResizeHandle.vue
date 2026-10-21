<template>
    <button
        type="button"
        class="td-resize-handle"
        :class="`td-resize-handle-${orientation}`"
        role="separator"
        tabindex="0"
        :aria-label="label"
        :aria-orientation="orientation"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="value"
        @keydown="onKeydown"
        @pointercancel="onPointerUp"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
    ></button>
</template>

<style lang="scss" scoped>
.td-resize-handle {
    align-items: center;
    background: rgba($gray, 0.15);
    border: 0;
    border-radius: 3px;
    box-shadow: inset 0 0 0 1px rgba($gray, 0.5);
    display: flex;
    justify-content: center;
    padding: 0;
    touch-action: none;
    user-select: none;
    z-index: 1;
}

.td-resize-handle::after {
    background: $black;
    border-radius: 2px;
    content: '';
    opacity: 0.7;
}

button.td-resize-handle.td-resize-handle-vertical:not(:disabled) {
    cursor: col-resize;
    height: 100%;
    width: var(--resize-handle-size, 20px);
}

.td-resize-handle-vertical::after {
    height: 40px;
    width: 4px;
}

button.td-resize-handle.td-resize-handle-horizontal:not(:disabled) {
    cursor: row-resize;
    height: var(--resize-handle-size, 20px);
    width: 100%;
}

.td-resize-handle-horizontal::after {
    height: 4px;
    width: 40px;
}

.td-resize-handle:hover,
.td-resize-handle:active,
.td-resize-handle:focus-visible {
    background: rgba($orange, 0.15);
}

.td-resize-handle:focus-visible {
    outline: 2px solid $orange;
}
</style>

<script>
export default {
    name: 'TdResizeHandle',

    props: {
        label: {
            type: String,
            default: 'Resize panels'
        },
        orientation: {
            type: String,
            default: 'vertical',
            validator: (value) => ['vertical', 'horizontal'].includes(value)
        },
        value: {
            type: Number,
            required: true
        },
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        },
        step: {
            type: Number,
            default: 10
        }
    },

    data() {
        return {
            dragging: false,
            startPosition: 0,
            startValue: 0
        };
    },

    methods: {
        clamp(value) {
            return Math.min(this.max, Math.max(this.min, value));
        },

        getPosition(event) {
            return this.orientation === 'vertical'
                ? event.clientX
                : event.clientY;
        },

        onPointerDown(event) {
            if (event.button !== 0) {
                return;
            }

            event.preventDefault();
            this.dragging = true;
            this.startPosition = this.getPosition(event);
            this.startValue = this.value;
            event.currentTarget?.setPointerCapture?.(event.pointerId);
            this.$emit('start');
        },

        onPointerMove(event) {
            if (!this.dragging) {
                return;
            }

            const delta = this.getPosition(event) - this.startPosition;
            this.$emit('resize', this.clamp(this.startValue + delta));
        },

        onPointerUp(event) {
            if (!this.dragging) {
                return;
            }

            event.currentTarget?.releasePointerCapture?.(event.pointerId);
            this.dragging = false;
            this.$emit('end');
        },

        onKeydown(event) {
            const values = {
                Home: this.min,
                End: this.max,
                ArrowLeft: this.value - this.step,
                ArrowUp: this.value - this.step,
                ArrowRight: this.value + this.step,
                ArrowDown: this.value + this.step
            };

            if (values[event.key] === undefined) {
                return;
            }

            event.preventDefault();
            this.$emit('resize', this.clamp(values[event.key]));
        }
    }
};
</script>