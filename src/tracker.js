/* Module for tracking user data */

const Tracker = {
  init(gtag) {
    // setup
    this.gtag = gtag
    this.listeningTime = 0; // time spent listening to audio
    this.startTime = 0; // time of starting a track
    this.sessionStart = performance.now();
  },

  // start recording listening time
  startListening() {
    this.startTime = performance.now();
  },

  // end recording listening time
  endListening() {
    this.listeningTime += performance.now() - this.startTime;
  },

  // track user starting to play an audio track
  startTrack(trackid) {
    // USAGE: event(action: String, { event_category: String, event_label: String, value: number })
    this.gtag.event("start_playing_track", { event_category: "audio", event_label: trackid });
  },

  // track if user has finished listening to an audio track
  trackFinishedPlaying(trackid) {
    this.gtag.event("finished_playing_track", { event_category: "audio", event_label: trackid });
  },

  // track how much time user has spent listening to audio
  endSession() {
    // measure listening percentage
    const listeningPercentage = (performance.now() - this.sessionStart) / this.listeningTime;

    this.gtag.event("total_time_listening", { event_category: "audio", value: this.listeningTime / 1000.0 /* listening time in seconds */ });
    this.gtag.event("listening_time_percentage", { event_category: "audio", value: listeningPercentage });

    // reset
    this.listeningTime = 0;
    this.sessionStart = 0;
  },

}

export default Tracker;
