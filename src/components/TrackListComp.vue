<template>
  <div class="tracklist">
    <TrackComp
      v-for="track in getTrackList"
      :key="track.key"
      :trackid="track.id"
    />
  </div>
</template>

<script>
import TrackComp from "./TrackComp.vue";
import { db } from "../db.js";

export default {
  data() {
    return {
      tracks: db.tracks,
    };
  },

  components: {
    TrackComp,
  },

  computed: {
    getTrackList() {
      // make key value pair for v-for list
      var r = [];
      var i = 0;

      db.trackids.forEach((trackid) => {
        r.push({ key: i, id: trackid });
        i++;
      });

      return r;
    },
  },
};
</script>

<style lang="sass" scoped>
@import '../css/defs'

.tracklist
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr))
    grid-auto-rows: 1fr

    @media (max-width: $breakpointPhone)
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))

.tracklist::before
    content: ''
    width: 0
    padding-bottom: 100%
    grid-row: 1 / 1
    grid-column: 1 / 1

.tracklist > *:first-child
  grid-row: 1 / 1
  grid-column: 1 / 1
</style>
