<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="info">
      
        <b-nav-toggle target="nav_collapse"></b-nav-toggle>
      
        <b-navbar-brand to="/">OTT server</b-navbar-brand>
      
        <b-collapse is-nav id="nav_collapse">
      
          <b-navbar-nav>
            <b-nav-item to="#">Video</b-nav-item>
            <b-nav-item to="about">About</b-nav-item>
          </b-navbar-nav>
      
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="login" v-if='!user'>Login</b-nav-item>
            <b-nav-item-dropdown right v-else>
              <!-- Using button-content slot -->
              <template slot="button-content">
                <em>{{user.name || user.email}}</em>
              </template>
              <b-dropdown-item to="profile">Profile</b-dropdown-item>
              <b-dropdown-item to='/' @click='loginOut'>Signout</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>

      <router-view/>
    <b-nav-text>&copy; 2017 - yycc179@gmail.com</b-nav-text>
  </div>
  
</template>

<script>
import {mapState} from 'vuex'
import { getProfile } from './api'

export default {
  name: 'app',
  created () {
    var s = localStorage.getItem('token')
    if (s) {
      getProfile(s, (e, r) => {
        if (e) {
          this.msg = e
        } else {
          this.$store.commit('setUser', r)
        }
      })
    }
  },
  computed: mapState(['user']),
  methods: {
    loginOut: function () {
      this.$store.commit('clearUser')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-bottom: 60px;
}

form {
  width: 350px
}

.container {
  padding: 10px;  
}
</style>
