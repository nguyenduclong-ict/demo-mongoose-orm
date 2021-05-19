import { ENDPOINTS } from './constants/endpoints'
import { customMapValues } from '~/utils/lodash'
import { ApiService } from '~/utils/service'

/** @type {import('~/typings').GenerateApiServices} */
const generateApis = customMapValues(
  ENDPOINTS,
  (endpoint) => new ApiService(endpoint)
)

const customApis = {}

export const Apis = {
  ...generateApis,
  ...customApis,
  getApi(endpoint) {
    return new ApiService(endpoint, this.$axios)
  },
}
