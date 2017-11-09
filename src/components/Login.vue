<template>
  <b-container>
    <b-row>
      <b-col cols="4">
        <b-form name='login' @submit.prevent='onSubmit'>
          <b-form-group id="exampleInputGroup1" label="Email address" label-for="exampleInput1">
            <b-form-input id="exampleInput1" type="email" v-model="form.email" required placeholder="Enter email"></b-form-input>
          </b-form-group>
          <b-form-group id="exampleInputGroup2" label="Password" label-for="exampleInput2">
            <b-form-input id="exampleInput2" type="password" v-model="form.password" required placeholder="Enter password"></b-form-input>
          </b-form-group>
          <p class="text-danger">{{msg}}</p>
          <b-button type="submit" variant="primary">Log in</b-button>
          <b-button type="button" variant="secondary" to='register'>Sign up</b-button>
        </b-form>
      </b-col>
      <b-col>
        <div style="margin: 40px 0 ">
          <b-button variant="primary" :href="gitUrl"><span class="label label-primary">Github SignIn</span></b-button>
        </div>
        <div>
          <b-button variant="primary" :href="googleUrl"><span class="label label-primary">Google SignIn</span></b-button>
        </div>
      </b-col>
    </b-row>
  </b-container>

</template>

<script>
  import { ajax } from 'jquery'

  export default {
    data () {
      return {
        form: {
          email: '',
          password: '',
          secret: 'S3CR3T'
        },
        loginUrl: '/auth/login',
        gitUrl: '/auth/oauth/github',
        googleUrl: '/auth/oauth/google',
        msg: ''
      }
    },
    created () {
      const { client } = this.$route.query
      if (client) {
        var s = '?client=' + client
        this.loginUrl += s
        this.gitUrl += s
        this.googleUrl += s
      }
    },
    methods: {
      onSubmit (e) {
        this.msg = ''
        ajax({
          url: this.loginUrl,
          type: 'post',
          dataType: 'json',
          data: this.form,
          error: e => { this.msg = e },
          success: r => {
            if (r.err) {
              this.msg = r.err
              setTimeout(() => {
                this.msg = ''
              }, 2000)
            } else {
              this.$store.commit('setToken', r.token)
              this.$store.commit('setUser', r.user)
              this.$router.push('profile')
            }
          }
        })
      }
    }
  }
</script>
