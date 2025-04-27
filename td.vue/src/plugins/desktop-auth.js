// desktop-auth.js
// Mock plugin for Google Sign-In in desktop mode

// Create a fake Google authentication provider for desktop mode
const DesktopAuthPlugin = {
    install(app) {
        // Add a fake Google SignIn plugin to the global Vue instance
        const mockGoogleSignIn = {
            isSignedIn: false,
            signIn: () => Promise.resolve({ name: 'Local User', email: 'local@threatdragon.org' }),
            signOut: () => Promise.resolve(),
            refreshToken: () => Promise.resolve('mock-token'),
            getAuthInstance: () => ({
                signIn: () => Promise.resolve(),
                signOut: () => Promise.resolve(),
                currentUser: {
                    get: () => ({
                        isSignedIn: () => false,
                        getBasicProfile: () => ({
                            getName: () => 'Local User',
                            getEmail: () => 'local@threatdragon.org'
                        })
                    })
                }
            })
        };

        // Add to Vue global properties
        app.config.globalProperties.$gSignIn = mockGoogleSignIn;

        // Also add to window
        window.$gSignIn = mockGoogleSignIn;
        window.gapi = {
            auth2: {
                getAuthInstance: () => mockGoogleSignIn
            }
        };

        // Mock the GoogleSignInPlugin global
        window.GoogleSignInPlugin = {
            clientId: 'desktop-mode-fake-client-id'
        };

        // Add a mock GoogleSignInButton component
        app.component('GoogleSignInButton', {
            emits: ['success', 'error'],
            setup(props, { emit }) {
                const signIn = () => {
                    emit('success', {
                        credential: 'fake-desktop-token',
                        clientId: 'desktop-mode',
                        select_by: 'desktop'
                    });
                };

                return { signIn };
            },
            template: '<button class="desktop-signin-btn">Sign in (Desktop Mode)</button>'
        });
    }
};

export default DesktopAuthPlugin;
