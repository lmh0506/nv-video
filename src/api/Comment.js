import axios from 'axios'
const base = '/api/comment/'

export const submitComment = (fromUser, content, vid) => {
  return axios.post(base + 'submit', {from_user: fromUser, content, vid})
}

export const submitReply = (fromUser, content, cid, toUser) => {
  return axios.post(base + 'reply', {from_user: fromUser, to_user: toUser, content, cid})
}

export const getCommentList = (vid, page, pageSize, replySize) => {
  return axios.get(base + 'list', {params: {vid, page, pageSize, replySize}})
}

export const getReplyList = (id, page, pageSize) => {
  return axios.get(base + 'replyList', {params: {id, page, pageSize}})
}
