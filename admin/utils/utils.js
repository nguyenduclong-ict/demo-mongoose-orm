import { get, isEqual, pick } from './lodash'

/* Function khong lam gi ca */
export const useless = (v) => v

// Bearer Token
export const parseToken = (bearerToken) => bearerToken.replace(/^bearer /i, '')
export const buildToken = (token) => `Bearer ${token}`

// parse string 'false' => false, 'true' => true
export function parseBool(b) {
  return !/^(false|0)$/i.test(b) && !!b
}

/** Xóa phần tử trong mảng và trả về mảng các phần tử đã xóa
 * @param {(element, index:number) => boolean} func hàm xóa, phần tử sẽ bị xóa nếu return true
 * @returns {any[]} removed item
 */
export function removeItems(arr = [], func, keys) {
  if (typeof func !== 'function') {
    const origin = func
    func = (item) => {
      const a = keys ? pick(origin, keys) : origin
      const b = keys ? pick(item, keys) : item
      return isEqual(a, b)
    }
  }
  const removed = []
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index]
    if (func(element, index)) {
      removed.push(element)
      arr.splice(index, 1)
      index--
    }
  }
  return removed
}

/**
 * Thay đổi một phần tử trong mảng
 * @param {*} arr Mảng cần thay đổi phẩn tử
 * @param {*} replaceBy phần tử mới
 * @param {((element, index:number)=> boolean) | string | string[]} func Hàm tìm phần tử cần thay đổi,
 * hoặc mảng các thuộc tính để so sánh các phần tử
 */
export function replace(arr = [], replaceBy, func) {
  if (typeof func !== 'function') {
    const compareKeys = func
    func = (item) => {
      const a = compareKeys ? pick(replaceBy, compareKeys) : replaceBy
      const b = compareKeys ? pick(item, compareKeys) : item
      return isEqual(a, b)
    }
  }
  arr.splice(arr.findIndex(func), 1, replaceBy)
}

export function createUniqueId() {
  const timestamp = Date.now()
  const seed = Math.floor(Math.random() * timestamp)
  return timestamp + '-' + seed
}

export function pushIfNotExists(arr = [], map, item, valueKey) {
  const id = valueKey ? get(item, valueKey) : item
  if (!map[id]) {
    map[id] = item
    arr.push(item)
  }
  return arr
}

export function pushWithOrder(arr = [], item, orderField = 'order') {
  let addedIndex = -1
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index]
    if (element[orderField] > item[orderField]) {
      addedIndex = index
      arr.splice(index, 0, item)
      break
    }
  }
  if (addedIndex === -1) addedIndex = arr.push(item)
  return addedIndex
}

export function parseJSON(s) {
  try {
    return JSON.parse(s)
  } catch (error) {
    return null
  }
}

/**
 * @param {} response
 * @returns {{data: [], page : number, total: number, pageSize : number}}
 */
export function santizeResponse(response) {
  if (Array.isArray(response)) {
    return {
      data: response,
      page: 1,
      total: response.length,
    }
  }
  return response
}

export function findRecusive(arr = [], compare, chilrenKey = 'children') {
  let find
  for (const item of arr) {
    if (compare(item)) {
      find = item
      break
    }
    if (item[chilrenKey] && item[chilrenKey].length > 0) {
      find = findRecusive(item[chilrenKey], compare, chilrenKey)
      if (find) break
    }
  }

  return find
}

// Find recusive nhưng return mảng chứa phần tử đó
export function findParent(arr = [], compare, chilrenKey = 'children') {
  let find
  for (const item of arr) {
    if (compare(item)) {
      find = arr
      break
    }
    if (item[chilrenKey] && item[chilrenKey].length > 0) {
      find = findParent(item[chilrenKey], compare, chilrenKey)
      if (find) break
    }
  }

  return find
}

/**
 *
 * @param {*} source Nếu source là function thì chạy source lấy kết quả
 * @param  {...any} args
 */
export function getSourceValue(source, ...args) {
  if (typeof source === 'function') return source(...args)
  return source
}

export function getObjectId(value) {
  if (!value) return null
  if (typeof value === 'string') return value
  return value?.id || value?._id
}

export const getErrorMessage = (error) => {
  return get(error, 'response.data.message') || error.message
}
