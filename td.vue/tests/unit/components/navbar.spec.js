import {
  BootstrapVue,
  BNavbarBrand,
  BImg,
  BCollapse,
  BNavbarNav,
  BNavText,
  BNavItem
} from 'bootstrap-vue'
import { expect } from 'chai'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { shallowMount, createLocalVue } from '@vue/test-utils'

import Navbar from '@/components/Navbar.vue'

describe('components/Navbar.vue', () => {
  let wrapper, localVue

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.component('font-awesome-icon', FontAwesomeIcon)
    wrapper = shallowMount(Navbar, {
      localVue
    })
  })

  it('renders the navbar', () => {
    expect(wrapper.exists()).to.be.true
  })

  describe('brand', () => {
    let navbarBrand

    beforeEach(() => {
      navbarBrand = wrapper.findComponent(BNavbarBrand)
    })
    it('renders the navbar-brand', () => {
      expect(navbarBrand.exists()).to.be.true
    })

    it('routes to the home page', () => {
      expect(navbarBrand.attributes('to')).to.eq('/')
    })

    it('renders the brand image', () => {
      expect(navbarBrand.findComponent(BImg).exists()).to.be.true
    })

    it('displays threatdragon_logo.svg', () => {
      expect(navbarBrand.findComponent(BImg).attributes('src'))
        .to.contain('threatdragon_logo').and.contain('.svg')
    })
  })

  describe('collapse', () => {
    let collapse

    beforeEach(() => {
      collapse = wrapper.findComponent(BCollapse)
    })

    it('renders the b-collapse', () => {
      expect(collapse.exists()).to.be.true
    })
  })

  describe('nav', () => {
    let nav,
      navItems

    beforeEach(() => {
      nav = wrapper.findComponent(BNavbarNav)
      navItems = wrapper.findAllComponents(BNavItem)
    })

    it('renders the nav', () => {
      expect(nav.exists()).to.be.true
    })

    it('has the logged in text', () => {
      expect(nav.findComponent(BNavText).text()).to.contain('Logged in as')
    })

    describe('sign out', () => {
      let signOut

      beforeEach(() => {
        signOut = navItems
          .filter(x => x.attributes('id') === 'nav-sign-out')
          .at(0)
      })

      it('has the sign out button', () => {
        expect(signOut.exists()).to.be.true
      })

      it('uses fa sign-out-alt', () => {
        expect(signOut.findComponent(FontAwesomeIcon).attributes('icon'))
          .to.eq('sign-out-alt')
      })
    })

    describe('docs', () => {
      let docs

      beforeEach(() => {
        docs = navItems
          .filter(x => x.attributes('id') === 'nav-docs')
          .at(0)
      })

      it('uses fa question-circle', () => {
        expect(docs.findComponent(FontAwesomeIcon).attributes('icon'))
          .to.eq('question-circle')
      })
    })

    describe('TM cheat sheet', () => {
      let cheatSheet

      beforeEach(() => {
        cheatSheet = navItems
          .filter(x => x.attributes('id') === 'nav-tm-cheat-sheet')
          .at(0)
      })

      it('uses fa gift', () => {
        expect(cheatSheet.findComponent(FontAwesomeIcon).attributes('icon'))
          .to.eq('gift')
      })
    })

    describe('threat dragon owasp', () => {
      let tdOwasp

      beforeEach(() => {
        tdOwasp = navItems
          .filter(x => x.attributes('id') === 'nav-owasp-td')
          .at(0)
      })

      it('uses the OWASP image', () => {
        expect(tdOwasp.findComponent(BImg).attributes('src'))
          .to.contain('owasp').and.contain('.svg')
      })
    })
  })
})
