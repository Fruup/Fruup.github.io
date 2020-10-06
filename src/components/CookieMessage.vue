<!-- Cookie prompt according to https://www.npmjs.com/package/vue-cookie-law -->

<template>
  <div class="prompt">
    <div class="content">
      <p>This page measures anonymous user interactions to improve user experience.</p>
      <button @click="_accept">Accept</button>
    </div>
  </div>
</template>

<script>
import "../cookie_key";
import CONSENT_COOKIE_KEY from '../cookie_key';

export default {
  props: {
    accept: Function,
  },

  created() {
    // check if consent was already granted
    var v = this.$cookies.get(CONSENT_COOKIE_KEY);

    if (v) {
      // accept
      this.accept();
    }
  },

  methods: {
    _accept() {
      // store cookie
      this.$cookies.set(CONSENT_COOKIE_KEY, true);

      // callback
      this.accept();
    }
  }
};
</script>

<style lang="sass" scoped>
@import "../css/defs"

.prompt
  height: 100%
  text-align: center

  margin: auto

  display: flex
  flex-direction: column
  justify-content: space-around

  @media (max-width: $breakpointPhone)
    margin: auto 5px

.content
  display: inline-flex

button
  width: 100px
  height: 50px

  margin: auto
  margin-left: 10px

  //padding: 10px 20px
  font-size: 20px

  background-color: transparent
  color: $textColorLight
  border: 1px solid $accentColor
  border-radius: 1000px
  cursor: pointer

  transition: all .2s

button:hover
  background-color: $accentColor

</style>
