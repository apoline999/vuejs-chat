<template>
  <div class="home">
    <HelloWorld msg="Welcome to ChatVue App"/>

    <div v-if="!ready">
      <h4>Enter your username</h4>
      <form @submit.prevent="addUser">
          <div class="form-group row">
              <input type="text" class="form-control col-9" v-model="username"
                  placeholder="Enter username here">
              <input type="submit" value="Join" class="btn btn-sm btn-info ml-1">

          </div>
      </form>
      <p>{{ notification.user }}</p>
    </div>

    <div v-else>
      <h2>{{ username }}</h2>
      <p>{{ notification.message }}</p>

      <Chat v-if="visible"
        :participants="participants"
        :myself="myself"
        :messages="messages"
        :chat-title="chatTitle"
        :placeholder="placeholder"
        :colors="colors"
        :border-style="borderStyle"
        :hide-close-button="hideCloseButton"
        :close-button-icon-size="closeButtonIconSize"
        :submit-icon-size="submitIconSize"
        :submit-image-icon-size="submitImageIconSize"
        :load-more-messages="null"
        :async-mode="asyncMode"
        :scroll-bottom="scrollBottom"
        :display-header="true"
        :send-images="true"
        :profile-picture-config="profilePictureConfig"
        :timestamp-config="timestampConfig"
        :link-options="linkOptions"
        :accept-image-types="'.png, .jpeg'"
        @onImageClicked="onImageClicked"
        @onImageSelected="onImageSelected"
        @onMessageSubmit="onMessageSubmit"
        @onType="onType"
        @onClose="onClose"/>

    </div>
</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { mapGetters, mapActions } from "vuex"

import {Chat} from 'vue-quick-chat'
import 'vue-quick-chat/dist/vue-quick-chat.css'
import io from 'socket.io-client';

export default {
  name: 'Home',
  components: {
    HelloWorld,
    Chat
  },
  data() {
    return {
      // Init socket to automatically load message
      socket : io('localhost:3000', {
        withCredentials: false,
        extraHeaders: {
          "Content-Type": "application/json",
          "Access-Contol-Allow-Origin": "*",
        }
      }),
      notification: {
        user: null,
        message: null
      },

      username: null,
      ready: false,

      visible: true,
      participants: [
        {
          name: 'BoT',
          id: 1,
          profilePicture: ''
        }
      ],
      // Init a user for the component chat
      myself: {
        name: 'John Doe',
        id: 3,
        profilePicture: ''
      },
      messages: [
        {
          content: 'What do you like to ask me ?',
          myself: false,
          participantId: 1,
          timestamp: {year: 2019, month: 3, day: 5, hour: 13, minute: 10, second: 3, millisecond: 123},
          type: 'text'
        }
      ],
      chatTitle: 'My chat title',
      placeholder: 'send your message',
      colors: {
        header: {
          bg: '#d30303',
          text: '#fff'
        },
        message: {
          myself: {
            bg: '#fff',
            text: '#bdb8b8'
          },
          others: {
            bg: '#fb4141',
            text: '#fff'
          },
          messagesDisplay: {
            bg: '#f7f3f3'
          }
        },
        submitIcon: '#b91010',
        submitImageIcon: '#b91010',
      },
      borderStyle: {
        topLeft: "10px",
        topRight: "10px",
        bottomLeft: "10px",
        bottomRight: "10px",
      },
      hideCloseButton: false,
      submitIconSize: 25,
      submitImageIconSize: 25,
      closeButtonIconSize: "20px",
      asyncMode: false,
      toLoad: [
        // messages to pre-load
      ],
      scrollBottom: {
        messageSent: true,
        messageReceived: false
      },
      displayHeader:true,
      profilePictureConfig: {
        others: false,
        myself: false,
        styles: {
          width: '30px',
          height: '30px',
          borderRadius: '50%'
        }
      },
      timestampConfig: {   
        format: 'HH:mm',
        relative: false
      },
      // there are other options, you can check them here
      // https://soapbox.github.io/linkifyjs/docs/options.html
      linkOptions: {
        myself: {
          className: 'myLinkClass',
          events: {
            click: function (e) {
              alert('Link clicked!');
            },
            mouseover: function (e) {
              alert('Link hovered!');
            }
          },
          format: function (value, type) {
            if (type === 'url' && value.length > 50) {
              value = value.slice(0, 50) + '…';
            }
            return value;
          }
        },
        others: {
          className: 'othersLinkClass',
          events: {
            click: function (e) {
              alert('Link clicked!');
            },
            mouseover: function (e) {
              alert('Link hovered!');
            }
          },
          format: function (value, type) {
            if (type === 'url' && value.length > 50) {
              value = value.slice(0, 50) + '…';
            }
            return value;
          }
        }
      }
    }
  },
  async created() {
    // Check if a user already exist
    // And set the chat
    if (this.User && this.User.name) {
      this.setUser(this.User, true);
      this.loadMoreMessages();
    }
  },
  computed: {
    ...mapGetters({User: "StateUser", Messages: "StateMessages"}),
  },
  watch: {
    // Watch the val User from the localStorage
    // if the user is login out by the navugation
    // the User will be remove from the localStorage
    // and the component chat has to be hidden
    User: function (val, oldV) {
      if (val == null) {
        this.disconnect();
      }
    }
  },
  methods: {
    ...mapActions(["GetMessages", "CreateMessage", "Register", "LogOut"]),

    async addUser() {
      try {
        var newUser = await this.Register({
          name: this.username,
          password: 'pwd',
          isAdmin: false,
        })
        if (newUser) {
          newUser.data.id = newUser.data._id;
          this.setUser(newUser.data, true, []);
        }
        else {
          this.setUser(null, false);
          this.notification.user = "This username already in use";
        }
      } catch (error) {
        this.setUser(null, false);
      }
    },

    disconnect() {
      this.setUser(null, false);
      
      this.messages = [
        {
          content: 'What do you like to ask me ?',
          myself: false,
          participantId: 1,
          timestamp: {year: 2019, month: 3, day: 5, hour: 13, minute: 10, second: 3, millisecond: 123},
          type: 'text'
        }
      ];
    },

    onType: function (event) {
      //here you can set any behavior
    },
    async loadMoreMessages(resolve) {
      try {
        await this.GetMessages(this.User.id);

        if ( this.messages instanceof Array )
         this.messages = this.messages.concat(this.Messages);
        else
         this.messages.push(this.messages);

      } catch (error) {
        this.notification.user = "Sorry you can't send a message now!";
      }
    },
    onMessageSubmit: function (message) {
      // extend the object message from the component chat
      // by adding the user id
      // the id is required by the API
      // TODO: use a service.message.js to extend object
      message.participantId = this.User.id;
      this.CreateMessage(message);
      this.messages.push(message);

      setTimeout(() => {
          message.uploaded = true
      }, 2000)
    },
    onClose() {
      // a single use cannot hide a chat
      if (this.myself.isAdmin)
        this.visible = false;
    },
    onImageSelected(files, message){
      let src = ''
      this.messages.push(message);
      /**
       * This timeout simulates a requisition that uploads the image file to the server.
       * It's up to you implement the request and deal with the response in order to
       * update the message status and the message URL
       */
       setTimeout((res) => {
        message.uploaded = true
        message.src = res.src
      }, 3000, {src});
     },
     onImageClicked(message){
      /**
       * This is the callback function that is going to be executed when some image is clicked.
       * You can add your code here to do whatever you need with the image clicked. A common situation is to display the image clicked in full screen.
       */
       console.log('Image clicked', message.src)
     },
     setUser(user, ready, messages) {
        this.ready = ready;

        this.username = user ? user.name : null;
        this.myself.name = user ? user.name : null;
        this.myself.id = user ? user.id : null;

        this.myself.isAdmin = user ? user.isAdmin : null;

        // Get the message from the user and set it
        // this.messages = messages;
     }
   },
    mounted() {
      // use to socket to load message sended by the admin

      // this.socket.on('MESSAGE', (data) => {
      //     // this.messages = [...this.messages, data];
      //     console.log('MESSAGE', data);
      //     // you can also do this.messages.push(data)
      // });
    }
 }
     </script>
