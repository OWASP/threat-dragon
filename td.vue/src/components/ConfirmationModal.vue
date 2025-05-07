<template>
    <div>
        <b-modal
            ref="confirmModal"
            :title="title"
            :ok-title="okTitle"
            :cancel-title="cancelTitle"
            @ok="confirm"
            @cancel="cancel"
            @hidden="hide"
        >
            <p>{{ message }}</p>
        </b-modal>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'ConfirmationModal',
    props: {
        title: {
            type: String,
            default: 'Confirm'
        },
        message: {
            type: String,
            default: 'Are you sure?'
        },
        okTitle: {
            type: String,
            default: 'OK'
        },
        cancelTitle: {
            type: String,
            default: 'Cancel'
        }
    },
    emits: ['confirmed', 'cancelled', 'closed'],
    setup(props, { emit, expose }) {
        const confirmModal = ref(null);
        const resolvePromise = ref(null);
        
        const show = () => {
            confirmModal.value.show();
            return new Promise((resolve) => {
                resolvePromise.value = resolve;
            });
        };
        
        const confirm = () => {
            if (resolvePromise.value) {
                resolvePromise.value(true);
                resolvePromise.value = null;
            }
            emit('confirmed');
        };
        
        const cancel = () => {
            if (resolvePromise.value) {
                resolvePromise.value(false);
                resolvePromise.value = null;
            }
            emit('cancelled');
        };
        
        const hide = () => {
            if (resolvePromise.value) {
                resolvePromise.value(false);
                resolvePromise.value = null;
            }
            emit('closed');
        };
        
        // Expose methods to be called externally
        expose({
            show
        });
        
        return {
            confirmModal,
            show,
            confirm,
            cancel,
            hide
        };
    }
};
</script>
