<template>
  <div class="admin-list-chat">
    <HelloWorld msg="Welcome to AdminListChat PAGE"/>
      <div>
          <form @submit.prevent="submit">
            <div>
              <label for="title">Title:</label>
              <input type="text" name="title" v-model="form.title">
            </div>
            <div>
              <textarea name="write_up" v-model="form.write_up" placeholder="Write up..."></textarea>
            </div>
            <button type="submit"> Submit</button>
          </form>
      </div>
      <div class="admin-list-chat" v-if="Messages">
        <ul>
          <li v-for="message in Messages" :key="message.id">
            <div id="message-div">
              <p>{{message.content}}</p>
            </div>
          </li>
        </ul>
      </div>
      <div v-else>
        Oh no!!! We have no posts
      </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { mapGetters, mapActions } from "vuex"

export default {
  name: 'AdminListChat',
  components: {
    HelloWorld
  },
  data() {
    return {
      form: {
        title: '',
        write_up: '',
      }
    };
  },
  created: function () {
    this.GetAllMessages()

  },
  computed: {
    ...mapGetters({Messages: "StateMessages", User: "StateUser"}),
  },
  methods: {
    ...mapActions(["GetAllMessages"]),
    async submit() {
      
    }, 
    // async getAllChat() {
    //   try {
    //     await this.CreatePost(this.form);
    //   } catch (error) {
    //     throw "Sorry you can't make a post now!"
    //   }
    // },  
  }
}
</script>
