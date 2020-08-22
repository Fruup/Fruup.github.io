import Vue from "vue";

var db = Vue.observable({
  currentTrackId: null,
  trackids: [],
  tracks: {
    chillig: {
      title: "Chillig",
      date: new Date(1900, 1, 1),
      tags: ["Lo-Fi"],

      coverURL: "/covers/chillig.gif",

      cover_artist: "Martith",
      cover_artist_url: "https://www.instagram.com/martith.art/",

      cover_approved: true,
    },

    desert: {
      title: "A Desert Theme",
      date: new Date(1900, 1, 1),
      tags: ["Orchestral"],

      cover_artist: "Charles Morgenstern",
      cover_artist_url: "https://www.tetramodal.com",

      cover_approved: true,
    },

    fire: {
      title: "Fire",
      date: new Date(1900, 1, 1),
      tags: ["Synth", "Piano"],

      cover_artist: "Nico Ismaili",
      cover_artist_url: "https://nico.ismaili.de",

      cover_approved: true,
    },

    hide: {
      title: "Hide",
      date: new Date(1900, 1, 1),
      tags: ["Piano", "Orchestral"],

      cover_approved: false,
    },

    p01: {
      title: "P01",
      date: new Date(1900, 1, 1),
      tags: ["Piano", "Orchestral"],

      cover_artist: "Vaghauk",
      cover_artist_url: "https://www.deviantart.com/vaghauk",

      cover_approved: false,
    },

    p02: {
      title: "P02",
      date: new Date(1900, 1, 1),
      tags: ["EDM", "Synth"],

      cover_artist: "Nathan",
      cover_artist_url: "https://www.deviantart.com/sunshineproxy",

      cover_approved: true,
    },

    trailer: {
      title: "Trailer Music",
      date: new Date(1900, 1, 1),
      tags: ["Orchestral"],

      cover_approved: true,
    },

    voyage: {
      title: "Petit Voyage",
      date: new Date(1900, 1, 1),
      tags: ["Piano"],

      cover_artist: "Thomas Arnaud",
      cover_artist_url: "https://www.instagram.com/thomasarnaudart/",

      cover_approved: true,
    },

    kakariko: {
      title: "Kakariko Village",
      date: new Date(2020, 8, 5), // y m d
      tags: ["Piano", "Strings"],

      cover_artist: "Jessica Smith",
      cover_artist_url: "https://artofjess.com",

      cover_approved: true,
    },
  },

  loadTracks() {
    // extract trackids
    this.trackids = Object.keys(this.tracks);

    this.trackids.forEach((trackid) => {
      let _ = this.tracks[trackid];

      // cover art url
      let DEFAULT_COVER_URL = "/covers/default.jpg";

      _.coverURL = _.cover_approved
        ? _.coverURL
          ? _.coverURL
          : "/covers/" + trackid + ".jpg"
        : DEFAULT_COVER_URL;
    });

    // set current track
    this.currentTrackId = this.trackids[this.trackids.length - 1];
  },

  getTracksByDate() {
    // TODO
    return this.trackids;
  },

  setCurrentTrackId(id) {
    this.currentTrackId = id;
  },
});

// export database object
export { db };
