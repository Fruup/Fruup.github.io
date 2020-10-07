<template>
  <div id="player-container">
    <span
      class="button play-button"
      @click="togglePlayback"
      v-if="!playing"
    ></span>
    <span class="button pause-button" @click="togglePlayback" v-else></span>

    <div id="meta-and-timeline">
      <span id="meta">
        <div id="meta-title-time">
          <span id="meta-title">{{ title }}</span>
          <span id="meta-hyphen" style="margin-right: 6px" v-if="!hasCoverArtist">-</span>
          <span id="meta-time">{{ getTimeString }}</span>
        </div>
        <div id="meta-artist" v-if="hasCoverArtist">
          <span>Cover art by &nbsp;</span>
          <a
            id="meta-artist-url"
            :href="getCoverArtistURL"
            target="_blank"
            rel="noopener noreferrer"
            ><span>{{ getCoverArtist }}</span></a
          >
        </div>
      </span>

      <div id="timeline" @mousedown="onSeekStart">
        <div id="progress-overlay" :style="getOverlayStyle"></div>
        <img :src="getWaveformPath" class="waveform-image" />
        <div id="timeline-border"></div>
      </div>
    </div>

    <div id="volume-area" @mousedown="onVolumeSelectStart">
      <div id="volume-overlay" :style="getVolumeOverlayStyle"></div>
    </div>
  </div>
</template>

<script>
import { Howl, Howler } from "howler";
import { db } from "../db";
import Tracker from "../tracker";

// component
export default {
  data() {
    return {
      howl: null, // howl instance

      playing: false,
      seekPollHandle: null,

      // meta
      title: null,
      progressedTime: 0,
      duration: 0,

      timelineElement: null,
      volumeElement: null,

      seeking: false,

      volume: 0.5,
      selectingVolume: false,
    };
  },

  watch: {
    playing(playing) {
      if (playing) {
        var self = this;

        // start seek polling
        this.seekPollHandle = setInterval(function () {
          // update time
          if (!self.seeking) self.progressedTime = self.seek();
        }, 20);
      } else {
        // stop seek polling
        clearInterval(this.seekPollHandle);
        this.seekPollHandle = null;
      }
    },

    trackid(trackid) {
      // stop playing
      this.stop();

      // reset player
      this.reset(trackid);

      // start playing
      this.play();
    },
  },

  mounted() {
    var self = this;

    // set initial volume
    Howler.volume(this.volume);

    // store timeline element
    this.timelineElement = document.getElementById("timeline");
    this.volumeElement = document.getElementById("volume-area");

    // block scrolling through spacebar press, and pause/resume
    window.onkeydown = function (e) {
      if (e.which == 32 && !e.repeat && e.target == document.body) {
        // pause/resume track
        self.togglePlayback();

        // prevent scrolling
        e.preventDefault();
      }
    };

    // register event to stop seeking
    document.addEventListener("mouseup", () => {
      if (self.selectingVolume) {
        // remove listener
        document.removeEventListener("mousemove", self.onVolumeSelect);

        self.selectingVolume = false;
      }

      if (self.seeking) {
        // remove listener
        document.removeEventListener("mousemove", self.onMouseSeek);

        // skip to this position in track
        self.seek(self.progressedTime);

        // stop seeking
        self.seeking = false;
      }
    });

    // reset player
    this.reset(this.trackid);
  },

  methods: {
    reset(trackid) {
      var self = this;

      // create howl instance
      this.howl = new Howl({
        src: ["/mp3/" + trackid + ".mp3"],
        preload: true,
        html5: true,
        onload() {
          // set meta data
          self.title = db.tracks[self.trackid].title;
          self.progressedTime = 0;
          self.duration = this.duration();
        },
        onplay() {
          self.playing = true;

          // send tracking event
          Tracker.startTrack(self.currentTrackId);
          Tracker.startListening();
        },
        onpause() {
          self.playing = false;

          // send tracking event
          Tracker.endListening();
        },
        onstop() {
          self.playing = false;

          // send tracking event
          Tracker.endListening();
        },
        onend() {
          self.playing = false;

          // send tracking event
          Tracker.trackFinishedPlaying(self.currentTrackId);
          Tracker.endListening();
        },
      });
    },

    onVolumeSelectStart(e) {
      // set volume
      this.onVolumeSelect(e);

      // set state
      this.selectingVolume = true;

      // register event
      document.addEventListener("mousemove", this.onVolumeSelect);
    },

    onVolumeSelect(e) {
      let prog =
        (e.clientX - this.volumeElement.offsetLeft) /
        this.volumeElement.clientWidth;

      this.volume = prog < 0 ? 0 : prog > 1 ? 1 : prog;
      Howler.volume(this.volume);
    },

    onMouseSeek() {
      let prog =
        (event.clientX - this.timelineElement.offsetLeft) /
        this.timelineElement.clientWidth;

      this.progressedTime =
        (prog < 0 ? 0 : prog > 1 ? 1 : prog) * this.duration;
    },

    onSeekStart(e) {
      // seek
      this.onMouseSeek(e);

      // mark as seeking
      this.seeking = true;

      // register event
      document.addEventListener("mousemove", this.onMouseSeek);
    },

    togglePlayback() {
      this.playing ? this.pause() : this.play();
    },

    play() {
      this.howl.play();
    },

    pause() {
      this.howl.pause();
    },

    stop() {
      this.howl.stop();
    },

    seek(to) {
      // optional parameter
      if (to != undefined) this.progressedTime = to;
      return this.howl.seek(to);
    },
  },

  computed: {
    trackid() {
      return db.currentTrackId;
    },

    getTimeString() {
      let m1 = "" + Math.floor(this.progressedTime / 60.0);
      let ss1 = "" + Math.floor(this.progressedTime % 60.0);
      let m2 = "" + Math.floor(this.duration / 60.0);
      let ss2 = "" + Math.floor(this.duration % 60.0);

      return (
        m1 +
        ":" +
        (ss1.length == 1 ? "0" + ss1 : ss1) +
        " / " +
        m2 +
        ":" +
        (ss2.length == 1 ? "0" + ss2 : ss2)
      );
    },

    getWaveformPath() {
      return require("../assets/img/waveforms/" + this.trackid + ".png");
    },

    getOverlayStyle() {
      return {
        width: (100 * this.progressedTime) / this.duration + "%",
      };
    },

    getVolumeOverlayStyle() {
      return {
        width: 100 * this.volume + "%",
      };
    },

    getCoverArtist() {
      if (db.currentTrackId != null) {
        return db.tracks[db.currentTrackId].cover_artist;
      } else {
        return "/";
      }
    },

    getCoverArtistURL() {
      if (db.currentTrackId != null) {
        return db.tracks[db.currentTrackId].cover_artist_url;
      } else {
        return "";
      }
    },

    hasCoverArtist() {
      return db.currentTrackId != null && db.tracks[db.currentTrackId].cover_artist != undefined && db.tracks[db.currentTrackId].cover_approved;
    }
  },
};
</script>

<style lang="sass" scoped>
@import '../css/defs'

#meta-and-timeline
  flex: auto // take the remaining space
  height: 50px

  display: flex
  flex-direction: row
  justify-content: space-evenly

  @media (max-width: $breakpointPhone)
    flex-direction: column

#meta
  font-family: "Helvetica Light"
  font-weight: bold
  font-size: 17px
  text-align: center

  white-space: nowrap

  flex: 0 0 auto
  margin: auto 15px

  @media (max-width: $breakpointPhone)
    flex: auto
    font-size: 15px
    margin-bottom: 5px

#meta-title
  display: block
  @media (max-width: $breakpointPhone)
    display: inline-block
#meta-title
  display: block
  @media (max-width: $breakpointPhone)
    display: inline-block

#meta-title-time
  display: inline-flex
  flex: space-between

#meta-title
  margin-right: 6px
  
#meta-artist
  font-weight: normal
  font-size: 15px
  margin-top: 3px

#meta-artist-url, #meta-artist-url:active
  color: $accentColor

#player-container
  font-family: "Moonglade"

  padding: 20px 20px
  margin: auto

  display: inline-flex
  justify-content: space-between

  border-radius: 100vmin

  box-sizing: border-box

  border: 1px solid white

  // box-shadow: none|h-offset v-offset blur spread color |inset|initial|inherit;
  box-shadow: 5px 5px 5px 0 black

  width: $maxMainWidth
  @media (max-width: $maxMainWidth)
    width: 100%

.button
  flex: 0 0 50px
  height: 50px

  margin: auto

  border-radius: 100vmin

  border: 1px solid black

  // box-shadow: none|h-offset v-offset blur spread color |inset|initial|inherit;
  box-shadow: 2px 2px 10px 0 black

  background-color: white
  background-position: center
  background-repeat: no-repeat

  transition: all .1s linear

  cursor: pointer

.button:hover
  transform: scale(1.2)
  border-color: $accentColor
  border-width: 1px

.play-button
  background-image: url("../assets/img/play.png")
.pause-button
  background-image: url("../assets/img/pause.png")

#timeline
  flex: auto // take remaining space
  height: 100%

  // position this element so that progress-overlay can size properly
  position: relative

  border: 1px solid grey
  border-radius: 4px

.waveform-image
  width: 100%
  height: 100%
  object-fit: fill
  filter: drop-shadow(0 0 100px rgba(1,1,1,.75)) pixelate(2px)
  image-rendering: pixelated

#progress-overlay
  position: absolute

  height: 100%

  background-color: rgba(0,0,0,.5)

  border-right: 2px solid $accentColor
  border-top-left-radius: 4px
  border-bottom-left-radius: 4px

  box-sizing: border-box
  padding-right: 1px

#volume-area
  margin: auto 15px
  height: 15px
  flex: 0 0 100px

  background-color: grey

  border: 1px solid black
  cursor: pointer

  position: relative
  border-radius: 3px

  @media (max-width: $breakpointPhone)
    display: none

#volume-overlay
  position: absolute

  width: 50%
  height: 100%

  background-color: white
  border-radius: 3px

</style>
