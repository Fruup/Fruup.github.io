<template>
  <div id="app">
    <div id="nav-and-main">
      <!-- Navigation header -->
      <nav id="nav">
        <NavigationBar />
      </nav>

      <!-- Main content -->
      <main id="main">
        <vue-page-transition name="fade-in-up">
          <router-view class="main"></router-view>
        </vue-page-transition>
      </main>
    </div>

    <!-- Footer with audio player area -->
    <footer id="footer">
      <transition name="fade" mode="out-in">
        <AudioPlayer v-if="cookiesAccepted" />
        <CookieMessage :accept="acceptCookies" v-else />
      </transition>
    </footer>
  </div>
</template>

<script>
import Vue from "vue";
import NavigationBar from "./components/NavigationBar";
import AudioPlayer from "./components/AudioPlayer";
import CookieMessage from "./components/CookieMessage";
import CONSENT_COOKIE_KEY from "./cookie_key";
import Tracker from "./tracker";

// use vue page transition plugin
import VuePageTransition from "vue-page-transition";
Vue.use(VuePageTransition);

// use vue cookies
import VueCookies from "vue-cookies";
Vue.use(VueCookies);
Vue.$cookies.config(/* expire times */ "365d");

export default {
  components: {
    NavigationBar,
    AudioPlayer,
    CookieMessage,
    //MoreIndicatorComp
  },

  data() {
    return {
      showMoreIndicator: true,
      cookiesAccepted: Vue.$cookies.get(CONSENT_COOKIE_KEY),
      //cookiesAccepted: false,
    };
  },

  created() {
    // setup tracker
    Tracker.init(this.$gtag);

    // end session when window closes
    window.addEventListener(
      "beforeunload",
      function () {
        Tracker.endSession();
      },
      false
    );

    // enable GA if user consented (check this.cookiesAccepted)
    if (this.cookiesAccepted) {
      this.$gtag.optIn();
    }
  },

  methods: {
    acceptCookies() {
      // user consented to send usage data
      this.cookiesAccepted = true;
    },
  },
};
</script>

<style lang="sass">
@import './css/defs.sass'

body
  transition: background-color 1s linear
  background-color: $backgroundColor

body.darkmode
  background-color: $backgroundColor_dark

#app
  -webkit-overflow-scrolling: touch

  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale

  text-align: center

  color: $textColorDark

  width: 100vw
  height: 100vh

  display: flex
  flex-direction: column

  font-family: "Helvetica Light"
  font-size: 20px
  
  .darkmode
    color: $textColorLight

#nav-and-main
  text-align: center

  width: 100%
  height: 100%
  
  margin-bottom: $footerHeight

  display: flex
  flex-direction: column

  overflow: scroll
  
  // Hide scrollbar for IE, Edge and Firefox
  -ms-overflow-style: none  // IE and Edge
  scrollbar-width: none  // Firefox

  // Hide scrollbar for Chrome, Safari and Opera
#nav-and-main::-webkit-scrollbar
  display: none

#nav
  font-family: 'Moonglade'

  //flex: 0 0 auto

  height: $navHeight

  border: 0 solid black
  border-bottom-width: 1px

  color: $textColorLight

  margin-top: 20px
  @media (max-width: $breakpointPhone)
    margin-top: 0

  .darkmode
    color: $textColorDark

  a, a:visited
    color: $textColorLight
    text-decoration: none
    
  .router-link-exact-active
    transition: all .1s linear

    //opacity: .5
    background-color: $uiColorHighlight

#main
  width: $maxMainWidth

  margin: auto
  margin-top: 20px
  margin-bottom: 1px

  @media (max-width: $maxMainWidth)
    width: 100%

    flex-basis: 100%

    text-align: center

    margin: auto
    margin-top: 20px
    margin-bottom: 1px

  @media (max-width: $breakpointPhone)
    margin-top: 1px

#footer
  position: fixed
  bottom: 0
  width: 100%

  color: $textColorLight

  //flex: 0 0 auto

  height: $footerHeight

  border: solid
  border-width: 0
  border-top-width: 1px
  border-color: black

  margin-top: auto

  text-align: center
  display: flex
  flex-direction: column
  justify-content: space-around

  background-color: $uiColor

  .darkmode
    color: $textColorDark

// transitions
.fade-enter-active, .fade-leave-active
  transition: opacity .3s
.fade-enter, .fade-leave-to
  opacity: 0
</style>
