import axios from 'axios'

export const submitComment = (fromUser, content, vid) => {
  return axios.post('/api/comment/submit', {from_user: fromUser, content, vid})
}

export const submitReply = (fromUser, content, cid, toUser) => {
  return axios.post('/api/comment/reply', {from_user: fromUser, to_user: toUser, content, cid})
}

export const getCommentList = (vid, page, pageSize, replySize) => {
  return axios.get('/api/comment/list', {params: {vid, page, pageSize, replySize}})
}

export const getReplyList = (id, page, pageSize) => {
  return axios.get('/api/comment/replyList', {params: {id, page, pageSize}})
}
