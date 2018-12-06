<template>
  <b-container>
    <b-row class="container contain-request">
      <b-col>
        <div class="noti-title">
          <strong>CÓ CUỐC XE MỚI</strong>
          <br><br>
          <span class="timer">10</span>
        </div>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>1.5 km</span>
          </div>
          <div class="info-ride-start">
            <div class="title">
              TÒA NHÀ A
            </div>
            <div class="detail">
              123 Trần Hưng Đạo, P4, Q1 TPHCM
            </div>
          </div>

          <div class="traveller-divider">
            <div class="inline-block">
                <i class="el-icon-sort icon"></i>
            </div>
            <hr>
          </div>

          <div class="info-ride-end">
            <div class="title">
              TÒA NHÀ A
            </div>
            <div class="detail">
              123 Trần Hưng Đạo, P4, Q1 TPHCM
            </div>
          </div>
        </el-card>
      </b-col>
    </b-row>

    <b-row class="button-row">
      <b-col>
        <el-button class="btn-agree" type="success">ĐỒNG Ý NHẬN CUỐC</el-button>
      </b-col>
    </b-row>
  </b-container>

</template>

<script>
export default {
}
</script>

<style lang="css">
  .container.contain-request {
    background-color: #363A45;
    color: white;
    min-height: 100%;
    min-width: 100%
  }

  .box-card {
    position: relative;
    top: 30%;
    transform: translateY(-30%);
  }

  .noti-title {
    position: relative;
    top: 15%;
    transform: translateY(-15%);
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

  .button-row {
    margin: 0 auto;
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    position: absolute;
    bottom: 50px;
    left: 0px;
    z-index: 99;
  }

  .btn-agree {
    width: 100%;
    height: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
    font-weight: 700;
  }

  .timer {
    color: #A13636;
    font-size: 20px;
  }
</style>
