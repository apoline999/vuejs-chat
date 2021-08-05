import Vuex from 'vuex';
import Vue from 'vue';
import createPersistedState from "vuex-persistedstate";
import auth from './modules/auth';


// Vuex store data that we will used in a Vue application
// Data that will be available to every component
// and allowed to change data.


// To keep data after refreshing page
// we will use vuex-persistedstate

// Load Vuex
Vue.use(Vuex);

// Create store
export default new Vuex.Store({
  modules: {
    auth
  },
  plugins: [createPersistedState()]
});