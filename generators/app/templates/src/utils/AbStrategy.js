import { getHashCode } from '@/utils/common'

/**
 * @description: ab策略分流（前端执行）
 * @param {}
 * @return:A | B
 */
const abStrategy = (uuid = '', did = '') => {
  if (!uuid && !did) {
    console.log('uuid-did均存在问题')
    return 'A'
  }
  const codeString = uuid || did
  return getHashCode(codeString)
}

export default abStrategy
