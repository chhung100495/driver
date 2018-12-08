<template>
  <div class="home">
    <Map :request="receivedRequest" />
  </div>
</template>

<script>

import Map from '@/components/Map.vue'

export default {
  name: 'home',
  components: {
    Map
  },
  data() {
    return {
      receivedRequest: null
    }
  },
  methods: {
    setupWebSocket() {
      var self = this
      window.WebSocket = window.WebSocket || window.MozWebSocket
      var clientSocket = new WebSocket('ws://localhost:40511');

      clientSocket.onopen = function () {
          clientSocket.send('Hello server!');
      }

      clientSocket.onmessage = function (e) {
        var value = JSON.parse(e.data)
        self.receivedRequestValue(value)
      }
    },
    receivedRequestValue(value) {
      var self = this;
      self.receivedRequest = value;
      console.log('received request', value)
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.setupWebSocket()
  }
}
</script>
