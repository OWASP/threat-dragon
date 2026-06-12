import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import { LOGOUT } from '@/store/actions/auth.js';
import Navbar from '@/components/Navbar.vue';

jest.mock('@/assets/threatdragon_logo_image.svg', () => 'threatdragon_logo_image.svg');
jest.mock('@/assets/owasp.svg', () => 'owasp.svg');

const RouterLinkStub = {
    name: 'RouterLink',
    props: {
        to: {
            type: String,
            required: true
        }
    },
    template: '<a :href="\'#\' + to"><slot /></a>'
};

describe('components/Navbar.vue', () => {
    let wrapper, localVue, mockStore, routerMock;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.component('font-awesome-icon', FontAwesomeIcon);
        localVue.directive('b-tooltip', {});
        localVue.use(Vuex);
        routerMock = { push: jest.fn() };
        mockStore = new Vuex.Store({
            getters: {
                isAdmin: () => false,
                username: () => 'foobar'
            },
            dispatch: () => {}
        });
        wrapper = shallowMount(Navbar, {
            localVue,
            store: mockStore,
            mocks: {
                $router: routerMock,
                $t: key => key
            },
            stubs: {
                RouterLink: RouterLinkStub
            }
        });
    });

    describe('brand', () => {
        let navbarBrand;

        beforeEach(() => {
            navbarBrand = wrapper.find('.navbar-brand');
        });
        it('renders the navbar-brand', () => {
            expect(navbarBrand.exists()).toBe(true);
        });

        it('routes to the dashboard page', () => {
            expect(navbarBrand.attributes('href')).toEqual('#/dashboard');
        });

        it('renders the brand image', () => {
            expect(navbarBrand.find('img').exists()).toBe(true);
        });

        it('displays threatdragon_logo.svg', () => {
            expect(navbarBrand.find('img').attributes('src'))
                .toContain('threatdragon_logo');
        });
    });

    describe('collapse', () => {
        let collapse;

        beforeEach(() => {
            collapse = wrapper.find('#nav-collapse');
        });

        it('renders the collapse container', () => {
            expect(collapse.exists()).toBe(true);
        });

        it('toggles the nav collapse', async () => {
            expect(collapse.classes()).not.toContain('show');
            await wrapper.find('.navbar-toggler').trigger('click');
            expect(collapse.classes()).toContain('show');
        });
    });

    describe('nav', () => {
        let nav;

        beforeEach(() => {
            nav = wrapper.find('ul.navbar-nav');
        });

        it('renders the nav', () => {
            expect(nav.exists()).toBe(true);
        });

        describe('sign out', () => {
            let signOut;

            beforeEach(() => {
                signOut = wrapper.find('#nav-sign-out');
                mockStore.dispatch = jest.fn();
            });

            it('has the sign out button', () => {
                expect(signOut.exists()).toBe(true);
            });

            it('uses fa sign-out-alt', () => {
                expect(signOut.findComponent(FontAwesomeIcon).attributes('icon'))
                    .toEqual('sign-out-alt');
            });

            it('dispatches the logout event', async () => {
                await signOut.find('a').trigger('click');
                expect(mockStore.dispatch).toHaveBeenCalledWith(LOGOUT);
            });

            it('navigates to the home page', async () => {
                await signOut.find('a').trigger('click');
                expect(routerMock.push).toHaveBeenCalledWith('/');
            });
        });

        describe('docs', () => {
            let docs;

            beforeEach(() => {
                docs = wrapper.find('#nav-docs');
            });

            it('uses fa question-circle', () => {
                expect(docs.findComponent(FontAwesomeIcon).attributes('icon'))
                    .toEqual('question-circle');
            });
        });

        describe('TM cheat sheet', () => {
            let cheatSheet;

            beforeEach(() => {
                cheatSheet = wrapper.find('#nav-tm-cheat-sheet');
            });

            it('uses fa gift', () => {
                expect(cheatSheet.findComponent(FontAwesomeIcon).attributes('icon'))
                    .toEqual('gift');
            });
        });

        describe('threat dragon owasp', () => {
            let tdOwasp;

            beforeEach(() => {
                tdOwasp = wrapper.find('#nav-owasp-td');
            });

            it('uses the OWASP image', () => {
                expect(tdOwasp.find('img').attributes('src'))
                    .toContain('owasp');
            });
        });
    });
});
