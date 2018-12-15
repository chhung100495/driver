<template>
  <div class="container col-md-6">
    <el-card style="margin-top: 10px; background-color: #363A45; color: white">
      <div class="row">
        <div class="col-md-12">
          <el-steps :active="stepNumber" align-center>
            <el-step title="ĐÓN KHÁCH" :description="request.NameLocation"></el-step>
            <el-step title="TRẢ KHÁCH" :description="request.FinishLocationName"></el-step>
          </el-steps>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-md-8 mb-3">
          <span>{{request.GuestName}}</span>
        </div>
        <div class="col-md-4">
          <el-button icon="el-icon-news" type="danger" @click="getDirection" round>Chỉ đường</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="note-card">
      <div class="row">
        <div class="col-md-12" v-if="request.Node">
          <i>Ghi chú: {{request.Note}}</i>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    props: [
      'request',
      'stepNumber'
    ],
    methods: {
      getDirection() {
        var self = this;
        self.$emit('showDirection');
      }
    }
  }
</script>

<style lang="css">
  .container {
    margin: 0 auto;
    position: absolute;
    top: 5px;
    left: 0px;
    z-index: 99;
    height: 100%;
  }

  .note-card .el-card__body {
    padding: 5px !important;
  }
</style>
