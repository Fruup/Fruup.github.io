/* DB values */

function Track(trackid, title, date, tags, coverArtist, coverArtistURL) {
    // load wav file
    this.howl = new Howl({
        src: ['/mp3/' + trackid + '.mp3'],
        //src: 'https://media.githubusercontent.com/media/Fruup/Fruup.github.io/master/wav/' + trackid + '.wav',
        preload: false,
        html5: true,
    })

    // meta data
    this.title = title
    this.date = date
    this.cover = '/covers/' + trackid + '.jpg'
    this.waveform = '/img/waveforms/' + trackid + '.png'
    this.tags = tags
    this.coverArtist = coverArtist
    this.coverArtistURL = coverArtistURL

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
            db.tracks[trackid] = new Track(
                trackid,
                data[trackid].title,
                new Date(
                    data[trackid].date.year,
                    data[trackid].date.month,
                    data[trackid].date.day),
                data[trackid].tags,
                data[trackid].cover_artist,
                data[trackid].cover_artist_url,
            )
        }
        
        if (urlVars['trackid'] != null && urlVars['trackid'] in db.tracks) {
            // set track specified in URL
            player.setCurrentTrack(urlVars['trackid'])
        }
        else {
            // set newest track
            player.setCurrentTrack(db.getTracksByDate()[0])
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
