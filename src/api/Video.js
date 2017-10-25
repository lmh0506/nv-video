import axios from 'axios'

export const checkVideoExist = params => {
  return axios.post('/api/video/exist', params)
}

export const getAuditList = (search, page, pageSize) => {
  return axios.get('/api/video/videoList', {params: {search, page, pageSize}})
}

export const getVideoList = (search, page, pageSize) => {
  return axios.get('/api/video/videoList', {params: {search, page, pageSize, 'audit': true}})
}

export const submitShenhe = (id, shenhe) => {
  return axios.post('/api/video/shenhe', {id, shenhe})
}

export const getUserVideoList = (id, page, pageSize) => {
  return axios.get('/api/video/userVideoList', {params: {id, page, pageSize}})
}

export const deleteVideo = id => {
  return axios.post('/api/video/delete', {id})
}

export const getVideo = (id) => {
  return axios.get('/api/video/getVideo', {params: {id}})
}

export const playNumUp = id => {
  return axios.post('/api/video/playNumUp', {id})
}

export const storeVideo = (vid, uid) => {
  return axios.post('/api/video/storeVideo', {vid, uid})
}

export const submitRate = (vid, uid, rate) => {
  return axios.post('/api/video/submitRate', {vid, uid, rate})
}
