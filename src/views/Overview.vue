<template>
  <div class="overview">
      <div class="container h-100">
          <div class="intro h-100">
            <div class="row h-100 justify-content-center align-items-center">
              <div class="col-md-6">
                 <h3>Overview Page</h3>
                 <div>
                  <p v-if="isConnected">We're connected to the server!</p>
                  <p>Message from server: "{{socketMessage}}"</p>
                  <button @click="pingServer()">Ping Server</button>
                  <div>
                    <label class="typo__label">Select with search</label><br><br>
                    <multiselect v-model="value" :options="options" :custom-label="nameWithLang" placeholder="Select one" label="name" track-by="name"></multiselect>
                    <br><br><pre class="language-json"><code>{{ value  }}</code></pre>
                  </div>
                </div>
              </div>
          </div>
          </div>
     
      </div>
  </div>
</template>

<script>

import io from "socket.io-client";
var socket = io.connect("https://numpakbis-server.herokuapp.com/");


export default {
  name: "Overview",

   data () {
    return {
      isConnected: false,
      socketMessage: [],
      value: [],
      options: [
        { name: 'Vue.js', language: 'JavaScript' },
        { name: 'Adonis', language: 'JavaScript' },
        { name: 'Rails', language: 'Ruby' },
        { name: 'Sinatra', language: 'Ruby' },
        { name: 'Laravel', language: 'PHP' },
        { name: 'Phoenix', language: 'Elixir' }
      ]
    }
  },
   created() {
    this.getRealtimeData()
  }, 
  methods: {
    nameWithLang ({ name, language }) {
      return `${name} — [${language}]`
    },
   getRealtimeData() {
      socket.on("receive_message", fetchedData => {
        //this.socketMessage.push(fetchedData);
        console.log(fetchedData);
      })
      socket.on("pingServer", fetchedData => {
        this.socketMessage.push(fetchedData);
      })
    },
    pingServer() {
      // Send the "pingServer" event to the server.
       socket.emit('pingServer', 'PING!')
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped lang="scss">


</style>