<template>
  <div class="container-fluid">
    <div class="row">
      <div class="title col-sm-4 col-md-4 offset-sm-4 offset-md-4">
        <strong>CÓ CUỐC XE MỚI</strong>
      </div>
    </div>
    <div class="row">
      <div class="timer col-sm-4 col-md-4 offset-sm-4 offset-md-4">
        <div class="progress">
          <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" :style="styleTimer">
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="content col-sm-4 col-md-4 offset-sm-4 offset-md-4">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ request.distance }} km</span>
          </div>
          <div class="info-ride-start">
            <div class="detail">
              <strong>
                {{ request.NameLocation }}
              </strong>
            </div>
          </div>

          <div class="traveller-divider">
            <div class="inline-block">
                <i class="el-icon-sort icon"></i>
            </div>
            <hr>
          </div>

          <div class="info-ride-end">
            <div class="detail">
              <strong>
                {{ request.FinishLocationName }}
              </strong>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="row">
      <div class="btn-choose col-sm-4 col-md-4 offset-sm-4 offset-md-4">
        <b-button class="btn btn-block decline" @click="declineRequest">TỪ CHỐI</b-button>
        <b-button class="btn btn-success btn-block agree" @click="acceptRequest">ĐỒNG Ý</b-button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    props: ['request'],
    data() {
      return {
        styleTimer: {
          width: '0%',
          'transition-duration': '50ms'
        },
        countdown: 10,
        num: 0,
        requestModel: {}
      }
    },
    mounted() {
      var self = this;
      var increment = setInterval(() => {
        if (self.num > 100) {
          clearInterval(increment);
        }
        self.num = self.num + 1;
        self.styleTimer.width = (self.num % 100) + '%';
      }, 100);
      setInterval(() => {
        if (self.countdown === 0) {
          return;
        }
        self.countdown--;
      }, 1000);
    },
    methods: {
      acceptRequest() {
        var self = this;
        self.$emit('acceptRequest', true);
      },
      declineRequest() {
        var self = this;
        self.rejectRequest();
        self.$emit('acceptRequest', false);
      },
      rejectRequest() {
        var self = this;
        var url = 'http://localhost:3003/requests/resend';
        var objToPost = JSON.stringify(self.request);
        axios({
          method: 'POST',
          url: url,
          data: objToPost,
          headers: {'x-access-token': localStorage.access_token},
          timeout: 10000
        })
        .then(res => {
          console.log(res.data.msg);
        })
        .catch(err => {
          self.handleErrors(err);
        })
      }
    },
    watch: {
      request(newValue, oldValue) {
        var self = this;
        self.requestModel = newValue;
      },
      countdown(newValue, oldValue) {
        var self = this;
        if (newValue === 0) {
          self.rejectRequest();
          self.$emit('acceptRequest', false);
        }
      }
    }
  }
</script>

<style lang="css" scoped>
  .container-fluid {
    margin: 0 auto;
    position: absolute;
    top: 10px;
    left: 0px;
    bottom: 10px;
    z-index: 99;
    color: white;
  }

  .title, .timer, .content, .btn-choose {
    background-color: #343a40;
    padding-top: 10px;
  }

  .btn-choose {
    padding-bottom: 10px;
  }

  .box-card {
    position: relative;
    top: 30%;
    transform: translateY(-30%);
  }

  .box-card.el-card__body {
    padding: 0px !important;
  }

  .info-ride-start {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 20px;
    padding-bottom: 15px;
  }

  .info-ride-end {
    padding-top: 15px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
  }

  .icon {
    font-size: 28px;
  }

  .traveller-divider {
    position: relative;
  }

  .inline-block {
    display: inline-block;
    padding: 5px 10px;
    background: white;
    position: relative;
    z-index: 2;
  }

  .traveller-divider hr {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    margin: 0;
    z-index: 1;
  }

  .detail {
    font-size: 14px;
  }

  .agree, .decline {
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    left: 0px;
    z-index: 99;
  }
</style>
