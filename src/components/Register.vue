<template>
  <b-container>
    <b-form @submit.prevent="onSubmit">
      <b-form-group label="Email address" label-for="r1" description="It will be used to get back your account">
        <b-form-input id="r1" type="email" v-model="form.email" required ></b-form-input>
      </b-form-group>

      <b-form-group label="Password" label-for="r2">
        <b-form-input id="r2" type="password" v-model="form.password" required></b-form-input>
      </b-form-group>

      <b-form-group label="Comfirm password" label-for="r3" aria-describedby="input-help input-feeback">
        <b-form-input id="r3" type="password" v-model="confirm_pass" required :state="state"></b-form-input>
        <b-form-feedback id="input-feedback">
            The passwords entered did not match
          </b-form-feedback>
      </b-form-group>
      <p class="text-danger">{{msg}}</p>
      
      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="secondary">Reset</b-button>
    </b-form>
  </b-container>
</template>

<script>
  import { ajax } from 'jquery'

  export default {
    computed: {
      state () {
        return this.confirm_pass === this.form.password
      }
    },
    data () {
      return {
        form: {
          email: '',
          password: '',
          secret: 'S3CR3T'
        },
        confirm_pass: '',
        msg: ''
      }
    },
    methods: {
      onSubmit () {
        if (!this.state) {
          return
        }
        this.msg = ''
        ajax({
          url: '/auth/signup',
          type: 'post',
          data: this.form,
          error: e => console.log(e),
          success: r => {
            if (r.err) {
              this.msg = r.err
            } else {
              this.$router.push('login')
            }
          }
        })
      }
    }
  }
</script>
