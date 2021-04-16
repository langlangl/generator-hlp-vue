import Vue from 'vue'

const getCommonSessionStorage = () => {
  const { device, app,bfs } = sessionStorage
  let uuid
  let bundle
  let origin
  if (device) {
    uuid = JSON.parse(device).uuid
  }
  if (app) {
    bundle = JSON.parse(app).bundle
    origin = JSON.parse(app).origin
  }
  return {
    commonSessionParams: { uuid, bundle },
    origin,
    bfs:JSON.parse(bfs)
    
  }
}

const getRemainTaskInfo = (params = {}) => {
  const remainTid = localStorage.getItem('remainTid') || ''
  const { commonSessionParams, origin } = getCommonSessionStorage()
  const commonParams = { ...commonSessionParams, tid: remainTid }
  return new Promise((resolve, reject) => {
    const postData = { ...commonParams, ...params }
    Vue.axios
      .post(origin + '/api/v1/app/task/fetch', postData)
      .then((response) => {
        const {
          data: { data, code },
        } = response
        const { tid } = data
        if (tid) {
          localStorage.setItem('remainTid', tid)
        }
        resolve({ ...data, code })
      })
      .catch((e) => {
        return reject(e)
      })
  })
}




export { getRemainTaskInfo}
