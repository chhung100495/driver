<template>
  <div class="home">
    <Map :request="receivedRequest" @currentPositionUpdated="getCurrentPosition" @currentStatus="getCurrentStatus" />
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
      clientSocket: null,
      receivedRequest: null,
      currentPosition: {
        lat: 0,
        lng: 0
      },
      currentStatus: null
    }
  },
  methods: {
    setupWebSocket() {
      var self = this
      window.WebSocket = window.WebSocket || window.MozWebSocket
      self.clientSocket = new WebSocket('ws://localhost:40511');

      self.clientSocket.onopen = function () {
        console.log("Connected to server.");
      }

      self.clientSocket.onclose = function() {
        console.log('Closed');
      };

      self.clientSocket.onmessage = function (e) {
        var request = JSON.parse(e.data);
        self.receivedRequestValue(request);
      }
    },
    receivedRequestValue(request) {
      var self = this;
      self.receivedRequest = request;
      console.log('Received request', request)
    },
    getCurrentPosition(args) {
      var self = this;
      self.currentPosition = args;
    },
    getCurrentStatus(args) {
      var self = this;
      self.currentStatus = args;
    },
    sendMessageToServer() {
      var self = this;
      self.clientSocket.send(JSON.stringify({
        id: localStorage.id,
        lat: self.currentPosition.lat,
        lng: self.currentPosition.lng,
        status: self.currentStatus
      }));
    }
  },
  mounted() {
    var self = this;

    self.setupWebSocket();

    // watch object 'currentPosition' change value
    self.$watch('$data.currentPosition', self.sendMessageToServer, { deep: true })
  },
  watch: {
    currentStatus (newValue, oldValue) {
      var self = this;
      self.sendMessageToServer();
    }
  }
}
</script>
