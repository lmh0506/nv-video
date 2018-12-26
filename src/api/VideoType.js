import axios from 'axios'
const base = '/api/video/type/'

export const addType = name => {
  return axios.post(base + 'add', {name})
}

export const checkTypeName = name => {
  return axios.post(base + 'exist', {name})
}

export const getTypeList = searchKey => {
  return axios.get(base + 'getList', {params: {searchKey}})
}

export const deleteType = id => {
  return axios.post(base + 'delete', {id})
}

export const updateType = (id, name) => {
  return axios.post(base + 'update', {id, name})
}

export const getHotTypeList = () => {
  return axios.get(base + 'hotList')
}

export const getDetailList = (id, sort, page, pageSize) => {
  return axios.get(base + 'detail', {params: {id, sort, page, pageSize}})
}
