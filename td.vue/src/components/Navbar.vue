<template>
    <b-navbar id="navbar" toggleable="lg" fixed="top">
        <b-navbar-brand :to="username ? '/dashboard' : '/'" class="td-brand">
            <b-img
                :src="require('@/assets/threatdragon_logo_image.svg')"
                class="td-brand-img"
                alt="Threat Dragon Logo"
            />
            Threat Dragon v{{ packageBuildVersion }}{{ packageBuildState }}
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse" />
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item>
                    <td-locale-select />
                </b-nav-item>
            </b-navbar-nav>

            <!-- Ensure alignment to the right -->
            <b-navbar-nav class="ms-auto d-flex align-items-center justify-content-end">
                <b-nav-text v-show="username" class="logged-in-as">
                    ({{ providerDisplayName }}) {{ username }}
                </b-nav-text>
                <b-nav-item v-show="username" id="nav-sign-out" @click="onLogOut">
                    <font-awesome-icon
                        v-tooltip.hover
                        icon="sign-out-alt"
                        class="td-fa-nav"
                        :title="t('nav.logOut')"
                    />
                </b-nav-item>
                <b-nav-item
                    id="nav-docs"
                    href="https://www.threatdragon.com/docs/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <font-awesome-icon
                        v-tooltip.hover
                        icon="question-circle"
                        class="td-fa-nav"
                        :title="t('desktop.help.docs')"
                    />
                </b-nav-item>
                <b-nav-item
                    id="nav-tm-cheat-sheet"
                    href="https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <font-awesome-icon
                        v-tooltip.hover
                        icon="gift"
                        class="td-fa-nav"
                        :title="t('desktop.help.sheets')"
                    />
                </b-nav-item>
                <b-nav-item
                    id="nav-owasp-td"
                    href="https://owasp.org/www-project-threat-dragon/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <b-img
                        :src="require('@/assets/owasp.svg')"
                        class="td-fa-nav td-owasp-logo"
                        :title="t('desktop.help.visit')"
                    />
                </b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { LOGOUT, AUTH_SET_JWT, AUTH_CLEAR } from '@/store/actions/auth.js';
import { PROVIDER_SELECTED } from '@/store/actions/provider.js';
import { useI18n } from '@/i18n';
import TdLocaleSelect from './LocaleSelect.vue';
import { getDisplayName } from '@/service/provider/providers.js';
import logger from '@/utils/logger.js';

// Create a logger instance for this component
const log = logger.getLogger('components:Navbar');

export default {
    name: 'TdNavbar',
    components: {
        TdLocaleSelect
    },
    setup() {
        const store = useStore();
        const { t } = useI18n();
        const isAuthRestored = ref(false);
        const fallbackUsername = ref('');

        // Use computed to get values from the store
        const storeUsername = computed(() => store.getters.username);
        const storeActualUsername = computed(() => store.getters.actualUsername);
        const packageBuildVersion = computed(() => store.state.packageBuildVersion);
        const packageBuildState = computed(() => store.state.packageBuildState);
        const config = computed(() => store.state.config.config);

        // Enhanced username computed property with fallback mechanism
        const username = computed(() => {
            // If we have a username in the store, use it
            if (storeUsername.value) {
                return storeUsername.value;
            }

            // If we have a fallback username, use it
            if (fallbackUsername.value) {
                return fallbackUsername.value;
            }

            // Otherwise, return empty string
            return '';
        });

        // Get the provider display name for the navbar
        const selectedProvider = computed(() => store.state.provider.selected || 'local');
        const providerDisplayName = computed(() => {
            try {
                return getDisplayName(selectedProvider.value);
            } catch (err) {
                log.warn('Error getting provider display name:', { error: err });
                return selectedProvider.value;
            }
        });

        const googleEnabled = computed(() =>
            config.value && config.value.googleEnabled && !store.getters.isElectronMode
        );

        // Function to restore auth state from session storage
        const restoreAuthState = async () => {
            // If we've already tried to restore auth state, don't try again
            if (isAuthRestored.value) {
                return;
            }

            // Mark that we've tried to restore auth state
            isAuthRestored.value = true;

            // If we already have a username in the store, no need to restore
            if (storeUsername.value) {
                return;
            }

            log.debug('No username in store, checking session storage');

            // Try to get auth state from sessionStorage as fallback
            try {
                const sessionState = sessionStorage.getItem('td.vuex');
                if (sessionState) {
                    const state = JSON.parse(sessionState);

                    // Check if we have auth data in session storage
                    if (state.auth && state.auth.user && state.auth.user.username) {
                        log.info('Found username in session storage:', {
                            username: state.auth.user.username,
                            actual_username: state.auth.user.actual_username || 'not available'
                        });

                        // Set fallback username
                        fallbackUsername.value = state.auth.user.username;

                        // If we have a provider in session storage, restore it too
                        if (state.provider && state.provider.selected) {
                            log.info('Restoring provider from session storage:', {
                                provider: state.provider.selected
                            });

                            // Dispatch action to select provider
                            try {
                                await store.dispatch(PROVIDER_SELECTED, state.provider.selected);
                                log.info('Provider restored successfully');
                            } catch (err) {
                                log.error('Error restoring provider:', { error: err });
                            }
                        }

                        // If we have JWT data, restore it
                        if (state.auth.jwt && state.auth.refreshToken) {
                            log.info('Restoring JWT from session storage');

                            // Dispatch action to set JWT
                            try {
                                await store.dispatch(AUTH_SET_JWT, {
                                    accessToken: state.auth.jwt,
                                    refreshToken: state.auth.refreshToken
                                });
                                log.info('JWT restored successfully');
                            } catch (err) {
                                log.error('Error restoring JWT:', { error: err });
                            }
                        }
                    }
                }
            } catch (err) {
                log.error('Error accessing session storage:', { error: err });
            }
        };

        // Check auth state on component mount
        onMounted(() => {
            restoreAuthState();
        });

        // Method to handle logout
        const onLogOut = async (evt) => {
            // This works in both production and tests
            evt.preventDefault();

            // Check if we're in Electron mode
            const isElectronApp = typeof window !== 'undefined' &&
                (window.electronAPI?.isElectron || window.isElectronMode);

            log.debug('Logout initiated', { isElectronApp });

            try {
                // Clear the recent login flag from localStorage if it exists
                try {
                    localStorage.removeItem('td_recent_login');
                    log.debug('Cleared recent login flag from localStorage');
                } catch (e) {
                    log.warn('Error clearing localStorage recent login flag', { error: e });
                }
                
                // Dispatch logout action and wait for it to complete
                await store.dispatch(LOGOUT);
                log.debug('Logout action completed');

                // Special handling for Electron app
                if (isElectronApp) {
                    log.debug('Electron app detected, using direct approach for Electron');
                    
                    try {
                        // For Electron, we'll use a more direct approach
                        // First, clear the auth state
                        store.commit(AUTH_CLEAR);
                        
                        // Then force a hard reload of the application
                        log.debug('Forcing hard reload of the application');
                        
                        // Use setTimeout to ensure the state is cleared before reload
                        setTimeout(() => {
                            // Try to use the Electron API if available
                            if (window.electronAPI) {
                                log.debug('Using electronAPI for navigation');
                                // Use IPC to tell the main process to reload the window
                                window.electronAPI.send('reload-window');
                            } else {
                                // Fallback to location.reload with forceReload=true
                                log.debug('Using location.reload(true) for hard reload');
                                window.location.reload(true);
                            }
                        }, 100);
                    } catch (error) {
                        log.error('Error during Electron logout', { error });
                        // Last resort fallback
                        window.location.reload(true);
                    }
                    return;
                }

                // For web app, ensure navigation to home page after logout
                log.debug('Navigating to home page after logout');
                
                // First try using the Vue Router instance from the component
                if (getCurrentInstance() && getCurrentInstance().proxy.$router) {
                    log.debug('Using component router for navigation');
                    try {
                        // Force navigation to home page with replace to avoid history issues
                        await getCurrentInstance().proxy.$router.replace({ path: '/' });
                        log.debug('Navigation to home page successful');
                    } catch (routerError) {
                        log.warn('Navigation error:', { error: routerError });
                        // Force a hard reload to the home page
                        window.location.replace('/');
                    }
                } else {
                    // Fallback to direct location change if router is not available
                    log.debug('Router not available, using location.replace');
                    window.location.replace('/');
                }
            } catch (error) {
                log.error('Error during logout process:', { error });
                // Final fallback
                window.location.href = '/';
            }
        };

        // Equivalent of mounted lifecycle hook
        const setupNavbarToggle = () => {
            // Wait for component to mount
            setTimeout(() => {
                const toggle = document.querySelector('.navbar-toggler');
                if (toggle) {
                    toggle.addEventListener('click', () => {
                        const target = document.getElementById('nav-collapse');
                        if (target) {
                            target.classList.toggle('show');
                        }
                    });
                }
            }, 0);
        };
        setupNavbarToggle();

        // Return everything needed in the template
        return {
            t,
            username,
            storeActualUsername, // Make actual username available to the template
            packageBuildVersion,
            packageBuildState,
            googleEnabled,
            providerDisplayName,
            onLogOut,
            restoreAuthState
        };
    }
};
</script>

<style lang="scss" scoped>
@use '@/styles/sizes.scss' as sizes;
@use '@/styles/colors.scss' as colors;
$icon-height: 1.2rem;

.navbar {
    background-color: colors.$orange;
    border-color: colors.$orange-alt;
    height: sizes.$header-height + 10;
    font-size: 15px;
}

.nav-link,
.logged-in-as {
    color: colors.$white !important;
}

.logged-in-as {
    margin-right: 10px;
}

.td-fa-nav {
    font-size: $icon-height;
    max-height: $icon-height;
    margin: 0 5px 0 5px;
}

.td-brand {
    color: colors.$white !important;

    .td-brand-img {
        max-height: (sizes.$header-height - 10);
    }
}

@media (max-width: 576px) {
    .nav-link {
        color: colors.$red !important;
    }

    .logged-in-as {
        background-color: colors.$orange;
        border-radius: 5px;
        padding: 10px;
    }
}

@media (max-width: 576px) {
    .td-owasp-logo {
        background-color: colors.$red;
        border-radius: 50%;
        padding: 5px;
    }
}
</style>
