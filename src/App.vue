<script>
import Navbar from '@/components/layout/Navbar.vue'
import StorePage from '@/components/layout/StorePage.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import icons from '@/data/icons.js'
import { userProfile } from '@/data/userProperties.js'

export default {
  name: 'App',
  components: {
    Navbar,
    StorePage,
    AppFooter,
  },
  data() {
    return {
      icons,
      userProfile,
    }
  },
}
</script>

<template>
  <navbar :user-profile="userProfile"></navbar>
  <store-page :items="icons" :user-profile="userProfile"></store-page>
  <app-footer></app-footer>
</template>

<style scoped></style>
