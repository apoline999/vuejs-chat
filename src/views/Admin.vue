<template>
  <div class="admin">
    
    <div v-if="User">
        <h1>Hi {{User.name}}!</h1>
    </div>
    <router-view></router-view>

  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { mapGetters } from "vuex"

// Main Admin template
export default {
  name: 'Admin',
  components: {
    HelloWorld
  },
  data () {
        return {
            user: {},
            users: []
        }
    },
    created () {
    },
    computed: {
    ...mapGetters({User: "StateUser"}),
  },

}
</script>
