<template>
  <b-container>
    <h2>Server info</h2>
    <table class="table">
      <tbody>
        <tr v-for='i in items'>
          <td>
            {{i.name}}
          </td>
          <td>
            {{i.value}}
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Support</h2>
    <ul class="list-group">
      <li class="list-group-item">Activation</li>
      <li class="list-group-item">Video url parse</li>
      <li class="list-group-item">YT Signature API</li>
    </ul>
  </b-container>
</template>

<script>
  import { getJSON } from 'jquery'

  export default {
    data () {
      return {
        items: [],
        handle: 0
      }
    },
    created () {
      var self = this
      this.handle = setInterval(function () {
        getJSON('/sys', r => { self.items = r })
      }, 1200)
    },
    destroyed () {
      clearInterval(this.handle)
    }
  }
</script>
