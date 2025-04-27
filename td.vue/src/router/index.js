import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import { gitRoutes } from './git.js';
import { localRoutes } from './local.js';
import { desktopRoutes } from './desktop.js';
import { googleRoutes } from './google.js';
import OAuthCallback from '../views/OAuthCallback.vue';
import ToSPage from '../views/ToSPage.vue';
import PrivacyPage from '../views/PrivacyPage.vue';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('router');

const routes = [
    {
        path: '/oauth-return',
        name: 'OAuthCallback',
        component: OAuthCallback
    },
    {
        path: '/',
        name: 'HomePage',
        component: HomePage
    },
    {
        path: '/dashboard',
        name: 'MainDashboard',
        component: () =>
            import(/* webpackChunkName: "main-dashboard" */ '../views/MainDashboard.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/tos',
        name: 'ToSPage',
        component: ToSPage
    },
    {
        path: '/privacy',
        name: 'PrivacyPage',
        component: PrivacyPage
    },
    {
        path: '/demo/select',
        name: 'DemoSelect',
        component: () =>
            import(/* webpackChunkName: "demo-select" */ '../views/demo/SelectDemoModel.vue')
    },
    ...desktopRoutes,
    ...gitRoutes,
    ...localRoutes,
    ...googleRoutes
];

// Use hash history for Electron (desktop) mode, web history for web mode
const isElectron =
    typeof window !== 'undefined' && (window.electronAPI?.isElectron || window.isElectronMode);
const historyMode = isElectron ? createWebHashHistory() : createWebHistory();
log.info('Router using', {
    mode: isElectron ? 'hash history (Electron mode)' : 'web history (browser mode)'
});

const router = createRouter({
    history: historyMode,
    routes
});

// Navigation guard to ensure provider is available in the route params
// and to handle legacy route compatibility
router.beforeEach((to, from, next) => {
    // Enhanced debug logging to help diagnose routing issues
    log.debug('Route navigation', {
        from: from.fullPath,
        to: to.fullPath,
        params: to.params,
        meta: to.meta,
        name: to.name,
        path: to.path
    });

    // Check if the route requires authentication
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // Check if we're in Electron mode
        const isElectronApp = typeof window !== 'undefined' &&
            (window.electronAPI?.isElectron || window.isElectronMode);
        
        // Get the Vuex store
        const store = window._vueApp?.$store;
        
        // Check for a recent successful login in localStorage as a fallback
        // This helps when the store isn't available yet but authentication just succeeded
        let hasRecentLogin = false;
        try {
            const recentLogin = localStorage.getItem('td_recent_login');
            if (recentLogin) {
                const loginData = JSON.parse(recentLogin);
                // Only consider logins within the last 30 seconds as valid
                // Increased from 10 seconds to handle longer processing times
                hasRecentLogin = (Date.now() - loginData.timestamp) < 30000;
                
                if (hasRecentLogin) {
                    log.info('Recent login detected from localStorage, allowing navigation');
                }
            }
            
            // Also check for active JWT in localStorage as another fallback
            const authToken = localStorage.getItem('td_auth_token');
            if (authToken && !hasRecentLogin) {
                try {
                    const tokenData = JSON.parse(authToken);
                    if (tokenData && tokenData.accessToken) {
                        hasRecentLogin = true;
                        log.info('Valid auth token found in localStorage, allowing navigation');
                    }
                } catch (tokenError) {
                    log.warn('Error parsing auth token from localStorage', { error: tokenError });
                }
            }
        } catch (e) {
            log.warn('Error checking localStorage for authentication data', { error: e });
        }
        
        // In Electron mode, we don't need to enforce authentication the same way
        // as the web application, so we'll allow navigation even if store is not available
        if (!store) {
            if (isElectronApp || hasRecentLogin) {
                log.info('Store not available for authentication check, but allowing navigation due to Electron mode or recent login');
                next();
                return;
            } else {
                log.error('Store not available for authentication check');
                next('/');
                return;
            }
        }
        
        // Check if the user is authenticated
        const isAuthenticated = store.state.auth.jwt ||
                               (store.state.auth.user && store.state.auth.user.username === 'local-user') ||
                               isElectronApp || // In Electron, consider the user always authenticated
                               hasRecentLogin;  // Allow navigation if we have a recent login
        
        log.debug('Authentication check for protected route', {
            route: to.path,
            isElectronApp,
            isAuthenticated: Boolean(isAuthenticated),
            hasJwt: Boolean(store.state.auth.jwt),
            hasUser: Boolean(store.state.auth.user),
            username: store.state.auth.user?.username || 'none'
        });
        
        if (!isAuthenticated) {
            // If not authenticated, redirect to home page
            log.warn('Unauthenticated access attempt to protected route', { route: to.path });
            next('/');
            return;
        }
    }
    
    // Special handling for OAuth callback - redirect to dashboard after successful login
    if (to.name === 'OAuthCallback' && from.path === '/') {
        log.info('OAuth callback detected, will redirect to dashboard after processing');
        // Continue with the callback, but set a flag to redirect after processing
        window._redirectToDashboardAfterAuth = true;
    }

    // If this is a demo selection page, preserve provider state
    if (to.name === 'DemoSelect') {
        log.debug('Navigating to demo selection page with current provider state');
        next();
        return;
    }

    // If this is a legacy route with /google/google/ pattern, redirect to new route format
    if (to.path.startsWith('/google/google/')) {
        const newPath = to.path.replace('/google/google/', '/drive/');
        log.info('Redirecting legacy route', { from: to.path, to: newPath });
        next({
            path: newPath,
            params: to.params,
            query: to.query,
            replace: true
        });
        return;
    }

    // Special handling for local provider routes to avoid provider param issues
    // This prevents infinite redirection when using demo models
    const localRouteNames = ['localThreatModel', 'localDiagramEdit', 'localThreatModelEdit', 'localReport'];
    if (localRouteNames.includes(to.name) || to.path.startsWith('/models/')) {
        log.debug('Local route detected, skipping provider injection', { route: to.name });
        // Don't try to inject provider for local routes
        next();
        return;
    }

    // Provider-specific route parameter validation
    if (to.meta.provider === 'google') {
        // For Google routes: Check for required 'folder' parameter
        if (to.path.includes('/drive/') &&
            !to.path.startsWith('/drive/folder') &&
            !to.path.startsWith('/drive/new') &&
            !to.path.startsWith('/drive/save') &&
            !to.params.folder) {
            log.warn('Missing required folder parameter for Google Drive route', { path: to.path });
            // Redirect to folder selection
            next({ name: 'googleFolder' });
            return;
        }
    } else if (to.meta.provider === 'git' && to.path.includes('/repository/')) {
        // For Git routes: Ensure repository parameter exists
        log.debug('Git route detected with repository path', {
            path: to.path,
            params: to.params,
            meta: to.meta,
            name: to.name
        });
        
        if (!to.params.repository) {
            log.warn('Missing required repository parameter for Git route', { path: to.path });
            // Redirect to repository selection - use github as default provider
            log.debug('Redirecting to repository selection', {
                redirectTo: 'gitRepository'
            });
            next({ name: 'gitRepository' });
            return;
        } else if (to.path.includes('/branch/') && !to.params.branch) {
            log.warn('Missing required branch parameter for Git route', { path: to.path });
            // Redirect to branch selection
            log.debug('Redirecting to branch selection', {
                redirectTo: 'gitBranch',
                repository: to.params.repository
            });
            next({
                name: 'gitBranch',
                params: {
                    repository: to.params.repository
                }
            });
            return;
        }
        
        log.debug('Git route parameters validated successfully', {
            path: to.path,
            repository: to.params.repository,
            branch: to.params.branch
        });
    }

    // Check if this is a provider-specific route that needs special handling
    if (to.meta.provider) {
        // Only store the provider in the Vuex store instead of trying to add it to route params
        // This avoids the Vue Router warning about discarded parameters
        const store = window._vueApp?.$store;
        if (store && to.meta.provider) {
            log.debug('Setting provider in store', { provider: to.meta.provider });
            try {
                // Dispatch action to select provider - make sure this action exists in your store
                store.dispatch('PROVIDER_SELECTED', to.meta.provider);
            } catch (error) {
                log.error('Failed to set provider in store', { error });
            }
        }
    }

    // Continue with the navigation
    next();
});

export default router;
