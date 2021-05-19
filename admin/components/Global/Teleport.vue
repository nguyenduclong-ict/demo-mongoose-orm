<template>
  <div class="teleport">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    to: String,
  },
  data() {
    return {
      teleportTo: null,
    }
  },
  watch: {
    to() {
      this.teleport()
    },
  },
  mounted() {
    this.teleport()
  },
  beforeDestroy() {
    this.removeTeleport()
  },
  methods: {
    teleport() {
      this.removeTeleport()
      if (this.to) {
        this.teleportTo = document.querySelector(this.to)
        if (this.teleportTo) {
          try {
            this.$parent.$el.removeChild(this.$el)
          } catch (error) {}
          this.teleportTo.appendChild(this.$el)
        }
      }
    },
    removeTeleport() {
      if (this.teleportTo) {
        try {
          this.teleportTo.removeChild(this.$el)
        } catch (error) {}
      }
    },
  },
}
</script>
