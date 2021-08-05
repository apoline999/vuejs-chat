<template>
  <div class="admin-login">
    <div>
      <div class="alert alert-info">
        Username: david<br />
        Password: pwd
      </div>
      <div class="login">
        <div>
          <form @submit.prevent="submit">
            <div>
              <label for="username">Username:</label>
              <input type="text" name="username" v-model="form.username" />
            </div>
            <div>
              <label for="password">Password:</label>
              <input type="password" name="password" v-model="form.password" />
            </div>
            <button type="submit">Submit</button>
          </form>
          <p v-if="showError" id="error">Username or Password is incorrect</p>
        </div>
  </div>
  </div>

</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { mapActions } from "vuex";

export default {
  name: 'AdminLogin',
  components: {
    HelloWorld
  },
  data () {
    return {
      form: {
        username: "",
        password: "",
      },
      showError: false
    };
  },
  methods: {
    ...mapActions(["LogIn"]),
    async submit() {
      try {
        await this.LogIn({name: this.form.username, password: this.form.password});
        this.$router.push("/posts");
        this.showError = false
      } catch (error) {
        this.showError = true
      }
    },
  }
}
</script>
