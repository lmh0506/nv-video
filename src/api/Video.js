import axios from 'axios'

export const checkVideoExist = params => {
  return axios.post('/api/video/exist', params)
}

export const getAuditList = search => {
  return axios.get('/api/video/videoList', {params: {search}})
}

export const getVideoList = search => {
  return axios.get('/api/video/videoList', {params: {search, 'audit': true}})
}

export const submitShenhe = (id, shenhe) => {
  return axios.post('/api/video/shenhe', {id, shenhe})
}

export const getUserVideoList = id => {
  return axios.get('/api/video/userVideoList', {params: {id}})
}

export const deleteVideo = id => {
  return axios.post('/api/video/delete', {id})
}
