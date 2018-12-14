<template lang="html">
    <div>
      <NavigationBar @changeCoordinates="getCoordinates" @driverActivation="checkActive"/>
      <div style="position: relative">
        <gmap-map
          id="map"
          :center="currentPosition"
          :zoom="16"
          ref="gmap"
          :options="options"
          map-type-id="terrain">
          <gmap-marker ref="markers" :position="currentPosition" :draggable="true" @dragend="changePosition">
          </gmap-marker>
        </gmap-map>

        <RequestWindow v-if="showRequestWindow" :request="request" @acceptRequest="handleAcceptRequest"></RequestWindow>
        <!-- <div class="container" v-if="request">
          <InfoBar :request="request"/>
        </div> -->

        <FooterBar v-if="showFooterBar"/>

        <div v-if="!active" class="notification-bottom">
          <small class="alert">Bạn đang trong chế độ nghỉ ngơi, không nhận được cuốc.</small>
        </div>
      </div>
    </div>
</template>

<script>
  import NavigationBar from '@/components/NavigationBar.vue'
  import InfoBar from '@/components/InfoBar.vue'
  import FooterBar from '@/components/FooterBar.vue'
  import RequestWindow from '@/components/RequestWindow.vue'
  import axios from 'axios'

  export default {
    props: [
      'request'
    ],
    components: {
      NavigationBar,
      InfoBar,
      FooterBar,
      RequestWindow
    },
    data () {
      return {
        showRequestWindow: false,
        showFooterBar: false,
        active: false,
        distance: null,
        marker: null,
        mapModel: null,
        geocoder: null,
        position: {
          lat: 0,
          lng: 0
        },
        currentPosition: {
          lat: 0,
          lng: 0
        },
        options: {
          disableDefaultUI : true,
          styles: [{
            'featureType': 'water',
            'stylers': [{'saturation': 43}, {'lightness': -11}, {'hue': '#0088ff'}]
          }, {
            'featureType': 'road',
            'elementType': 'geometry.fill',
            'stylers': [{'hue': '#ff0000'}, {'saturation': -100}, {'lightness': 99}]
          }, {
            'featureType': 'road',
            'elementType': 'geometry.stroke',
            'stylers': [{'color': '#808080'}, {'lightness': 54}]
          }, {
            'featureType': 'landscape.man_made',
            'elementType': 'geometry.fill',
            'stylers': [{'color': '#ece2d9'}]
          }, {
            'featureType': 'poi.park',
            'elementType': 'geometry.fill',
            'stylers': [{'color': '#ccdca1'}]
          }, {
            'featureType': 'road',
            'elementType': 'labels.text.fill',
            'stylers': [{'color': '#767676'}]
          }, {
            'featureType': 'road',
            'elementType': 'labels.text.stroke',
            'stylers': [{'color': '#ffffff'}]
          }, {'featureType': 'poi', 'stylers': [{'visibility': 'off'}]}, {
            'featureType': 'landscape.natural',
            'elementType': 'geometry.fill',
            'stylers': [{'visibility': 'on'}, {'color': '#b8cb93'}]
          }, {'featureType': 'poi.park', 'stylers': [{'visibility': 'on'}]}, {
            'featureType': 'poi.sports_complex',
            'stylers': [{'visibility': 'on'}]
          }, {'featureType': 'poi.medical', 'stylers': [{'visibility': 'on'}]}, {
            'featureType': 'poi.business',
            'stylers': [{'visibility': 'simplified'}]
          }]
        }
      }
    },
    methods: {
      toRad(x) {
        return x * Math.PI / 180;
      },
      haversineDistance() {
        var self = this;
        var R = 6371; // km
        var x1 = self.position.lat - self.currentPosition.lat;
        var dLat = self.toRad(x1);
        var x2 = self.position.lng - self.currentPosition.lng;
        var dLng = self.toRad(x2);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(self.toRad(self.currentPosition.lat)) * Math.cos(self.toRad(self.position.lat)) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        self.distance = d * 1000; // convert km to m
        self.validateDistance();
      },
      matrixDistance() {
        var self = this;
        var origin = new google.maps.LatLng(self.currentPosition.lat, self.currentPosition.lng);
        var destination = new google.maps.LatLng(self.position.lat, self.position.lng);
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL,
          avoidHighways: false,
          avoidTolls: false
        }, self.callback);
      },
      callback(response, status) {
        if (status != google.maps.DistanceMatrixStatus.OK) {
          self.$notify({
              group: 'notification',
              type: 'error',
              title: 'Thông báo',
              text: status
          });
        } else {
          var origin = response.originAddresses[0];
          var destination = response.destinationAddresses[0];
          if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
            self.$notify({
              group: 'notification',
              type: 'error',
              title: 'Thông báo',
              text: "Không tìm thấy đường đi từ "+ origin + " đến " + destination + "."
            });
          } else {
            var distance = response.rows[0].elements[0].distance;
            var distance_value = distance.value;
            var distance_text = distance.text;
            var miles = distance_text.substring(0, distance_text.length - 3);
            self.distance = miles * 1609.34; // convert miles to meters
            self.validateDistance();
          }
        }
      },
      validateDistance() {
        var self = this;
        if(self.distance > 100) {
          self.position.lat = 0;
          self.position.lng = 0;
          self.$notify({
            group: 'notification',
            type: 'error',
            title: 'Thông báo',
            text: "Vị trí mới không được xa quá 100m so với vị trí hiện tại."
          });
        } else {
          self.currentPosition.lat = self.position.lat;
          self.currentPosition.lng = self.position.lng;
          self.updateCoordinates();
        }
      },
      getCoordinates(args) {
        var self = this;
        self.position.lat = args.lat;
        self.position.lng = args.lng;
        self.haversineDistance();
      },
      updateCoordinates() {
        var self = this;
        var url = 'http://localhost:3003/drivers/updateCoordinates';
        var objToPost = {
            ID: localStorage.id,
            Latitude: self.currentPosition.lat,
            Longtitude: self.currentPosition.lng
        }
        var jsonToPost = JSON.stringify(objToPost);
        axios({
          method: 'POST',
          url: url,
          headers: {'x-access-token': localStorage.access_token},
          data: jsonToPost,
          timeout: 10000
        })
        .then(res => {
          console.log(res.data.msg);
        })
        .catch(err => {
          console.log(err)
        })
      },
      changePosition(marker) {
        var self = this;
        self.position.lat = marker.latLng.lat();
        self.position.lng = marker.latLng.lng();
        self.haversineDistance();
      },
      geolocate() {
        var self = this;
        navigator.geolocation.getCurrentPosition(position => {
          self.currentPosition.lat = position.coords.latitude;
          self.currentPosition.lng = position.coords.longitude;
          self.updateCoordinates();
        });
      },
      handlePermission() {
        var self = this;
        navigator.permissions.query({name:'geolocation'}).then(function(result) {
          if (result.state == 'granted') {
            console.log('Permission ' + result.state);
            self.geolocate();
          } else if (result.state == 'prompt' || result.state == 'denied') {
            console.log('Permission ' + result.state);
            self.$notify({
              group: 'notification',
              type: 'warn',
              title: 'Thông báo',
              text: "Vui lòng bật chế độ định vị để có thể hỗ trợ tài xế một cách tốt nhất."
            });
            self.getLastPosition();
          }
        });
      },
      checkActive(args) {
        var self = this;
        self.active = args;
      },
      getLastPosition() {
        var self = this;
        var url = 'http://localhost:3003/drivers/' + localStorage.id;
        axios({
          method: 'GET',
          url: url,
          headers: {'x-access-token': localStorage.access_token},
          timeout: 5000
        })
        .then(res => {
          if (res.data.Latitude != null && res.data.Longtitude != null) {
            self.currentPosition.lat = Number(res.data.Latitude);
            self.currentPosition.lng = Number(res.data.Longtitude);
          } else {
            self.currentPosition.lat = 10.7624176;
            self.currentPosition.lng = 106.68119679999995;
            self.updateCoordinates();
          }
        })
        .catch(err => {
          console.log(err)
        })
      },
      onCurrentPositionUpdated() {
        var self = this;
        self.$emit('currentPositionUpdated', self.currentPosition);
      },
      handleAcceptRequest(args) {
        var self = this;
        self.showRequestWindow = false;
        if (args === true) {
          self.showFooterBar = true;
        }
      }
    },
    mounted() {
      var self = this;
      self.$gmapApiPromiseLazy().then(() => {
        self.geocoder = new google.maps.Geocoder();
        self.handlePermission();
      })
      self.marker = self.$refs.markers;
      self.mapModel = self.$refs.gmap;

      // watch object 'currentPosition' change value
      this.$watch('$data.currentPosition', this.onCurrentPositionUpdated, { deep: true })
    },
    watch: {
      request (newValue, oldValue) {
        var self = this;
        self.showRequestWindow = true;
      },

      active (newValue, oldValue) {
        var self = this;
        // '1' is online status, '8' is rest status
        var status = (self.active === true ? 1 : 8);
        self.$emit('currentStatus', status);
      }
    }
  }
</script>

<style lang="css">
  #map {
    min-height: calc(100vh - 75px);
  }
</style>
