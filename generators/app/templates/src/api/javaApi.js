import HttpRequest from './JavaRequest'

const requestUser = new HttpRequest({
  baseURL: '/user',
})

const UserRegist = (params = {}) => {
  return new Promise((resolve, reject) => {
    requestUser
      .post('/register', params)
      .then((res) => {
        return resolve(res)
      })
      .catch((e) => {
        return reject(e)
      })
  })
}

export { UserRegist }
