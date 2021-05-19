const PageMixin = {
  computed: {
    title() {
      return this.$route.meta?.title || this.$route.name
    },
  },
  created() {
    const page = {
      title: this.title,
    }
    this.$store.commit('SET_PAGE', page)
  },
}

export default PageMixin
