<template>
  <div class="container">
    <el-card style="margin-top: 10px; background-color: #363A45; color: white">
      <div class="row">
        <div class="col-md-12">
          <el-steps :active="1" align-center>
            <el-step  title="ĐÓN KHÁCH" :description="request.Guest.name"></el-step>
            <el-step title="TRẢ KHÁCH" :description="request.Guest.name"></el-step>
          </el-steps>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-md-8 mt-2">
          <span>{{request.start.name}}</span><br>
          <span>{{request.start.address}}</span>
        </div>
        <div class="col-md-4 mt-2">
          <el-button icon="el-icon-news" type="danger" round>Chỉ đường</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="note-card">
      <div class="row">
        <div class="col-md-12">
          <span>Ghi chú: {{request.Guest.note}}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: ['request']
}
</script>

<style lang="css">
  .note-card .el-card__body {
    padding: 5px !important;
  }
</style>
