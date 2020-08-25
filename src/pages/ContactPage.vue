<template>
  <div id="contact">
    <p>
      If you would like to reach out to me, you are welcome to send me an e-mail
      directly:
      <a
        href="mailto:info@leonscherer.com"
      >info@leonscherer.com</a>
    </p>

    <form id="form" action="https://formspree.io/mknqadwl" method="POST">
      <textarea type="text" id="sender-input" placeholder="Your name or e-mail..." v-model="sender"></textarea>
      <textarea
        type="text"
        id="message-input"
        placeholder="Leave me a message..."
        v-model="message"
      ></textarea>
      <button id="send-button">{{getSendButtonCaption}}</button>
      <p v-if="tried">{{getFormStatus}}</p>
    </form>

    <!--
      <p>
        If you would like to reach out to me, you can either send me an e-mail
        directly (<a href="mailto:info@leonscherer.com">info@leonscherer.com</a
        >) or use the contact form below. Make sure to leave me a mail address
        in case you'd like a response.
      </p>

      <div id="form">
        <textarea
          type="text"
          id="sender-input"
          placeholder="Your name or e-mail..."
          v-model="sender"
        ></textarea>
        <textarea
          type="text"
          id="message-input"
          placeholder="Leave me a message..."
          v-model="message"
        ></textarea>

        <div style="text-align: right; width: 100%; margin: 0;">
          <button id="send-button" @click="submit">Send</button>
        </div>
      </div>
    -->
  </div>
</template>

<script>
// helper function for sending an AJAX request
function ajax(method, url, data, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;
    if (xhr.status === 200) {
      success(xhr.response, xhr.responseType);
    } else {
      error(xhr.status, xhr.response, xhr.responseType);
    }
  };
  xhr.send(data);
}

export default {
  data() {
    return {
      sender: "",
      message: "",

      tried: false,
      success: false,
      sending: false,

      form: null,
    };
  },

  mounted() {
    // get elements
    this.form = document.getElementById("form");
    var form = this.form;

    // handle the form submission event
    var self = this;

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      // set state
      self.sending = true;

      // construct data
      var data = new FormData();
      //data.append("_replyto", self.sender);
      data.append("sender", self.sender);
      data.append("message", self.message);

      // SEND IT
      ajax(
        form.method,
        form.action,
        data,
        /* onSuccess */ () => {
          // reset form
          self.form.reset();

          // set values
          self.success = true;
          self.tried = true;
          self.sending = false;
        },
        /* onError */ () => {
          // set values
          self.success = false;
          self.tried = true;
          self.sending = false;
        }
      );
    });
  },

  computed: {
    getFormStatus() {
      return this.success
        ? "Your message has been sent successfully!"
        : "Bad news: Something went wrong...";
    },

    getSendButtonCaption() {
      return this.sending ? "Sending..." : "Send";
    },
  },
};
</script>

<style lang="sass" scoped>
@import '../css/defs'

$contactPageWidth: 700px
$formWidth: 400px

#contact
  width: $contactPageWidth
  margin: 10px auto

  @media (max-width: $contactPageWidth)
    width: 90%

  a, a:visited
    color: $textColorDark
    font-weight: bold
    text-decoration: none

#send-button
  color: $textColorLight
  background-color: $uiColor
  font-size: 20px
  padding: 20px 35px

  border: 1px solid $accentColor
  border-radius: 3px

  box-sizing: border-box
  cursor: pointer
  transition: all .15s ease-in

#send-button:hover
  background-color: $accentColor
  border-color: $uiColor

#form
  width: $formWidth
  margin: auto

  @media (max-width: $formWidth)
    width: 85%

textarea, input
  width: 100%
  margin-bottom: 5px

  resize: none

  border: 1px solid grey
  border-radius: 1px

  font-family: inherit
  font-size: inherit

#message-input
  height: 200px
</style>
