<template>
  <div class="container">
    <el-card style="margin-top: 10px; background-color: #363A45; color: white">
      <div class="row">
        <div class="col-md-12">
          <el-steps :active="1" align-center>
            <el-step  title="ĐÓN KHÁCH" description="Tên khách hàng"></el-step>
            <el-step title="TRẢ KHÁCH" description="Tên khách hàng"></el-step>
          </el-steps>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-md-8 mt-2">
          <span>123 TRẦN HƯNG ĐẠO, PHƯỜNG 1, QUẬN 8, TPHCM</span>
        </div>
        <div class="col-md-4 mt-2">
          <el-button icon="el-icon-news" type="danger" round>Chỉ đường</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="note-card">
      <div class="row">
        <div class="col-md-12">
          <span>Tôi sẽ đợi ở cổng chính</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css">
  .note-card .el-card__body {
    padding: 5px !important;
  }
</style>
