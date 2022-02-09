import {
    BootstrapVue,
    BNavbarBrand,
    BImg,
    BCollapse,
    BNavbarNav,
    BNavItem
} from 'bootstrap-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import { LOGOUT } from '@/store/actions/auth.js';
import Navbar from '@/components/Navbar.vue';

describe('components/Navbar.vue', () => {
    let wrapper, localVue, mockStore, routerMock;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.component('font-awesome-icon', FontAwesomeIcon);
        localVue.use(Vuex);
        routerMock = { push: jest.fn() };
        mockStore = new Vuex.Store({
            getters: {
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
            }
        });
    });

    describe('brand', () => {
        let navbarBrand;

        beforeEach(() => {
            navbarBrand = wrapper.findComponent(BNavbarBrand);
        });
        it('renders the navbar-brand', () => {
            expect(navbarBrand.exists()).toBe(true);
        });

        it('routes to the dashboard page', () => {
            expect(navbarBrand.attributes('to')).toEqual('/dashboard');
        });

        it('renders the brand image', () => {
            expect(navbarBrand.findComponent(BImg).exists()).toBe(true);
        });

        it('displays threatdragon_logo.svg', () => {
            expect(navbarBrand.findComponent(BImg).attributes('src'))
                .toContain('threatdragon_logo');
        });
    });

    describe('collapse', () => {
        let collapse;

        beforeEach(() => {
            collapse = wrapper.findComponent(BCollapse);
        });

        it('renders the b-collapse', () => {
            expect(collapse.exists()).toBe(true);
        });
    });

    describe('nav', () => {
        let nav,
            navItems;

        beforeEach(() => {
            nav = wrapper.findComponent(BNavbarNav);
            navItems = wrapper.findAllComponents(BNavItem);
        });

        it('renders the nav', () => {
            expect(nav.exists()).toBe(true);
        });

        describe('sign out', () => {
            let signOut;

            beforeEach(() => {
                signOut = navItems
                    .filter(x => x.attributes('id') === 'nav-sign-out')
                    .at(0);
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
                await signOut.trigger('click');
                expect(mockStore.dispatch).toHaveBeenCalledWith(LOGOUT);
            });

            it('navigates to the home page', async () => {
                await signOut.trigger('click');
                expect(routerMock.push).toHaveBeenCalledWith('/');
            });
        });

        describe('docs', () => {
            let docs;

            beforeEach(() => {
                docs = navItems
                    .filter(x => x.attributes('id') === 'nav-docs')
                    .at(0);
            });

            it('uses fa question-circle', () => {
                expect(docs.findComponent(FontAwesomeIcon).attributes('icon'))
                    .toEqual('question-circle');
            });
        });

        describe('TM cheat sheet', () => {
            let cheatSheet;

            beforeEach(() => {
                cheatSheet = navItems
                    .filter(x => x.attributes('id') === 'nav-tm-cheat-sheet')
                    .at(0);
            });

            it('uses fa gift', () => {
                expect(cheatSheet.findComponent(FontAwesomeIcon).attributes('icon'))
                    .toEqual('gift');
            });
        });

        describe('threat dragon owasp', () => {
            let tdOwasp;

            beforeEach(() => {
                tdOwasp = navItems
                    .filter(x => x.attributes('id') === 'nav-owasp-td')
                    .at(0);
            });

            it('uses the OWASP image', () => {
                expect(tdOwasp.findComponent(BImg).attributes('src'))
                    .toContain('owasp');
            });
        });
    });
});
