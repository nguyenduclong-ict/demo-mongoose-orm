<template>
  <div>
    <MediaLibrary :limit="100" />
  </div>
</template>

<script>
import MediaLibrary from '~/components/Global/MediaLibrary.vue'
export default {
  components: { MediaLibrary },
}
</script>

<style lang="scss" scoped></style>
