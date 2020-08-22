<template>
  <div
    class="track-comp"
    @click="onClick"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div :class="computeClass" :style="computeStyle"></div>
  </div>
</template>

<script>
import { db } from "../db.js";

export default {
  data() {
    return {
      hovered: false,
    };
  },

  props: {
    trackid: String,
  },

  methods: {
    onClick() {
      //console.log("Clicked " + this.trackid)
      //document.body.classList.add('darkmode')

      db.setCurrentTrackId(this.trackid);
    },

    onMouseEnter() {
      this.hovered = true;
    },

    onMouseLeave() {
      this.hovered = false;
    },
  },

  computed: {
    computeClass() {
      return {
        'track-cover': true,
        'hovered': this.hovered
      }
    },

    computeStyle() {
      return {
        backgroundImage: "url('" + db.tracks[this.trackid].coverURL + "')",
      }
    }
  },
};
</script>

<style lang="sass" scoped>
@import '../css/defs'

$minBorderSize: 1px
$maxBorderSize: 10px
//$maxBorderSize: 1vmin

.track-comp
  background-color: $backgroundColor

  // center content
  text-align: center

  display: flex
  flex-direction: column
  justify-content: space-around

  cursor: pointer

  margin: 2px

  border-style: solid
  border-color: $uiColor

  .darkmode
    border-color: $uiColor_dark

  border-width: $minBorderSize

  box-sizing: border-box

  // animate border width
  transition: all .2s

.track-comp:hover
  border-width: $maxBorderSize

.track-cover
  width: 100%
  height: 100%

  //background-image: url('../assets/covers/default.jpg')
  background-position: center
  background-size: cover

  transition: all .2s

  opacity: 1
  filter: blur(0px)

.track-cover.hovered
    opacity: .8
    filter: blur(4px)
</style>
