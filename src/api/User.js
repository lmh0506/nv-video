import axios from 'axios'

export const checkUserName = userName => {
  return axios.post('/api/user/exist', {userName})
}

export const checkName = name => {
  return axios.post('/api/user/exist', {name})
}

export const registeUser = form => {
  let {userName, passWord, email, name} = form
  return axios.post('/api/user/registe', {userName, passWord, email, name})
}

export const loginUser = form => {
  let {userName, passWord} = form
  return axios.post('/api/user/login', {userName, passWord})
}

export const checkLogin = () => {
  return axios.get('/api/user/checkLogin')
}

export const loginOut = () => {
  return axios.get('/api/user/loginOut')
}
