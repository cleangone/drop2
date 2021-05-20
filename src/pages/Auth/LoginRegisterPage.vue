<template>
   <q-page padding>
      <h5 class="text-center">{{ authAction }} </h5>
      <q-form class="authentication q-gutter-y-md" ref="authForm" @submit="onSubmit"> 
        <q-input v-model="email" label="Email" ref="email" type="email" autocomplete="email" outlined 
            lazy-rules :rules="[ val => isValidEmailAddressLocal(val) || 'Not a valid email']"/>
         <q-input v-model="password" label="Password" ref="password" :type="passwordType" autocomplete="current-password" outlined 
            lazy-rules="lazy-rules" :rules="[ val => val != null && val.length >= 6 || 'Minimum 6 characters']">
            <template v-slot:append>
               <q-icon class="cursor-pointer" :name="showPassword ? 'visibility_off' : 'visibility'" @click="showPassword = !showPassword" />
            </template>
         </q-input>
         <q-input v-if="isRegistration" v-model="passwordVerify" label="Verify Password" ref="passwordVerify" :type="passwordType" autocomplete="verify-password" outlined
            lazy-rules :rules="[ val => val != null && val.length >= 6 || 'Minimum 6 characters', val => val === password || 'Passwords don\'t match']">
            <template v-slot:append>
               <q-icon class="cursor-pointer" :name="showPassword ? 'visibility_off' : 'visibility'" @click="showPassword = !showPassword" />
            </template>
         </q-input>

         <q-btn class="full-width q-mt-md" color="primary" data-cy="submit" type="submit" :label="authAction"/>

         <div class="q-mt-md q-mb-none text-center">
            <router-link v-if="isRegistration" :to="loginPage" class="text-blue">Login to an existing account</router-link>
            <router-link v-else            to="/auth/register" class="text-blue">Create an account</router-link>
         </div>
         <p class="q-ma-sm text-center">
            <router-link to="/auth/forgot" class="text-blue">Forgot Password?</router-link>
         </p>
    </q-form>
  </q-page>
</template>

<script>
   import { mapActions } from 'vuex'
   import { Notify, Loading, QSpinnerGears } from 'quasar'
   import { Route } from 'src/utils/Constants.js'
   import { isValidEmailAddress } from 'src/utils/EmailUtils'

   export default {
      data () {
         return {
            email: null,
            postLoginRoute: Route.HOME,
            password: null,
            passwordVerify: null,
            showPassword: false,
         }
      },
      computed: {
         isRegistration () { return this.$route.name === Route.REGISTER },
         loginPage() { return "/auth/login/" + this.postLoginRoute },
         authAction () { return this.isRegistration ? 'Register' : 'Login' },
         passwordType () { return this.showPassword ? 'text' : 'password' },
      },
      methods: {
         ...mapActions('auth', ['loginUser', 'registerUser']),
         isValidEmailAddressLocal(email) { return isValidEmailAddress(email) },
         onSubmit () {
            const { email, password } = this
            this.$refs.authForm.validate().then(async success => {
               if (success) {
                  Loading.show()
                  try {
                     console.log(this.isRegistration ? "Registering " + email : "Logging in " + email)
                     if (this.isRegistration) { await this.registerUser({ email, password }) } 
                     else { await this.loginUser({ email, password }) }
                     this.$router.push({ name: this.postLoginRoute })
                  } catch (error) {
                     let msg = "Cannot login. Email/password incorrect"
                     if (this.isRegistration) { 
                        console.log("Cannot register " + email, error.message)
                        msg = "Cannot register"
                     }
                     else { console.log("Cannot log in " + email, error.message)}
                     this.$q.notify({ message: msg, color: 'negative' })
                  } finally { 
                     Loading.hide() 
                  }
               }
            })
         }
      },   
      created() { this.postLoginRoute = this.$route.params.route }
   }
</script>

<style lang="stylus">
.authentication
  margin auto
  max-width 30em
  width 100%
</style>