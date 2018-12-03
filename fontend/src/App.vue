<template>
  <div id="app">
    <router-link to="/"></router-link>
    <router-view></router-view>
    <!--<div>
      <NavigationBar/>
      <div>
        <div class="row">
          <div class="col-md-12">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
// @ is an alias to /src
import NavigationBar from '@/components/NavigationBar.vue'

export default {
  components: {
    NavigationBar
  }
}
</script>

<style>
  #app {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
