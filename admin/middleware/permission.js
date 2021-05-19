import { CheckPermission } from '~/utils/permission'

export default function ({ route, store, $auth, error }) {
  const checkPermission = new CheckPermission(
    store.state.permissions,
    $auth.user
  )

  for (const matched of route.matched) {
    if (
      !matched.meta.dontNeedPermission &&
      !checkPermission.hasPagePermission(matched.name)
    ) {
      return error({
        statusCode: 403,
        message: 'Bạn không có quyền truy cập trang này',
      })
    }
    const page = {
      title: matched.meta?.title,
    }
    store.commit('SET_PAGE', page)
  }
}
