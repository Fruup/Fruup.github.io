<template>
  <div id="container">
      There's more...<br>
      ⬇️
  </div>
</template>

<script>
export default {

}
</script>

<style lang="sass" scoped>
@import "../css/defs"

$indicatorMargin: 3px

container
    width: 100px
    height: 100px

    text-align: center

    display: flex
    flex-direction: column
    justify-content: space-around

    background-color: $uiColorHighlight

    border-radius: 4px

    position: fixed
    bottom: calc($footerHeight - $indicatorMargin)
</style>
