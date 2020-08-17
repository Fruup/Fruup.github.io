/* DB values */

const DEFAULT_COVER_IMAGE = '/covers/default.jpg'

function Track(trackid, data) {
    // load audio file
    this.howl = new Howl({
        src: ['/mp3/' + trackid + '.mp3'],
        preload: false,
        html5: true,
    })

    // meta data
    this.title = data.title
    this.date = new Date(
        data.date.year,
        data.date.month,
        data.date.day)

    if (data['cover_approved']) {
        if (data['cover'] != undefined) this.cover = data.cover
        else this.cover = '/covers/' + trackid + '.jpg'
    }
    else this.cover = DEFAULT_COVER_IMAGE

    this.waveform = '/img/waveforms/' + trackid + '.png'
    this.tags = data.tags
    this.coverArtist = data.cover_artist
    this.coverArtistURL = data.cover_artist_url

    // methods
    this.playing = () => this.howl.playing()
    this.play = () => this.howl.play()
    this.pause = () => this.howl.pause()
    this.stop = () => this.howl.stop()
    this.duration = () => this.howl.duration()
    this.seek = (sec) => this.howl.seek(sec)
}

db = {
    tracks: {},
    playlists: {},
}

/* DB methods */
db.loadTracks = async function() {
    // get URL variables
    var urlVars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        urlVars[key] = value;
    });        
    
    // load track data and metadata
    $.getJSON('/tracks.json', function(data) {
        for (trackid in data) {
            // create new track instance
            db.tracks[trackid] = new Track(trackid, data[trackid])
        }
        
        if (urlVars['trackid'] != null && urlVars['trackid'] in db.tracks) {
            // set track specified in URL
            player.setCurrentTrack(urlVars['trackid'])
        }
        else {
            // set newest track
            var tracksByDate = db.getTracksByDate()
            player.setCurrentTrack(tracksByDate[tracksByDate.length - 1])
        }

        // setup all track elements
        setupTrackElements()

        // setup player
        player.setup()
    })

    // load playlists
    $.getJSON('/playlists.json', function(data) {
        for (playlist in data) {
            // TODO
        }
    })
}

db.getTrack = function(identifier) {
    return db.tracks[identifier]
}

db.getTracksByDate = function() {
    var list = []

    for (trackid in db.tracks)
        list.push(trackid)

    return list.sort((a, b) => db.tracks[a].date - db.tracks[b].date)
}
