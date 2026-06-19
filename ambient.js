/*
 * Shared ambient-music player for mbogard.com.
 *
 * Lives at the site root so BOTH the driving game (/) and the 2D portfolio
 * (/portfolio/) can include the exact same file via <script src="/ambient.js">.
 * Because both are served from the same origin they share localStorage, which
 * is how playback "carries over" when you navigate between them: the page on
 * the way out records which track is playing and where; the page on the way in
 * resumes that same track at (roughly) the same spot and fades back in. There
 * is necessarily a brief gap during the page load itself — a single <audio>
 * stream cannot survive a full document navigation — but advancing the saved
 * position by the real time elapsed keeps it feeling continuous.
 *
 * No dependencies. Vanilla HTML5 Audio so it's identical on both sites without
 * pulling Howler/webpack into the static portfolio.
 */
(function ()
{
    if(window.AmbientPlayer) { return } // guard against double-inclusion

    var TRACKS = [
        { src: '/ambient/warm-spot.mp3', title: 'Warm Spot', artist: 'Bosnow' },
        { src: '/ambient/satie.mp3',     title: 'Satie',     artist: 'Oliver Massa' }
    ]

    var TARGET_VOLUME = 0.32   // soft background bed
    var FADE_MS       = 2600   // fade-in / fade-out duration
    var SAVE_EVERY_MS = 2500   // how often we persist playback position

    var KEY_ENABLED = 'ambientEnabledV1'
    var KEY_TRACK   = 'ambientTrackV1'
    var KEY_POS     = 'ambientPosV1'
    var KEY_TS      = 'ambientTsV1'      // wall-clock ms when position was saved

    var ls = window.localStorage

    function isEnabled()
    {
        // Default ON; only an explicit 'false' disables it.
        return ls.getItem(KEY_ENABLED) !== 'false'
    }

    var state = {
        audio: null,
        index: 0,
        fadeRAF: null,
        lastSave: 0,
        started: false   // has playback actually begun (past autoplay gate)?
    }

    // --- volume fading -------------------------------------------------------
    function cancelFade()
    {
        if(state.fadeRAF) { window.cancelAnimationFrame(state.fadeRAF); state.fadeRAF = null }
    }

    function fadeTo(target, onDone)
    {
        cancelFade()
        var audio = state.audio
        if(!audio) { return }
        var from = audio.volume
        var start = null
        function step(ts)
        {
            if(start === null) { start = ts }
            var t = Math.min((ts - start) / FADE_MS, 1)
            audio.volume = from + (target - from) * t
            if(t < 1) { state.fadeRAF = window.requestAnimationFrame(step) }
            else { state.fadeRAF = null; if(onDone) { onDone() } }
        }
        state.fadeRAF = window.requestAnimationFrame(step)
    }

    // --- position persistence ------------------------------------------------
    function savePosition()
    {
        var audio = state.audio
        if(!audio) { return }
        ls.setItem(KEY_TRACK, String(state.index))
        ls.setItem(KEY_POS, String(audio.currentTime || 0))
        ls.setItem(KEY_TS, String(Date.now()))
    }

    // Where to resume: saved position advanced by however long ago it was saved,
    // so the track feels like it kept playing through the navigation gap.
    function resumeOffset(duration)
    {
        var pos = parseFloat(ls.getItem(KEY_POS) || '0') || 0
        var ts = parseFloat(ls.getItem(KEY_TS) || '0') || 0
        if(ts > 0) { pos += (Date.now() - ts) / 1000 }
        if(duration && isFinite(duration) && duration > 0) { pos = pos % duration }
        return pos < 0 ? 0 : pos
    }

    // --- core playback -------------------------------------------------------
    function buildAudio()
    {
        var saved = parseInt(ls.getItem(KEY_TRACK) || '0', 10)
        state.index = (isNaN(saved) ? 0 : saved) % TRACKS.length

        var audio = new Audio()
        audio.src = TRACKS[state.index].src
        audio.loop = false           // we hop to the next track on 'ended'
        audio.preload = 'auto'
        audio.volume = 0

        // Resume at the saved offset once we know the duration.
        audio.addEventListener('loadedmetadata', function ()
        {
            try { audio.currentTime = resumeOffset(audio.duration) } catch(e) {}
        })

        // When a track finishes, advance to the next one (alternates the two)
        // for variety instead of looping a single piece forever.
        audio.addEventListener('ended', function ()
        {
            state.index = (state.index + 1) % TRACKS.length
            audio.src = TRACKS[state.index].src
            audio.currentTime = 0
            ls.setItem(KEY_TRACK, String(state.index))
            audio.play().catch(function () {})
        })

        audio.addEventListener('timeupdate', function ()
        {
            var now = Date.now()
            if(now - state.lastSave > SAVE_EVERY_MS) { state.lastSave = now; savePosition() }
        })

        state.audio = audio
    }

    function tryStart()
    {
        if(!state.audio) { buildAudio() }
        if(!isEnabled()) { return }
        var audio = state.audio
        var p = audio.play()
        if(p && p.catch)
        {
            p.then(function ()
            {
                state.started = true
                fadeTo(TARGET_VOLUME)
            }).catch(function ()
            {
                // Autoplay blocked until a user gesture — arm one-shot listeners.
                armGesture()
            })
        }
        else
        {
            state.started = true
            fadeTo(TARGET_VOLUME)
        }
    }

    var gestureArmed = false
    function armGesture()
    {
        if(gestureArmed) { return }
        gestureArmed = true
        var events = ['pointerdown', 'keydown', 'touchstart']
        function go()
        {
            events.forEach(function (e) { window.removeEventListener(e, go, true) })
            gestureArmed = false
            tryStart()
        }
        events.forEach(function (e) { window.addEventListener(e, go, true) })
    }

    // --- public controls -----------------------------------------------------
    function setEnabled(on)
    {
        ls.setItem(KEY_ENABLED, on ? 'true' : 'false')
        if(on)
        {
            tryStart()
        }
        else if(state.audio)
        {
            savePosition()
            fadeTo(0, function () { if(state.audio) { state.audio.pause() } })
        }
    }

    window.AmbientPlayer = {
        tracks: TRACKS,
        isEnabled: isEnabled,
        setEnabled: setEnabled,
        toggle: function () { setEnabled(!isEnabled()); return isEnabled() },
        // Used by host pages that want to kick playback off after their own
        // intro (e.g. the game waits for assets to be ready).
        start: tryStart
    }

    // --- lifecycle -----------------------------------------------------------
    // Pause + save when the tab is hidden or we navigate away, so background
    // tabs go quiet and the position is captured for the next page.
    document.addEventListener('visibilitychange', function ()
    {
        if(document.hidden)
        {
            savePosition()
            if(state.audio) { cancelFade(); state.audio.pause() }
        }
        else if(isEnabled() && state.started)
        {
            state.audio.play().then(function () { fadeTo(TARGET_VOLUME) }).catch(function () {})
        }
    })
    window.addEventListener('pagehide', savePosition)
    window.addEventListener('beforeunload', savePosition)

    // Kick off. The game overrides timing by calling AmbientPlayer.start() after
    // its reveal, but we also self-start so the static portfolio needs no wiring.
    if(document.readyState === 'complete' || document.readyState === 'interactive')
    {
        tryStart()
    }
    else
    {
        window.addEventListener('DOMContentLoaded', tryStart)
    }
})()
