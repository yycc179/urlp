<template>
  <div>
    <!-- Simple File -->
    <b-form-file id="file_input1" ></b-form-file>

    <div class="mt-3">
      <!-- Customized labels -->
      <b-form-file id="file_input2" choose-label="Attachment2"></b-form-file>
    </div>
  </div>
</template>

<script>
  import { getProfile } from '../api'

  export default {
    created () {
      const { s } = this.$route.query
      if (s) {
        this.$store.commit('setToken', s)
        getProfile(s, (e, r) => {
          if (e) {
            this.msg = e
          } else {
            this.$store.commit('setUser', r)
          }
        })
      }
    }
  }
</script>