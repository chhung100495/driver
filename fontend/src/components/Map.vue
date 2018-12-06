<template lang="html">
  <div>
    <div v-if="true">
      <NavigationBar/>
      <div class="">
        <div style="position: relative">
          <gmap-map
            id="map"
            :center="center"
            :zoom="16"
            ref="gmap"
            :options="options"
            map-type-id="terrain">
            <gmap-marker ref="markers" :position="center" :draggable="true" @drag="updateCoordinates">
            </gmap-marker>
          </gmap-map>
          <div class="container">
            <InfoBar />
          </div>

          <div class="footer-bar" >
            <FooterBar />
          </div>
        </div>
      </div>
    </div>

    <div v-if="false">
      <RequestWindow />
    </div>

  </div>

</template>

<script>
  import Vue from 'vue'
  import NavigationBar from '@/components/NavigationBar.vue'
  import InfoBar from '@/components/InfoBar.vue'
  import FooterBar from '@/components/FooterBar.vue'
  import RequestWindow from '@/components/RequestWindow.vue'
  import * as VueGoogleMaps from 'vue2-google-maps'

  Vue.use(VueGoogleMaps, {
    load: {
      key: "AIzaSyBkwRNAhT2ic6ZMR3i10ms51YhUJGHTXaQ",
      libraries: 'places'
    }
  })
  export default {
    props: ['request'],
    components: {
      NavigationBar,
      InfoBar,
      FooterBar,
      RequestWindow
    },
    data () {
      return {
        state4: '',
        timeout: null,
        marker: null,
        inputData: '',
        mapModel: null,
        selectedRequest: {},
        geocoder: null,
        position: {
          lat: 0,
          lng: 0
        },
        center: {
          lat: 10.762558,
          lng: 106.681426
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
      geocodeAddress(geocoder, resultsMap) {
        var self = this
        geocoder.geocode({ 'address': this.inputData }, function(results, status) {
          if (status === 'OK') {
            var location = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() }
            resultsMap.$mapObject.panTo(location)
            self.marker.$markerObject.setPosition(location)
            self.position.lat = location.lat
            self.position.lng = location.lng
          } else {
            self.$message({
              type: 'error',
              message: 'Không tìm được địa điểm'
            });
          }
        })
      },
      updateCoordinates(marker) {
        this.position.lat = marker.latLng.lat()
        this.position.lng = marker.latLng.lng()
      },
      emitRequestGeocode() {
        if ((this.position.lat == 0 && this.position.lng == 0) || this.request.ID == null) {
          this.$message({ type: 'error', message: 'Không đủ thông tin để ghi nhận' });
          return
        }
        var geocode = {
          ID: this.request.ID,
          Lat: this.position.lat,
          Lng: this.position.lng
        }
        this.$emit('locationUpdated', geocode)
      },
      requestInfo() {
        if (this.selectedRequest.GuestName == null && this.selectedRequest.NameLocation == null) {
          return 'Không có thông tin để hiển thị'
        }
        return `Tên khách hàng: ${this.selectedRequest.GuestName} - Địa chỉ đón: ${this.selectedRequest.NameLocation}`
      },
      disableButton() {
        return this.selectedRequest.ID == null
      }
    },
    mounted() {
      this.$gmapApiPromiseLazy().then(() => {
        this.geocoder = new google.maps.Geocoder();
      })
      this.marker = this.$refs.markers
      this.mapModel = this.$refs.gmap
    },
    watch: {
      request (newValue, oldValue) {
        this.selectedRequest = newValue
      }
    }
  }
</script>

<style lang="css">
  #map {
    min-height: calc(100vh - 75px);
  }

  .container {
    margin: 0 auto;
    position: absolute;
    top: 10px;
    left: 0px;
    z-index: 99;
    height: 100%;
  }

  .footer-bar {
    margin: 0 auto;
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    position: absolute;
    bottom: 10px;
    left: 0px;
    z-index: 99;
  }

</style>
