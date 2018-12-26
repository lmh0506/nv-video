import axios from 'axios'
const base = '/api/user/'

export const checkExist = params => {
  return axios.post(base + 'exist', params)
}

export const registeUser = form => {
  let {userName, passWord, email, name} = form
  return axios.post(base + 'registe', {userName, passWord, email, name})
}

export const loginUser = form => {
  let {userName, passWord} = form
  return axios.post(base + 'login', {userName, passWord})
}

export const checkLogin = () => {
  return axios.get(base + 'checkLogin')
}

export const loginOut = () => {
  return axios.get(base + 'loginOut')
}

export const getUserList = (searchKey, page, pageSize) => {
  return axios.get(base + 'getList', {params: {searchKey, page, pageSize}})
}

export const deleteUser = (id) => {
  return axios.post(base + 'delete', {id})
}

export const updateUser = (id, userForm) => {
  return axios.post(base + 'update', {id, userForm})
}

export const sendEmail = email => {
  return axios.post(base + 'sendEmail', {email})
}

export const checkEmailYzm = form => {
  return axios.post(base + 'checkEmailYzm', form)
}

export const setNewPwd = (email, passWord) => {
  return axios.post(base + 'setNewPwd', {email, passWord})
}

export const getUser = id => {
  return axios.get(base + 'getUser', {params: {id}})
}

export const getIsStoreAndRate = (uid, vid) => {
  return axios.get(base + 'video/isStoreAndRate', {params: {uid, vid}})
}

export const getStoreList = (id, page, pageSize) => {
  return axios.get(base + 'video/storeList', {params: {id, page, pageSize}})
}

export const deleteStoreVideo = (uid, vid) => {
  return axios.post(base + 'video/removeStore', {uid, vid})
}

export const getMyHotVideo = (id) => {
  return axios.get(base + 'video/myHotVideo', {params: {id}})
}

export const getUserAdmin = () => {
  return axios.get(base + 'userAdminList')
}

export const setAdmin = (user, flag) => {
  return axios.post(base + 'setAdmin', {user, flag})
}

export const isAdmin = () => {
  return axios.post(base + 'isAdmin')
}
