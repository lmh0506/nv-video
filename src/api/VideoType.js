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
