<template>
  <div
    class="w-full flex justify-center items-center flex-col"
    style="min-height: 8rem"
  >
    <icon name="empty" class="text-5xl text-gray-500" />
    <span class="text-gray-500">{{ text }}</span>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: 'empty',
    },
    text: {
      type: String,
      default: 'Không có dữ liệu',
    },
  },
}
</script>

<style lang="sass" scoped></style>
