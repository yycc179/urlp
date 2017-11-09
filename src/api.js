import { ajax, getJSON } from 'jquery'
import store from './store'

function renewToken (s, cbk) {
  getJSON('/auth/renew?token=' + s, r => {
    console.log(r.token)
    cbk(r.token)
  })
}

export function getProfile (s, cbk) {
  ajax({
    url: 'auth/profile',
    dataType: 'json',
    error: e => {
      if (e.status === 498) {
        renewToken(s, t => {
          if (t) {
            store.commit('setToken', t)
            getProfile(t, cbk)
          }
        })
      }
    },
    headers: {
      Authorization: 'Bearer ' + s
    },
    success: r => {
      cbk(r.err, r)
    }
  })
}
