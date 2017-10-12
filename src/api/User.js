import axios from 'axios'

export function checkUserName () {
  return axios.get('/api/user')
}
