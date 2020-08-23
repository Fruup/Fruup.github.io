<template>
  <div id="nav-container">
    <div id="nav-buttons">
      <router-link to="/" class="nav-button">Music</router-link>
      <router-link to="/about" class="nav-button">About</router-link>
      <router-link to="/contact" class="nav-button">Contact</router-link>
    </div>

    <div id="social-buttons">
      <SocialButton url="https://twitter.com/leon_stuff" :iconPath="require('../assets/img/twitter.png')" />
      <SocialButton url="https://instagram.com/leonscherersan" :iconPath="require('../assets/img/instagram.png')" />
    </div>
  </div>
</template>

<script>
import SocialButton from "./SocialButton";

export default {
  components: {
    SocialButton,
  },
};
</script>

<style lang="sass" scoped>
@import "../css/defs.sass"

$maxNavWidth: 1000px

#nav-container
  width: $maxNavWidth

  @media (max-width: $maxNavWidth)
    width: 100%

  display: inline-flex
  height: 100%

  flex-wrap: wrap

  justify-content: space-between

#nav-buttons, #social-buttons
  display: inline-flex

.nav-button
  width: 90px
  height: 100%
  margin-right: 1px
  font-size: 13px
  text-transform: uppercase
  padding: 0
  text-align: center
  background-color: $uiColor

  display: flex
  flex-direction: column
  justify-content: space-around

  transition: all .2s linear

.nav-button:hover
  color: darken($textColorLight, 100%)

.nav-button.darkmode
  background-color: $uiColor_dark
</style>
