<template>
  <div>
    <el-card class="card-footer" style="border-top-left-radius: 4px; border-top-right-radius: 4px">
      <b-row>
        <b-col class="left">
          <i class="el-icon-phone icon"></i><br>
        </b-col>
        <b-col class="mid">
          <i class="el-icon-message icon"></i><br>
        </b-col>
        <b-col class="right">
          <el-switch
            v-model="active"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
          <br>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="left">
          <span class="title-icon">GỌI</span>
        </b-col>
        <b-col class="mid">
          <span class="title-icon">TRÒ CHUYỆN</span>
        </b-col>
        <b-col class="right">
          <span class="title-icon">{{ statusText }}</span>
        </b-col>
      </b-row>
      <hr style="background: #292C35; padding: 1px">

      <b-row class="mt-3">
        <b-col cols="8" class="left">
          <el-button style="width: 100%; height: 100%" type="success">NHẬN CUỐC</el-button>
        </b-col>
        <b-col>
          <i class="el-icon-menu icon"></i><br>
          <span class="title-icon">THÊM</span>
        </b-col>
      </b-row>
    </el-card>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        'active': false,
        'statusText': "KHÔNG HOẠT ĐỘNG"
      }
    },
    watch: {
      'active': function(newVal, oldVal) {
        var self = this;
        if(self.active === true)
          self.statusText = "HOẠT ĐỘNG";
        else {
          self.statusText = "KHÔNG HOẠT ĐỘNG";
        }
        self.changeStatus();
      }
    },
    methods: {
      changeStatus() {
        var self = this;
        var status = (self.active === true ? 1 : 2);
        var url = 'http://localhost:3003/users/changeStatus';
        var objToPost = {
            Username: localStorage.username,
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
          self.$message({
            message: res.data.msg,
            type: 'success'
          });
        })
        .catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style lang="css">

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

</style>
