<template>
	<div id="nav">
		<router-link to="/">Home</router-link> |
		<router-link to="/about">About</router-link> | 
		

		<span v-if="isLoggedIn && isAdmin">
      <router-link to="/admin/chat-list">Admin ChatList</router-link> | 
    </span>
    <span v-if="isLoggedIn">
      <a @click="logout">Logout</a>
    </span>
    <span v-else>
      <router-link to="/admin/login">Login</router-link> | 
      <router-link to="/register">Register</router-link>
    </span>
  </div>
</template>
<script>
  import { mapGetters, mapActions } from "vuex"

  export default {
    name: 'NavBar',
    computed : {
     isLoggedIn : function(){ return this.$store.getters.isAuthenticated},
     isAdmin : function(){ return this.$store.getters.isAdmin},
     ...mapGetters({User: "StateUser"}),
    },
    created() {
    },
    methods: {
      async logout (){
    		// Logout through API & Local
        await this.$store.dispatch('LogOut');
      }
    },
  }
</script>
<style>
 #nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
a:hover {
  cursor: pointer;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
