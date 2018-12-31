<template>
  <div class="footer-bar">
    <el-card class="card-footer" style="border-top-left-radius: 4px; border-top-right-radius: 4px">
      <b-row>
        <b-col class="left">
          <i class="el-icon-phone icon"></i><br>
        </b-col>
        <b-col class="mid">
          <i class="el-icon-message icon"></i><br>
        </b-col>
        <b-col class="right">
          <i v-if="showBtnCancelRequest" class="el-icon-close icon"></i>
          <i v-if="showBtnSupport" class="el-icon-service icon"></i>
          <br>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="left">
          <span class="title-icon">GỌI</span>
        </b-col>
        <b-col class="mid">
          <span class="title-icon">NHẮN TIN</span>
        </b-col>
        <b-col class="right">
          <span v-if="showBtnCancelRequest" class="title-icon">HỦY</span>
          <span v-if="showBtnSupport" class="title-icon">HỖ TRỢ</span>
        </b-col>
      </b-row>
      <hr style="background: #292C35; padding: 1px">

      <b-row class="mt-3">
        <b-col cols="8" class="left">
          <el-button @click="onClickBtnArrived" style="width: 100%; height: 100%" type="success">{{btnArrivedText}}</el-button>
        </b-col>
        <b-col>
          <a v-if="showBtnStartingPoint" @click="onClickBtnStartingPoint" href="javascript:;"><i class="el-icon-location-outline icon text-light"></i><br></a>
          <span v-if="showBtnStartingPoint" @click="onClickBtnStartingPoint" class="title-icon">ĐÓN KHÁCH</span>

          <a v-if="showBtnDestination" @click="onClickBtnDestination" href="javascript:;"><i class="el-icon-location-outline icon text-light"></i><br></a>
          <span v-if="showBtnDestination" @click="onClickBtnDestination" class="title-icon">TRẢ KHÁCH</span>
        </b-col>
      </b-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showBtnStartingPoint: true,
        showBtnDestination: false,
        showBtnCancelRequest: true,
        showBtnSupport: false,
        btnArrivedText: "BẮT ĐẦU",
        arrivedNumber: 0
      }
    },
    methods: {
      onClickBtnArrived() {
        var self = this;

        self.arrivedNumber++;

        if (self.arrivedNumber === 1) {
          self.showBtnStartingPoint = false;
          self.showBtnDestination = true;
          self.showBtnSupport = true;
          self.showBtnCancelRequest = false;
          self.btnArrivedText = "KẾT THÚC";

          // store info stepNumber of processing request
          localStorage.stepNumber = 1;
        }
        if (self.arrivedNumber === 2) {
          // clear info processing request
          localStorage.removeItem('processingRequest');
          localStorage.removeItem('stepNumber');
        }

        self.$emit('arrvied', self.arrivedNumber);
      },
      onClickBtnStartingPoint() {
        var self = this;
        self.$emit('zoomStartingPoint');
      },
      onClickBtnDestination() {
        var self = this;
        self.$emit('zoomDestination');
      }
    },
    mounted() {
      if (Number(localStorage.stepNumber) === 1) {
        var self = this;
        self.showBtnStartingPoint = false;
        self.showBtnDestination = true;
        self.showBtnSupport = true;
        self.showBtnCancelRequest = false;
        self.btnArrivedText = "KẾT THÚC";
        self.arrivedNumber++;
      }
    }
  }
</script>

<style lang="css">
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

  .el-step__description {
    color: white !important;
  }

  .el-step__title.is-finish {
    color: #409EFF !important;
    font-weight: bold !important;
  }

  .el-step__title.is-process {
    color: #A13636 !important;
  }

  .icon {
    font-size: 26px;
  }

  .title-icon {
    font-size: 12px;
    margin-top: 5px;
  }

  .card-footer {
    border: 0px;
    border-radius: 0px;
    background-color: #363A45;
    color: white;
  }

  .left {
    border-right: 2px solid #292C35;
  }

  .right {
    border-left: 2px solid #292C35;
  }

  .card-footer .el-card__body {
    padding: 5px !important;
  }

  .card-footer {
    padding: 10px;
  }
</style>
