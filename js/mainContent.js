/* Main content area values */
main = {
    currentIndex: null,
}

/* Main content area methods */
main.getCurrent = function() {
    if (this.currentIndex != null) return '#main' + this.currentIndex
    else return null
}

main.switch = function(which) {
    if (main.currentIndex != which) {

        if (main.currentIndex != null) {
            // animate menu button
            const prevMenuButton = '#menu' + main.currentIndex

            $(prevMenuButton).animate({
                opacity: '1.0'
            }, {
                duration: FADE_DURATION,
                queue: true
            })
        }

        // animate new menu button
        const nextMenuButton = '#menu' + which
        $(nextMenuButton).animate({
            opacity: '0.8'
        }, {
            duration: FADE_DURATION,
            queue: true
        })

        function initNewMain() {
            // set new index
            main.currentIndex = which

            // fade in new main
            $(main.getCurrent()).fadeIn(FADE_DURATION)
            $(main.getCurrent()).show()
        }

        if (main.currentIndex != null) {
            // fade out prev main
            $(main.getCurrent()).fadeOut(FADE_DURATION, function() {
                // hide prev main
                $(main.getCurrent()).hide()

                // show new main
                initNewMain()
            })
        }

        // show new main
        else initNewMain()
    }
}
