<template>
  <div id="app">
    <router-view></router-view>
    <notifications group="notification" position="bottom right"/>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="css">
  #app {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .el-notification.right {
    border-left: none;
  }

  .notification-bottom {
    z-index: 99;
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    background-color: black;
    height: 20px;
  /* Rest of your styling */
  }
  .notification-bottom > .alert {
    color: white;
    text-align: center;
  }
</style>
