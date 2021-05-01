import Vue from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

// Import specific icons that we want here
import {
  faSignOutAlt,
  faQuestionCircle,
  faGift
} from '@fortawesome/free-solid-svg-icons'

// Add icons to the library for use
library.add(faSignOutAlt)
library.add(faQuestionCircle)
library.add(faGift)

Vue.component('font-awesome-icon', FontAwesomeIcon)

/*
Usage:
<template>
    <div id="something">
        <font-awesome-icon icon="sign-out" />
    </div>
</template>

<script>
export default {
    name: 'TdSomething'
}
</script>
*/
