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
      socketMessage: []
    }
  },
   created() {
    this.getRealtimeData()
  }, 
  methods: {
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>