/* Audio player properties */
player = {
    seeking: false,
    seekPercentage: 0.0,

    currentTrack: null,

    volume: 0.0
}

/* Audio player methods */
player.setup = function() {
    // initial volume
    this.setVolume(0.5)

    // play button interaction
    $('#play').click(function() {
        // toggle playback
        player.toggleCurrentTrack();

        // TODO: skip to marker
    })

    // setup timeline interaction
    $('#timeline').mousedown(function(event) {
        if (event.button == 0) {
            // start seeking
            player.seeking = true

            // seek proc
            const func = function(event_) {
                // calculate progress along timeline
                player.seekPercentage = ((event_.pageX - $('#timeline').offset().left) / $('#timeline').width()).clamp(0.0, 1.0)

                // set marker position
                $('#timelineMarker').css({ left: (100 * player.seekPercentage) + '%' })
            }

            func(event)

            // listen for mouse move events
            $(document).on('mousemove', func)
        }
    })

    $(document).mouseup(function(event) {
        if (event.button == 0) {
            // stop listening for mouse move events
            $(document).off('mousemove')

            if (player.seeking) {
                // seek track
                player.getCurrentTrack().seek(player.seekPercentage * player.getCurrentTrack().duration())

                // stop seeking
                player.seeking = false
            }
        }
    })

    // start timeline update thread
    setInterval(function() {
        if (player.getCurrentTrack() != null && player.getCurrentTrack().playing() && player.seeking == false) {
            const progress = player.getCurrentTrack().seek() / player.getCurrentTrack().duration()

            // update timeline slider
            $('#timelineMarker').css({ left: (100 * progress) + '%' })
        }
    }, 20)
}

player.setCurrentTrack = function(identifier) {
    // stop current track
    if (this.getCurrentTrack())
        this.getCurrentTrack().stop()

    // reset seek
    player.seekPercentage = 0.0
    $('#timelineMarker').css('left', '0')

    // set new track id
    player.currentTrack = identifier

    // TODO: fade in new meta text
    $('#trackTitle').text(player.getCurrentTrack().title)
    //$('#trackPlaylist').text(player.getCurrentTrack().playlist)

    // TODO: set waveform
    $('#timelineWaveform').attr('src', player.getCurrentTrack().waveform)
}

player.setVolume = function(vol) {
    player.volume = vol
    Howler.volume(vol)
}

player.getCurrentTrack = function() {
    return db.getTrack(player.currentTrack)
}

player.pauseCurrentTrack = function() {
    if (player.getCurrentTrack() != null)
    player.getCurrentTrack().pause()
}

player.toggleCurrentTrack = function() {
    if (player.getCurrentTrack() != null) {
        if (player.getCurrentTrack().playing())
            player.getCurrentTrack().pause()
        else player.getCurrentTrack().play()
    }
}
