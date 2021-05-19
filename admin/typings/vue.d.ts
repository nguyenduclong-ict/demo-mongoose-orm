import Vue from 'vue'
import { ENDPOINTS } from '~/config/constants/endpoints'
import { Services } from '~/config/services'
import { Apis } from '~/config/apis'
import { ApiService, BaseService } from '~/utils/service'

type ServicesType = typeof Services &
  { [K in keyof typeof ENDPOINTS]: BaseService }

type ApiServicesType = typeof Apis &
  { [K in keyof typeof ENDPOINTS]: ApiService }

declare module 'vue/types/vue' {
  interface Vue {
    $services: ServicesType
    $api: ApiServicesType
    $initTable: (config: TableProps) => TableProps
    $initSelectEntity: (config: SelectEntityProps) => SelectEntityProps
    getErrorMessage(error: any): string
    validateForm(form: any): Promise<boolean>
  }
}
