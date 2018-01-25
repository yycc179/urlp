<template>
  <b-container>
    <b-form-group label='Enter video webpage url' description=".eg https://www.youtube.com/watch?v=V54CEElTF_U">
        <b-form-input v-model="url" @keyup.enter="getReal"></b-form-input>
        <p>{{ msg }}</p>
      </b-form-group>

    <b-table :fields="fields" :items="items" v-show="items.length">
        <template slot="res" slot-scope="data">
                {{data.value}}p
          </template>
      <template slot="url" slot-scope="data">
        <b-button :href='data.value' target='_blank'>Play</b-button>
      </template>
    </b-table>

    <div v-show="raw">
        <b-button variant="success" @click='show_d'>Details</b-button>
    </div>
    <div>
        <textarea class="form-control" rows="30" id='info' v-show='show' v-model="raw"></textarea>
    </div>
  </b-container>
</template>

<script>
  import { debounce, startsWith } from 'lodash'
  // import axios from 'axios'
  import { getJSON } from 'jquery'

  export default {
    name: 'video',
    watch: {
      url: function (n) {
        this.msg = 'Waiting for you to stop typing...'
        if (this.url) {
          this.getReal()
        }
      }
    },
    methods: {
      show_d: function () {
        this.show = !this.show
      },
      getReal: debounce(function () {
        if (!startsWith(this.url, 'http') || this.url.length < 10) {
          this.msg = 'Invalid url input'
          return
        }
        this.msg = 'Waiting for server to return result...'
        getJSON('/v?u=' + this.url, r => {
          this.raw = JSON.stringify(r)
          if (!r || !r.formats) {
            this.msg = 'Get result failed!'
            return
          }
          this.msg = ''
          this.items.length = 0
          var m = new Map()
          r.formats.forEach(e => {
            if (e.height >= 360 && startsWith(e.protocol, 'http') && e.ext === 'mp4') {
              console.log(e)
              m.set('' + e.height, e.url)
            }
          })
          var a = [...m.entries()]
          a.forEach(e => {
            // console.log(e)
            this.items.push({res: e[0], url: e[1]})
          })
        })
      }, 500)
    },
    data () {
      return {
        url: '',
        msg: '',
        show: false,
        raw: '',
        fields: [
          { key: 'res', label: 'Reslution' },
          { key: 'url', label: 'Action' }
        ],
        items: [
        ]
      }
    }
  }
</script>
