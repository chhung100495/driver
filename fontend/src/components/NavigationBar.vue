<template>
  <b-navbar toggleable="md" type="light">

  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

  <b-navbar-brand>
    <router-link to="/home">
      <strong>Driver System</strong>
    </router-link>
  </b-navbar-brand>

  <b-collapse is-nav id="nav_collapse">

    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <li class="nav-item">
        <router-link to="/logout" class="nav-link">Đăng xuất <i class="fas fa-sign-out-alt"></i></router-link>
      </li>
    </b-navbar-nav>

  </b-collapse>
</b-navbar>

</template>

<script>
  export default {}
</script>

<style lang="css">
</style>
