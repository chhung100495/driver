<template>
  <b-navbar toggleable="md" type="dark" variant="dark">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-collapse is-nav id="nav_collapse">

    <b-navbar-brand href="#">Driver System</b-navbar-brand>

    <b-navbar-nav class="ml-auto">
      <b-nav-item class="mr-3">
        <el-switch
          :disabled="disableStatus"
          v-model="active"
          @change="changeStatus"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </b-nav-item>

      <b-nav-form class="mx-auto">
        <b-input-group size="sm">
          <b-input-group-text slot="prepend">
            <i class="fas fa-search"></i>
          </b-input-group-text>
          <input type="text" ref="autocomplete" class="form-control-sm autocomplete" placeholder="Nhập vị trí hiện tại">
        </b-input-group>
      </b-nav-form>

      <li class="nav-item ml-3">
        <router-link to="/logout" class="nav-link">Đăng xuất <i class="fas fa-sign-out-alt"></i></router-link>
      </li>
    </b-navbar-nav>

  </b-collapse>
  </b-navbar>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        'active': false
      }
    },
    props:['disableStatus'],
    mounted() {
      var self = this;
      self.$gmapApiPromiseLazy()
        .then(() => {
          var options = {
            types: ['geocode'],
            componentRestrictions: {country: "vn"}
          }
          self.autocomplete = new google.maps.places.Autocomplete(self.$refs.autocomplete, options)
        })
        .then(() => {
          self.autocomplete.addListener('place_changed', () => {
            let place = self.autocomplete.getPlace();
            let ac = place.address_components;
            let lat = place.geometry.location.lat();
            let lng = place.geometry.location.lng();
            let city = ac[0]["short_name"];

            let coordinates = {
              lat: lat,
              lng: lng
            }
            self.$emit('changeCoordinates', coordinates)

            console.log(`The user picked ${city} with the coordinates ${lat}, ${lng}`);
          });
        });
      self.getDriverStatus();
    },
    methods: {
      getDriverStatus() {
        var self = this;
        var url = 'http://localhost:3003/drivers/' + localStorage.id;
        axios({
          method: 'GET',
          url: url,
          headers: {'x-access-token': localStorage.access_token},
          timeout: 5000
        })
        .then(res => {
          if (res.data.Status === 1) {
            self.active = true;
          } else {
            self.active = false;
          };
          self.$emit('driverActivation', self.active);
        })
        .catch(err => {
          self.handleErrors(err);
        })
      },
      changeStatus() {
        var self = this;
        // '1' is online status, '8' is rest status
        var status = (self.active === true ? 1 : 8);
        var url = 'http://localhost:3003/drivers/changeStatus';
        var objToPost = {
            ID: localStorage.id,
            Status: status
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
          self.$notify({
            group: 'notification',
            type: 'success',
            title: 'Thông báo',
            text: res.data.msg
          });

          self.$emit('driverActivation', self.active);
        })
        .catch(err => {
          self.handleErrors(err);
        })
      }
    }
  }
</script>

<style lang="css">
  .form-control-sm.autocomplete {
    width: 270px;
  }
  .form-control-sm {
    border-radius: 0;
  }
  .pac-container {
    width: 270px !important;
  }
</style>
