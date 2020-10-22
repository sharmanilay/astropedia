<template>
  <b-navbar class="main-navbar" toggleable="lg" type="dark">
      <b-navbar-brand :to="{name: 'home'}">
        <div class="d-flex">
          <b-avatar class="align-self-center" :src="require('../assets/images/logo.png')" size="1.7rem"></b-avatar>
          <div class="text-uppercase ml-2 logo-text">Astropedia</div>
        </div>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-text class="mx-3">
            Hi, {{ firstName }}
          </b-nav-text>
          <b-nav-item @click.prevent="handleLogout">
            Logout
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
  </b-navbar>
</template>
<script>
import { auth } from '../../firebase'
import { mapState } from 'vuex'
export default {
  computed: mapState({
    firstName: function (state) {
      if (state.userData && state.userData.name ) {
        return state.userData.name.split(" ")[0]
      } else {
        this.$router.push({ name: 'login'})
      }
    }
  }),
  methods: {
    async handleLogout () {
      await auth.signOut()
      this.$store.dispatch('resetUserData')
      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .main-navbar {
    background-color: transparent;
    .logo-text {
      font-family: $logo;
    }
  }
</style>