<template>
    <div>
        <!-- Empty template since we're using the native file picker directly -->
    </div>
</template>

<script>
import { ref } from 'vue';
import { useI18n } from '@/i18n/index.js';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('components:LocalFilePicker');

export default {
    name: 'LocalFilePicker',
    emits: ['file-selected', 'cancel', 'error'],
    setup(props, { emit, expose }) {
        const { t } = useI18n();
        const isLoading = ref(false);

        // Check if a file is a JSON file
        const isJsonFile = (filename) => {
            return filename.toLowerCase().endsWith('.json');
        };

        // Open file picker and load the selected file
        const loadFile = async () => {
            isLoading.value = true;
            try {
                // Check if the File System Access API is available
                if (!('showOpenFilePicker' in window)) {
                    throw new Error('File System Access API is not supported in this browser');
                }

                // Use the File System Access API to open a file directly
                const [fileHandle] = await window.showOpenFilePicker({
                    id: 'threatModelPicker',
                    startIn: 'documents',
                    types: [
                        {
                            description: 'Threat models',
                            accept: {
                                'application/json': ['.json']
                            }
                        }
                    ],
                    multiple: false
                });

                // Get the file and read its content
                const file = await fileHandle.getFile();
                const content = await file.text();

                // Validate that it's a JSON file
                if (!file.name.toLowerCase().endsWith('.json')) {
                    throw new Error('Only JSON files are supported');
                }

                try {
                    // Try to parse the JSON to validate it
                    JSON.parse(content);
                } catch (parseError) {
                    throw new Error('Invalid JSON file');
                }

                // Emit the file selected event directly
                emit('file-selected', {
                    name: file.name,
                    content
                });
            } catch (error) {
                log.error('Error loading file:', error);
                // If user cancels the file picker, don't show an error
                if (error.name !== 'AbortError') {
                    // Use the browser's alert for now since we don't have a modal
                    alert(error.message || t('threatmodel.localFilePicker.errors.loadDirectory'));
                    emit('error', error.message || t('threatmodel.localFilePicker.errors.loadDirectory'));
                } else {
                    emit('cancel');
                }
            } finally {
                isLoading.value = false;
            }
        };

        // Show the file picker
        const showModal = async () => {
            await loadFile();
        };

        // Expose methods to parent component
        expose({
            showModal
        });

        return {
            isLoading,
            isJsonFile,
            loadFile,
            showModal
        };
    }
};
</script>