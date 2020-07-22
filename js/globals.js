/* Global properties */
const FADE_DURATION = 250

/* Helpers */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
}
