import { ENDPOINTS } from '../constants/endpoints'
import { BaseService } from '~/utils/service'

export class UploadService extends BaseService {
  endpoint = ENDPOINTS.Upload

  /**
   * Find entity
   * @param {NuxtAxiosInstance} $axios
   * @param {file} payload
   * @returns {{} | any[]}
   */
  upload($axios, file, onProgress) {
    const formData = new FormData()
    formData.append('file', file)
    return $axios.$post(this.endpoint, formData, {
      onUploadProgress(progressEvent) {
        onProgress(Math.round(progressEvent.loaded / progressEvent.total) * 100)
      },
    })
  }
}
