<template>
  <div class="d-flex justify-content-center h-100">
    <div class="align-self-center flex-fill">
      <b-container fluid>
        <b-row class="justify-content-center">
          <b-col :sm="4">
            <b-card class="dark-card shadow">
              <b-card-body class="py-0">
                <div class="d-flex justify-content-center mb-4">
                  <b-avatar class="align-self-center" :src="require('@/assets/images/logo.png')" size="2rem"></b-avatar>
                  <div class="text-uppercase ml-2 font-logo font-30">Astropedia</div>
                </div>
                <div class="px-md-3 px-sm-0 text-center">
                  <h3 class="text-uppercase my-4">{{ newUser ? 'Register' : 'Login' }}</h3>
                  <b-form @submit.prevent="handleSubmit">
                    <b-input v-if="newUser" class="my-4" placeholder="Your Name" type="text" required v-model.trim="form.name"></b-input>
                    <b-input class="my-4" placeholder="Email" type="email" required v-model.trim="form.email"></b-input>
                    <b-input class="my-4" placeholder="Password" type="password" required v-model.trim="form.password"></b-input>
                    <b-input v-if="newUser" class="my-4" placeholder="Confirm Password" type="password" required v-model.trim="form.confirmPassword"></b-input>
                    <div class="d-flex justify-content-center">
                      <b-button :disabled="loading" v-if="newUser" class="mt-4 mx-2 px-5" variant="danger" type="submit">
                        <span class="text-uppercase px-3">Register</span>
                        <b-spinner small v-if="loading"></b-spinner>
                      </b-button>
                      <b-button :disabled="loading" v-else class="mt-4 mx-2 px-5" variant="danger" type="submit">
                        <span class="text-uppercase px-3">Login</span>
                        <b-spinner small v-if="loading"></b-spinner>
                      </b-button>
                    </div>
                    <div class="d-flex justify-content-center">
                      <b-button :disabled="loading" @click="toggleNewUser" variant="link" class="mt-4 text-white mx-auto">{{ newUser ? 'Already Registered? Login In' : 'New User? Regiser Here'  }}</b-button>
                    </div>
                  </b-form>
                </div>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>
<script>
import { auth, usersCollection, asteroidsCollection } from '../../../firebase'
export default {
  data: () => ({
    form: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    loading: false,
    newUser: false
  }),
  methods: {
    handleSubmit () {
      this.loading = true
      if (this.newUser) {
        if (this.form.password === this.form.confirmPassword) {
          this.registerUser()
        } else {
          this.loading = false
          this.$bvToast.toast('Passwords do not match', {
            toaster: 'b-toaster-top-right',
            solid: true,
            variant: 'danger'
          })
        }
      } else {
        this.loginUser()
      }
    },
    async registerUser () {
      try {
        const { user } = await auth.createUserWithEmailAndPassword(this.form.email, this.form.password)
        await usersCollection.doc(user.uid).set({
          name: this.form.name,
          email: this.form.email
        })
        this.loginUser()
      } catch (err) {
        this.loading = false
        console.log(err)
        this.$bvToast.toast('Error in registration. Please try again later', {
          toaster: 'b-toaster-top-right',
          solid: true,
          variant: 'danger'
        })
      }
    },
    async loginUser () {
      try {
        const { user } = await auth.signInWithEmailAndPassword(this.form.email, this.form.password)
        const userProfile = await usersCollection.doc(user.uid).get()
        const savedAsteroidsData = await asteroidsCollection.where('userId', '==', user.uid).get()
        let savedAsteroids = []
        savedAsteroidsData.docs.forEach(item => {
          let asteroid = item.data()
          savedAsteroids.push(asteroid.id)
        })
        const userData = Object.assign({},userProfile.data())
        this.$store.dispatch('setUserData', userData)
        this.$store.dispatch('setSavedAsteroids', savedAsteroids)
        this.$router.push({ name: 'home' })
      } catch (err) {
        this.loading = false
        console.log(err)
        this.$bvToast.toast('Error logging in. Please try again later', {
          toaster: 'b-toaster-top-right',
          solid: true,
          variant: 'danger'
        })
      }
    },
    toggleNewUser () {
      this.newUser = !this.newUser
    },
  }
}
</script>
<style lang="scss" scoped>
</style>