import axios from 'axios'
const base = '/api/video/'

export const checkVideoExist = params => {
  return axios.post(base + 'exist', params)
}

export const getAuditList = (search, page, pageSize) => {
  return axios.get(base + 'videoList', {params: {search, page, pageSize}})
}

export const getVideoList = (search, page, pageSize) => {
  return axios.get(base + 'videoList', {params: {search, page, pageSize, 'audit': true}})
}

export const submitShenhe = (id, shenhe) => {
  return axios.post(base + 'shenhe', {id, shenhe})
}

export const getUserVideoList = (id, page, pageSize) => {
  return axios.get(base + 'userVideoList', {params: {id, page, pageSize}})
}

export const deleteVideo = id => {
  return axios.post(base + 'delete', {id})
}

export const getVideo = (id) => {
  return axios.get(base + 'getVideo', {params: {id}})
}

export const playNumUp = id => {
  return axios.post(base + 'playNumUp', {id})
}

export const storeVideo = (vid, uid) => {
  return axios.post(base + 'storeVideo', {vid, uid})
}

export const submitRate = (vid, uid, rate) => {
  return axios.post(base + 'submitRate', {vid, uid, rate})
}

export const getHotList = () => {
  return axios.get(base + 'hotList')
}

export const getRankList = () => {
  return axios.get(base + 'rankList')
}

export const getMonthList = () => {
  return axios.get(base + 'monthList')
}
