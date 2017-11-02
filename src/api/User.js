import axios from 'axios'

export const checkExist = params => {
  return axios.post('/api/user/exist', params)
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

export const getUserList = (searchKey, page, pageSize) => {
  return axios.get('/api/user/getList', {params: {searchKey, page, pageSize}})
}

export const deleteUser = (id) => {
  return axios.post('/api/user/delete', {id})
}

export const updateUser = (id, userForm) => {
  return axios.post('/api/user/update', {id, userForm})
}

export const sendEmail = email => {
  return axios.post('/api/user/sendEmail', {email})
}

export const checkEmailYzm = form => {
  return axios.post('/api/user/checkEmailYzm', form)
}

export const setNewPwd = (email, passWord) => {
  return axios.post('/api/user/setNewPwd', {email, passWord})
}

export const getUser = id => {
  return axios.get('/api/user/getUser', {params: {id}})
}

export const getIsStoreAndRate = (uid, vid) => {
  return axios.get('/api/user/video/isStoreAndRate', {params: {uid, vid}})
}

export const getStoreList = (id, page, pageSize) => {
  return axios.get('/api/user/video/storeList', {params: {id, page, pageSize}})
}

export const deleteStoreVideo = (uid, vid) => {
  return axios.post('/api/user/video/removeStore', {uid, vid})
}

export const getMyHotVideo = (id) => {
  return axios.get('/api/user/video/myHotVideo', {params: {id}})
}

export const getUserAdmin = () => {
  return axios.get('/api/user/userAdminList')
}

export const setAdmin = (user, flag) => {
  return axios.post('/api/user/setAdmin', {user, flag})
}

export const isAdmin = () => {
  return axios.post('/api/user/isAdmin')
}
