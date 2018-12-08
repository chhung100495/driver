<template>
  <b-container>
    <b-row class="container contain-request">
      <b-col>
        <div class="contain-detail">
          <span>ĐANG CHỜ YÊU CẦU ĐẶT XE. VUI LÒNG ĐỢI</span>
        </div>
        <el-row class="contain-loading"
          v-loading="loading"
          style="width: 100%">
        </el-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      loading: true
    }
  }
}
</script>

<style lang="css">

  .container.contain-request {
    background-color: #363A45;
    color: white;
    top: 0px;
    min-height: 100%;
    min-width: 100%
  }

  .contain-loading {
    position: relative;
    top: 45%;
    transform: translateY(-45%);
  }

  .contain-detail {
    position: relative;
    top: 40%;
    transform: translateY(-40%);
  }


</style>
