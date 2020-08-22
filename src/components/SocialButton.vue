<template>
  <a :href="url" target="blank" class='social-button'>
    <div :style="computeStyle"></div>
  </a>
</template>

<script>
export default {
  props: {
    url: String,
    iconPath: String,
  },

  computed: {
    computeStyle() {
      return {
        "background-image": "url('" + this.iconPath + "')",
      }
    }
  }
};
</script>

<style lang="sass" scoped>

@import '../css/defs.sass'

.social-button
  border-radius: 100vmax

  background-color: $uiColor

  
  width: $navHeight
  height: 100%

  margin-left: 1px

a
  width: 100%
  height: 100%
  text-align: center

div
  width: 50%
  height: 50%
  object-fit: contain
  background-size: contain

  margin: auto
  margin-top: 50%
  transform: translateY(-50%)
</style>
