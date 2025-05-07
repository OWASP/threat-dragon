<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toast-notification';
import { useRoute, useRouter } from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import api from '@/service/api/api.js';
import { THREATMODEL_UPDATE } from '@/store/actions/threatmodel.js';
import { useI18n } from '@/i18n';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('views:google:DriveAccess');

// Add Google Drive icon to FontAwesome library
library.add(faGoogleDrive);

const props = defineProps({
    mode: {
        type: String,
        default: 'open' // 'open' or 'save'
    },
    threatModel: {
        type: Object,
        default: null
    }
});

const store = useStore();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const apiKey = process.env.VUE_APP_GOOGLE_API_KEY || '';
const appId = process.env.VUE_APP_GOOGLE_APP_ID || '';
const { t } = useI18n();

const accessToken = ref(null);
const isLoading = ref(false);
const fileName = ref('');

// Determine if we're saving or opening based on route or props
const isSaveMode = computed(() => {
    // Check if the mode prop is set to 'save'
    if (props.mode === 'save') return true;

    // Check if this is from 'save' in the route query
    return route.query.action === 'save';
});

// If we have a threat model from the route params or props, use it
const threatModel = computed(() => {
    if (props.threatModel) return props.threatModel;

    // Get from route params if available
    if (route.params.threatModel) return route.params.threatModel;

    // Otherwise get from store
    return store.state.threatmodel.data;
});

const getGoogleAccessToken = async () => {
    try {
        isLoading.value = true;
        if (!store.state.auth.jwt) {
            log.error('No JWT token available');
            toast.error('You need to sign in with Google before using Google Drive');
            return null;
        }

        log.info('Making request to /api/google-token');
        log.debug(`JWT token length: ${store.state.auth.jwt.length}`);
        
        try {
            // First try to parse the JWT to see if it has the right provider
            const jwtParts = store.state.auth.jwt.split('.');
            if (jwtParts.length === 3) {
                const payload = JSON.parse(atob(jwtParts[1]));
                log.debug('JWT payload provider info:',
                    payload.provider ? 'Provider exists' : 'No provider in JWT');
                
                // Check if the provider is google
                if (payload.provider) {
                    const providerName = Object.keys(payload.provider)[0];
                    log.debug(`JWT provider name: ${providerName}`);
                    
                    if (providerName !== 'google') {
                        log.error(`Wrong provider in JWT: ${providerName} (should be 'google')`);
                        toast.error('You need to sign in with Google to use Google Drive');
                        return null;
                    }
                }
            }
        } catch (jwtError) {
            log.error('Error parsing JWT:', jwtError);
            // Continue anyway, the server will validate the JWT
        }

        const response = await fetch('/api/google-token', {
            headers: { Authorization: `Bearer ${store.state.auth.jwt}` }
        });

        log.debug(`Response status: ${response.status}`);
        
        if (!response.ok) {
            // Try to get the error details from the response
            let errorDetails = '';
            try {
                const errorData = await response.json();
                errorDetails = errorData.message || errorData.details || '';
                log.error('Error response data:', errorData);
            } catch (parseError) {
                try {
                    errorDetails = await response.text();
                    log.error('Error response text:', errorDetails);
                } catch (textError) {
                    log.error('Could not parse error response');
                }
            }
            
            // If we get a 401 Unauthorized, the token might be expired
            if (response.status === 401) {
                log.error('Unauthorized: JWT token might be expired');
                toast.info('Session expired. Please sign in again.');
                router.push({ name: 'HomePage' });
                return null;
            }
            
            // If we get a 400 Bad Request, there might be an issue with the provider
            if (response.status === 400) {
                log.error(`Bad request: ${errorDetails}`);
                toast.error('Authentication error. Please sign out and sign in again with Google.');
                return null;
            }
            
            throw new Error(`Server returned ${response.status} from /api/google-token: ${errorDetails}`);
        }

        const data = await response.json();
        log.debug('Response data:', data.status ? 'Status: ' + data.status : 'No status');
        
        if (!data.data || !data.data.accessToken) {
            log.error('No access token in response:', data);
            throw new Error('No access token in response');
        }

        log.info('Successfully retrieved Google access token');
        return data.data.accessToken;
    } catch (error) {
        log.error('Error fetching Google access token:', error);
        toast.error('Failed to get access to Google Drive. Please try again.');
        return null;
    } finally {
        isLoading.value = false;
    }
};

const loadPickerAPI = () => {
    if (typeof gapi !== 'undefined') {
        gapi.load('picker', { callback: () => log.info('Google Picker API loaded') });
    } else {
        log.error('Google API not loaded');
    }
};

const handleAuth = async () => {
    try {
        isLoading.value = true;
        const token = await getGoogleAccessToken();
        if (!token) return;
        accessToken.value = token;
        createPicker();
    } catch (error) {
        log.error('Error during Google authorization:', error);
        toast.error('Failed to authenticate with Google Drive');
    } finally {
        isLoading.value = false;
    }
};

const createPicker = () => {
    if (!accessToken.value) {
        log.error('No access token available for Google Picker');
        return;
    }
    if (typeof google === 'undefined' || !google.picker) {
        log.error('Google Picker API not loaded');
        toast.error('Google Picker API failed to load');
        return;
    }

    try {
        const pickerBuilder = new google.picker.PickerBuilder()
            .setOAuthToken(accessToken.value)
            .setAppId(appId)
            .setDeveloperKey(apiKey)
            .setCallback(pickerCallback)
            .enableFeature(google.picker.Feature.NAV_HIDDEN);

        if (isSaveMode.value) {
            // When saving a new threat model, select a folder
            const folderView = new google.picker.DocsView()
                .setIncludeFolders(true)
                .setSelectFolderEnabled(true)
                .setMimeTypes('application/vnd.google-apps.folder')
                .setMode(google.picker.DocsViewMode.LIST);

            pickerBuilder
                .setTitle(
                    fileName.value || threatModel.value?.summary?.title
                        ? `Save "${
                            fileName.value || threatModel.value?.summary?.title
                        }" to Google Drive`
                        : 'Save Threat Model to Google Drive'
                )
                .addView(folderView);

            // Only set default filename if not already set by user
            if (!fileName.value) {
                fileName.value = threatModel.value?.summary?.title || 'New Threat Model';
            }
        } else {
            // When opening an existing threat model, show JSON files
            const openView = new google.picker.DocsView()
                .setMimeTypes('application/json')
                .setIncludeFolders(true)
                .setMode(google.picker.DocsViewMode.LIST);

            pickerBuilder.setTitle('Select a Threat Model from Google Drive').addView(openView);
        }

        const picker = pickerBuilder.build();
        picker.setVisible(true);
    } catch (error) {
        log.error('Error creating Google Picker:', error);
        toast.error('Failed to open Google Drive picker');
    }
};

const pickerCallback = async (data) => {
    if (
        !data ||
            !data.action ||
            !google.picker ||
            data.action !== google.picker.Action.PICKED
    ) {
        return;
    }

    const document = data.docs[0];

    if (isSaveMode.value) {
        // Handle folder selection for saving a new threat model
        if (document && document.mimeType === 'application/vnd.google-apps.folder') {
            try {
                isLoading.value = true;
                
                // Use the user-provided filename or fall back to threat model title or default
                let userFileName = fileName.value.trim();
                if (!userFileName) {
                    userFileName = threatModel.value?.summary?.title || 'New Threat Model';
                }
                
                // Ensure the filename ends with .json
                const fileNameToSave = userFileName.endsWith('.json') 
                    ? userFileName 
                    : `${userFileName}.json`;

                // Save the threat model to the selected folder
                const savedFileId = await saveFileToDrive(
                    document.id,
                    fileNameToSave,
                    JSON.stringify(threatModel.value)
                );

                if (savedFileId) {
                    toast.success('Threat model saved to Google Drive!');

                    // Store the file ID in the store so we can update it later
                    store.commit(THREATMODEL_UPDATE, {
                        fileName: fileNameToSave,
                        fileId: savedFileId
                    });

                    // Navigate to the edit view
                    // Store fileId in the store rather than passing as a route param
                    router.push({
                        name: 'googleThreatModelEdit',
                        params: {
                            provider: route.params.provider,
                            folder: document.id,
                            threatmodel: fileNameToSave.replace(/\.json$/, '')
                        }
                    });
                }
            } catch (error) {
                log.error('Error saving threat model:', error);
                toast.error('Failed to save threat model to Google Drive');
            } finally {
                isLoading.value = false;
            }
        } else {
            toast.warning('Please select a folder to save your threat model');
        }
    } else {
        // Handle file selection for opening an existing threat model
        if (document && document.mimeType === 'application/json') {
            try {
                isLoading.value = true;
                const content = await fetchFileContent(document.id);
                await sendToBackend(document.id, content);
                
                // Parse the content and store the whole model in the store
                try {
                    const parsedModel = JSON.parse(content);
                    // First, store the complete model data in the store
                    store.commit('THREATMODEL_SELECTED', parsedModel);
                    
                    // Then update the metadata (fileName, fileId)
                    store.commit(THREATMODEL_UPDATE, {
                        fileName: document.name,
                        fileId: document.id
                    });
                    
                    log.debug('Successfully stored model data in store before navigation');
                } catch (parseError) {
                    log.error('Error parsing threat model JSON:', parseError);
                    toast.error('File format error. Could not parse the threat model.');
                    isLoading.value = false;
                    return;
                }
                
                toast.success('File imported successfully!');
                
                // After model is fully loaded in store, navigate to edit page
                router.push({
                    name: 'googleThreatModelEdit',
                    params: {
                        provider: route.params.provider,
                        folder: document.id,
                        threatmodel: document.name.replace(/\.json$/, '')
                    }
                });
            } catch (error) {
                log.error('Error processing file:', error);
                toast.error('Failed to import file from Google Drive');
            } finally {
                isLoading.value = false;
            }
        } else {
            log.warn('Invalid file type selected. Please select a JSON file.');
            toast.warning('Please select a JSON file');
        }
    }
};

const fetchFileContent = async (fileId) => {
    const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
            headers: { Authorization: `Bearer ${accessToken.value}` }
        }
    );
    if (!response.ok) {
        const errorText = await response.text();
        log.error('Google Drive API error:', errorText);
        
        // If we get a 401 Unauthorized, the token might be expired
        if (response.status === 401) {
            toast.info('Google Drive access token expired. Attempting to refresh...');
            // Try to get a fresh token and retry
            const newToken = await getGoogleAccessToken();
            if (newToken) {
                accessToken.value = newToken;
                // Retry the fetch with the new token
                const retryResponse = await fetch(
                    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
                    {
                        headers: { Authorization: `Bearer ${accessToken.value}` }
                    }
                );
                if (retryResponse.ok) {
                    return await retryResponse.text();
                }
            }
        }
        
        throw new Error('Failed to fetch file content from Google Drive');
    }
    return await response.text();
};

const saveFileToDrive = async (folderId, fileName, content) => {
    try {
        // Create multipart request to upload file to Google Drive
        const metadata = {
            name: fileName,
            mimeType: 'application/json',
            parents: [folderId]
        };

        const form = new FormData();
        form.append(
            'metadata',
            new Blob([JSON.stringify(metadata)], { type: 'application/json' })
        );
        form.append('file', new Blob([content], { type: 'application/json' }));

        const response = await fetch(
            'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken.value}`
                },
                body: form
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            log.error('Google Drive API error:', errorText);
            
            // If we get a 401 Unauthorized, the token might be expired
            if (response.status === 401) {
                toast.info('Google Drive access token expired. Attempting to refresh...');
                // Try to get a fresh token and retry
                const newToken = await getGoogleAccessToken();
                if (newToken) {
                    accessToken.value = newToken;
                    // Retry the save with the new token
                    const retryForm = new FormData();
                    retryForm.append(
                        'metadata',
                        new Blob([JSON.stringify(metadata)], { type: 'application/json' })
                    );
                    retryForm.append('file', new Blob([content], { type: 'application/json' }));
                    
                    const retryResponse = await fetch(
                        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
                        {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${accessToken.value}`
                            },
                            body: retryForm
                        }
                    );
                    
                    if (retryResponse.ok) {
                        const retryResult = await retryResponse.json();
                        return retryResult.id;
                    }
                }
            }
            
            throw new Error('Failed to save file to Google Drive');
        }

        const result = await response.json();
        return result.id;
    } catch (error) {
        log.error('Error saving to Google Drive:', error);
        throw new Error('Failed to save file to Google Drive');
    }
};

const sendToBackend = async (fileId, fileContent) => {
    try {
        await api.postAsync(`/api/googleproviderthreatmodel/${fileId}/data`, {
            fileId,
            fileContent
        });
        return true;
    } catch (error) {
        log.error('Error sending file to backend:', error);
        throw new Error('Failed to import file to Threat Dragon');
    }
};

onMounted(() => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = loadPickerAPI;
    document.body.appendChild(script);

    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    document.body.appendChild(gisScript);

    // If coming from the NewThreatModel with model data, pre-set the filename
    if (props.threatModel && props.threatModel.summary && props.threatModel.summary.title) {
        fileName.value = props.threatModel.summary.title;
    }
});
</script>

<template>
    <b-container fluid>
        <div class="welcome-jumbotron">
            <b-row class="text-center mb-2">
                <b-col md="12">
                    <h1 v-if="isSaveMode">
                        {{ t('providers.googleDrive.saveThreatModel') }}
                    </h1>
                    <h1 v-else>
                        {{ t('providers.googleDrive.selectThreatModel') }}
                    </h1>
                    <p class="td-description mt-2">
                        {{
                            isSaveMode
                                ? t('providers.googleDrive.saveDescription')
                                : t('providers.googleDrive.description')
                        }}
                    </p>
                </b-col>
            </b-row>

            <!-- Show file name input when saving a new model -->
            <b-row v-if="isSaveMode" class="my-3">
                <b-col md="6" offset-md="3">
                    <b-form-group
                        :label="t('providers.googleDrive.fileName')"
                        label-for="file-name"
                    >
                        <b-form-input
                            id="file-name"
                            v-model="fileName"
                            :placeholder="t('providers.googleDrive.fileNamePlaceholder')"
                        />
                    </b-form-group>
                </b-col>
            </b-row>

            <b-row class="flex-grow-1 align-items-center">
                <b-col md="12" class="text-center">
                    <BButton
                        id="google-drive-btn"
                        class="m-1 google-drive-button"
                        variant="secondary"
                        :disabled="isLoading"
                        @click="handleAuth"
                    >
                        <span class="login-btn-icon">
                            <font-awesome-icon
                                :icon="['fab', 'google-drive']"
                                size="2x"
                                color="white"
                                class="mr-2"
                            />
                        </span>
                        <span>
                            {{
                                isSaveMode
                                    ? t('providers.googleDrive.selectFolder')
                                    : t('providers.googleDrive.selectFile')
                            }}
                        </span>
                    </BButton>
                </b-col>
            </b-row>
        </div>

        <!-- Don't display imported JSON file content - we should navigate instead -->
    </b-container>
</template>

<style lang="scss" scoped>
    /* Recreating BootstrapVue's b-jumbotron styling */
    .welcome-jumbotron {
        background-color: #f8f9fa; /* Light grey background like BootstrapVue jumbotron */
        padding: 3rem 2rem; /* Increase padding to match BootstrapVue */
        border-radius: 0.3rem; /* Add rounded corners */
        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); /* Light shadow */
        margin-bottom: 1.5rem; /* Space below jumbotron */
        display: flex;
        flex-direction: column;
        min-height: 60vh; /* Ensure jumbotron takes most of the screen */
    }

    .flex-grow-1 {
        flex-grow: 1;
    }

    .td-description {
        font-size: 20px;
        max-width: 80%;
        margin: 10px auto; /* Center the description */
        text-align: center;
    }

    .google-drive-button {
        padding: 1rem 2rem;
        font-size: 1.25rem;
    }

    .login-btn-icon {
        display: block;
    }
</style>
