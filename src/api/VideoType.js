import axios from 'axios'

export const addType = name => {
  return axios.post('/api/video/type/add', {name})
}

export const checkTypeName = name => {
  return axios.post('/api/video/type/exist', {name})
}

export const getTypeList = searchKey => {
  return axios.get('/api/video/type/getList', {params: {searchKey}})
}

export const deleteType = id => {
  return axios.post('/api/video/type/delete', {id})
}

export const updateType = (id, name) => {
  return axios.post('/api/video/type/update', {id, name})
}

export const getHotTypeList = () => {
  return axios.get('/api/video/type/hotList')
}

export const getDetailList = (id, sort, page, pageSize) => {
  return axios.get('/api/video/type/detail', {params: {id, sort, page, pageSize}})
}
