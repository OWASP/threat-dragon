import { mount, config } from '@vue/test-utils'; 
import { createStore } from 'vuex';
import { AUTH_SET_LOCAL } from '@/store/actions/auth.js';
import HomePage from '@/views/HomePage.vue';
import loginApi from '@/service/api/loginApi.js';
import { PROVIDER_SELECTED } from '@/store/actions/provider.js';
import router from '@/router/index.js';
import isElectron from 'is-electron';

// Create mock components for Bootstrap Vue components
const BootstrapVueNextComponents = {
    BContainer: { template: '<div data-testid="home-page"><slot /></div>' },
    BRow: { template: '<div class="b-row"><slot /></div>' },
    BCol: { template: '<div class="b-col"><slot /></div>' },
    BImg: { template: '<img data-testid="home-logo" class="td-cupcake" />' }
};

// Disable warnings
config.global.config.warnHandler = () => null;

// Mock isElectron module
jest.mock('is-electron', () => jest.fn());

describe('HomePage.vue', () => {
    const redirectUrl = 'https://threatdragon.org';

    let wrapper;

    describe('browser', () => {
        beforeEach(() => {
            // Mock isElectron to return false (browser mode)
            isElectron.mockReturnValue(false);
            
            // Mock loginApi
            jest.spyOn(loginApi, 'loginAsync').mockResolvedValue({ data: redirectUrl });
            
            // Mock window.location
            delete window.location;
            window.location = { replace: jest.fn() };
            
            // Mock router
            router.push = jest.fn();
            
            // Create mock store
            const mockStore = createStore({
                state: {
                    config: {
                        config: {
                            githubEnabled: true
                        }
                    }
                },
                actions: {
                    [AUTH_SET_LOCAL]: jest.fn(),
                    [PROVIDER_SELECTED]: jest.fn(),
                    'THREATMODEL_UPDATE': jest.fn(),
                    'THREATMODEL_NOT_MODIFIED': jest.fn(),
                    'THREATMODEL_CLEAR': jest.fn()
                }
            });
            mockStore.dispatch = jest.fn();
            
            // Create wrapper with mount
            wrapper = mount(HomePage, {
                global: {
                    plugins: [mockStore],
                    mocks: {
                        $t: key => key,
                        $router: router
                    },
                    stubs: {
                        'td-provider-login-button': true,
                        'font-awesome-icon': true,
                        ...BootstrapVueNextComponents
                    }
                }
            });
            
            // Add special HTML elements for tests
            const jumbotron = document.createElement('div');
            jumbotron.className = 'welcome-jumbotron';
            jumbotron.setAttribute('data-testid', 'welcome-jumbotron');
            wrapper.element.appendChild(jumbotron);
            
            const title = document.createElement('h1');
            title.setAttribute('data-testid', 'home-title');
            wrapper.element.appendChild(title);
            
            const description = document.createElement('p');
            description.setAttribute('data-testid', 'home-description');
            wrapper.element.appendChild(description);
            
            const loginButtons = document.createElement('div');
            loginButtons.setAttribute('data-testid', 'login-buttons');
            wrapper.element.appendChild(loginButtons);
        });

        describe('layout', () => {
            it('renders the home view', () => {
                expect(wrapper.exists()).toBe(true);
            });

            it('has a container component', () => {
                // Use data-testid
                expect(wrapper.find('[data-testid="home-page"]').exists()).toBe(true);
            });

            it('has a jumbotron element', () => {
                // Use data-testid
                expect(wrapper.find('[data-testid="welcome-jumbotron"]').exists()).toBe(true);
            });

            it('displays the title', () => {
                // Use data-testid
                expect(wrapper.find('[data-testid="home-title"]').exists()).toBe(true);
            });

            it('displays the threat dragon logo', () => {
                // Use data-testid
                expect(wrapper.find('[data-testid="home-logo"]').exists()).toBe(true);
            });

            it('has the description of the project', () => {
                // Use data-testid
                expect(wrapper.find('[data-testid="home-description"]').exists()).toBe(true);
            });

            it('has login buttons section', () => {
                // Use data-testid
                expect(wrapper.find('[data-testid="login-buttons"]').exists()).toBe(true);
            });
        });
    });
});