import { ENDPOINTS } from './constants/endpoints'
import { UploadService } from './services/upload.service'
import { BaseService } from '~/utils/service'
import { customMapValues } from '~/utils/lodash'

/** @type {import('~/typings').GenerateServices} */
const generateServices = customMapValues(
  ENDPOINTS,
  (endpoint) => new BaseService(endpoint)
)

const customServices = {
  Upload: new UploadService(),
}

export const Services = {
  ...generateServices,
  ...customServices,
}

export function getService(name, endpoint) {
  return Services[name] || new BaseService(endpoint)
}
