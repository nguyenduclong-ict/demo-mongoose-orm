import { NuxtAxiosInstance as NAI } from '@nuxtjs/axios'
import { FilterQuery, UpdateQuery } from 'mongoose'

declare global {
  interface NuxtAxiosInstance extends NAI {}

  export interface ListPayload {
    query?: FilterQuery
    populates?:
      | string
      | {
          path: string
          select?: string
          model?: string
          populate?: ListPayload['populates']
        }[]
    page?: number
    pageSize?: number
    sort?: string[]
    projection?: any
    select?: any
    /**
     * ignore: return document no softDelete,
     * only: only return document softDeleted,
     * all: return both
     */
    softDelete?: 'ignore' | 'only' | 'all'
  }

  interface ListResponse {
    data: []
    page: number
    pageSize: number
    total: number
    totalPages: numbre
  }

  interface CreatePayload extends ListPayload {
    data: any[] | { [x: string]: any }
  }

  interface UpdatePayload extends ListPayload {
    data: UpdateQuery
    new?: boolean
  }

  type FindOnePayload = Omit<ListPayload, 'page' | 'pageSize' | 'sort'>

  interface DeletePayload extends ListPayload {}

  interface SoftDeletePayload extends ListPayload {}
}

export { ListPayload }
