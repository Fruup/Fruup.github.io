<template>
    <div id="contact">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      sender: "",
      message: "",
    };
  },

  methods: {
    submit() {
      // create http request
      /*jqueryAjax.fn({
        dataType: "jsonp",
        url:
          "http://getsimpleform.com/messages/ajax?form_api_token=d18c3eaa8feb3d66fa89c5f6a263bc55",
        data: {
          email: this.sender,
          message: this.message,
        },
      }).done(function() {
        //callback which can be used to show a thank you message
        //and reset the form
        console.log("Thank you, for contacting us");
      });*/

      let formData = new FormData();
      formData.append("email", this.email);
      formData.append("message", this.message);

      let req = new XMLHttpRequest();
      req.open(
        "POST",
        "https://getsimpleform.com/messages/ajax?form_api_token=d18c3eaa8feb3d66fa89c5f6a263bc55",
        true
      );

      //req.setRequestHeader("Origin", "https://leonscherer.com");
      //req.setRequestHeader('Content-Type', 'application/json');
      //req.withCredentials = true;
      req.responseType = "json";

      req.onload = function() {
        console.log("Loaded: ${xhr.status} ${xhr.response}");
      };

      req.onerror = function() {
        // only triggers if the request couldn't be made at all
        alert("Network Error");
      };

      req.send(formData);

      console.log(this.message + " from " + this.sender);
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

textarea
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
