export class BaseService {
  endpoint

  constructor(endpoint) {
    this.endpoint = endpoint ?? this.endpoint
  }

  /**
   * @param {NuxtAxiosInstance} $axios
   * @param {ListPayload} payload
   * @returns {ListResponse}
   */
  list($axios, payload) {
    return $axios.$get(this.endpoint, { params: stringifyQuery(payload) })
  }

  /**
   * @param {NuxtAxiosInstance} $axios
   * @param {ListPayload} payload
   * @returns {[]}
   */
  find($axios, payload) {
    return $axios.$get(this.endpoint + '/find', {
      params: stringifyQuery(payload),
    })
  }

  /**
   * @param {NuxtAxiosInstance} $axios
   * @param {FindOnePayload} payload
   * @returns {any}
   */
  findOne($axios, payload) {
    return $axios.$get(this.endpoint + '/find-one', {
      params: stringifyQuery(payload),
    })
  }

  /**
   * Find entity
   * @param {NuxtAxiosInstance} $axios
   * @param {CreatePayload} payload
   * @returns {{} | any[]}
   */
  create($axios, payload) {
    return $axios.$post(this.endpoint, payload)
  }

  /**
   * Find entity
   * @param {NuxtAxiosInstance} $axios
   * @param {UpdatePayload} payload
   * @returns {{} | any[]}
   */
  update($axios, payload) {
    return $axios.$put(this.endpoint, payload)
  }

  /**
   * Find entity
   * @param {NuxtAxiosInstance} $axios
   * @param {UpdatePayload} payload
   * @returns {{} | any[]}
   */
  updateOne($axios, payload) {
    const { id, _id, ...data } = payload.data
    payload.data = data
    return $axios.$put(this.endpoint + '/' + (id || _id), payload)
  }

  /**
   * Find entity
   * @param {NuxtAxiosInstance} $axios
   * @param {DeletePayload} payload
   */
  delete($axios, payload) {
    return $axios.$delete(this.endpoint, {
      data: payload,
    })
  }

  /**
   * Find entity
   * @param {NuxtAxiosInstance} $axios
   * @param {SoftDeletePayload} payload
   */
  softDelete($axios, payload) {
    return $axios.$delete(this.endpoint + '/soft', payload)
  }

  /**
   * Find entity
   * @param {NuxtAxiosInstance} $axios
   */
  getSchema($axios) {
    return $axios.$get(this.endpoint + '/schema')
  }
}

function stringifyQuery(query = {}, parseAllProperty = true) {
  if (parseAllProperty) {
    Object.keys(query).forEach((key) => {
      if (query[key] && typeof query[key] === 'object')
        query[key] = JSON.stringify(query[key])
    })
  }

  if (query.id) {
    query._id = query.id
    delete query.id
  }

  return query
}

export class ApiService {
  endpoint
  $axios

  constructor(endpoint, axios) {
    this.endpoint = endpoint ?? this.endpoint
    this.$axios = axios
  }

  /**
   * @param {NuxtAxiosInstance} $axios
   * @param {ListPayload} payload
   * @returns {ListResponse}
   */
  list(payload) {
    return this.$axios.$get(this.endpoint, { params: stringifyQuery(payload) })
  }

  /**
   * @param {NuxtAxiosInstance} $axios
   * @param {ListPayload} payload
   * @returns {[]}
   */
  find(payload) {
    return this.$axios.$get(this.endpoint + '/find', {
      params: stringifyQuery(payload),
    })
  }

  /**
   * @param {NuxtAxiosInstance} $axios
   * @param {FindOnePayload} payload
   * @returns {any}
   */
  findOne(payload) {
    return this.$axios.$get(this.endpoint + '/find-one', {
      params: stringifyQuery(payload),
    })
  }

  /**
   * Find entity
   * @param {NuxtAxiosInstance} $axios
   * @param {CreatePayload} payload
   * @returns {{} | any[]}
   */
  create(payload) {
    return this.$axios.$post(this.endpoint, payload)
  }

  /**
   * Find entity
   * @param {NuxtAxiosInstance} $axios
   * @param {UpdatePayload} payload
   * @returns {{} | any[]}
   */
  update(payload) {
    return this.$axios.$put(this.endpoint, payload)
  }

  /**
   * Find entity
   * @param {NuxtAxiosInstance} $axios
   * @param {UpdatePayload} payload
   * @returns {{} | any[]}
   */
  updateOne(payload) {
    const { id, _id, ...data } = payload.data
    payload.data = data
    return this.$axios.$put(this.endpoint + '/' + (id || _id), payload)
  }

  /**
   * Find entity
   * @param {NuxtAxiosInstance} $axios
   * @param {DeletePayload} payload
   */
  delete(payload) {
    return this.$axios.$delete(this.endpoint, {
      data: payload,
    })
  }

  /**
   * Find entity
   * @param {NuxtAxiosInstance} $axios
   * @param {SoftDeletePayload} payload
   */
  softDelete(payload) {
    return this.$axios.$delete(this.endpoint + '/soft', payload)
  }

  /**
   * Find entity
   * @param {NuxtAxiosInstance} $axios
   */
  getSchema() {
    return this.$axios.$get(this.endpoint + '/schema')
  }
}
