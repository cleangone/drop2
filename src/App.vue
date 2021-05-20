<template>
   <div id="q-app">
      <router-view />
   </div>
</template>

<script>

// export default {
//   name: 'App'
// }


  import { mapActions } from 'vuex' 

  export default {
    methods: {
      ...mapActions('auth', ['handleAuthStateChange']),
      // ...mapActions('drop', ['createFirebaseCallbacks']),
      // ...mapActions('user', ['createUserFirebaseCallbacks'])
    },
    mounted() {
      // console.log("App.mounted")
      // this.createFirebaseCallbacks()
      // this.createUserFirebaseCallbacks()
      this.handleAuthStateChange()
    }
}
</script>
