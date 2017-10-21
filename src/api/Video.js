import axios from 'axios'

export const checkVideoExist = params => {
  return axios.post('/api/video/exist', params)
}

export const getAuditList = search => {
  return axios.get('/api/video/videoAuditList', {params: {search}})
}

export const submitShenhe = (id, shenhe) => {
  return axios.post('/api/video/shenhe', {id, shenhe})
}
