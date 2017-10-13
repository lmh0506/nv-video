import axios from 'axios'

export const checkUserName = userName => {
  return axios.post('/api/user/exist', {userName})
}

export const registeUser = form => {
  let {userName, passWord, email, name} = form
  return axios.post('/api/user/registe', {userName, passWord, email, name})
}

export const loginUser = form => {
  let {userName, passWord} = form
  return axios.post('/api/user/login', {userName, passWord})
}
