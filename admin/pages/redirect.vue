<script>
import { ROUTES } from '~/config/constants/routes'
export default {
  auth: false,
  async asyncData({ $auth, redirect }) {
    if ($auth.loggedIn) {
      redirect(200, { name: ROUTES.DASHBOARD })
    } else {
      redirect({ name: ROUTES.LOGIN })
    }
  },
}
</script>

<style lang="scss" scoped></style>
