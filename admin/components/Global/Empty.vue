<template>
  <div class="w-full flex justify-center items-center" style="min-height: 8rem">
    <div
      class="flex flex-col justify-center items-center"
      @click="$emit('click', $event)"
    >
      <icon :name="icon || 'empty'" class="text-5xl text-gray-500" />
      <span class="text-gray-500">{{ text }}</span>
    </div>
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
