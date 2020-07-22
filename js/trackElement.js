function setupTrackElements() {
    // setup track showcase
    e = $('#tracks')

    tracksByDate = db.getTracksByDate();

    for (i = 0; i < tracksByDate.length; i++) {
        $(e[i]).data('trackid', tracksByDate[i])

        e.append('<div class="track" data-trackid="' + tracksByDate[i] + '"></div>')
    }

    // -----------------------------------
    // select all track elements
    e = $('.track')

    const duration = 150
    const borderMin = e.css('border-width')
    const borderMax = e.css('padding')

    // set cover art
    for (i = 0; i < e.length; i++) {
        const trackid = $(e[i]).data('trackid')
        const track = db.getTrack(trackid)

        $(e[i]).css({
            backgroundImage: 'url(' + track.cover + ')'
        })
    }

    // interactivity
    e.mouseover(function() {
        // expand border
        $(this).animate({
            borderWidth: borderMax,
            padding: borderMin
        }, {
            duration: duration,
            queue: false
        })

        // TODO: show play button
    })

    e.mouseleave(function() {
        // revert border
        $(this).animate({
            borderWidth: borderMin,
            padding: borderMax
        }, {
            duration: duration,
            queue: false
        })

        // TODO: hide play button
    })

    e.click(function() {
        // get track id from html element
        trackid = $(this).data('trackid')

        // set track and play
        if (trackid != null && player.currentTrack != trackid) {
            player.setCurrentTrack(trackid)
            player.toggleCurrentTrack()
        }
    })
}
