jQuery(function () {
    var sounds = {
        awkestra: 'assets/sounds/Awkestra.mp3',
        cena: 'assets/sounds/cenam4a.m4a',
        gasp: 'assets/sounds/Crowdgasp.mp3',
        error: 'assets/sounds/Error.mp3',
        fart: 'assets/sounds/Flatulenz.mp3',
        horn: 'assets/sounds/Horn.mp3',
        hornstar: 'assets/sounds/Hornstar.mp3',
        sheep: 'assets/sounds/Liesel.mp3',
        goat: 'assets/sounds/Mähndy.mp3',
        marimba: 'assets/sounds/Marimba.mp3',
        oof: 'assets/sounds/Oof.mp3',
        orchestra: 'assets/sounds/Orchestra.mp3',
        plop: 'assets/sounds/plop.mp3',
        ring: 'assets/sounds/Ring.mp3'
    };

    var audioElements = {};
    for (let key in sounds) {
        var audio = new Audio();
        audio.src = '../'+sounds[key];
        audio.type = 'audio/mpeg';
        if (key === 'cena') {
            audio.type = 'audio/mp4';
        }
        audioElements[key] = audio;

        
        if (key === 'cena') {
            jQuery('#sound-grid').append(' <input type="radio" name="sound" id="' + key + '" value="' + key + '">'
            +'<label for="' + key + '">' + key + '</label>');
            //+'<audio id="' + key+'audio' + '" src="../' + sounds[key] + '" type="audio/mp4"></audio>');
        } else {
            jQuery('#sound-grid').append(' <input type="radio" name="sound" id="' + key + '" value="' + key + '">'
            +'<label for="' + key + '">' + key + '</label>');
           // +'<audio id="' + key+'audio' + '" src="../' + sounds[key] + '" type="audio/mpeg"></audio>');
        }
    }

    var audiocontextplease = window.AudioContext || window.webkitAudioContext // Safari and old versions of Chrome
                            || false;

    if (audiocontextplease) {
        const audioContext = new audiocontextplease;

        // get the audio elements
       // const audioElements = jQuery('audio');

        //console.log(audioElements);

        // pass it into the audio context
        for (let key in audioElements) {
            //console.log(audioElements[key]);
            if (audioElements[key] instanceof HTMLMediaElement) {
                var mediaElement = audioContext.createMediaElementSource(audioElements[key]);
                mediaElement.connect(audioContext.destination);
            }
        }

        // select our play button
        const playButton = document.querySelector('#playpause');

        
        jQuery('label').on('click', function(e) {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            //var audioId = '#' + jQuery(this).attr('for') + 'audio';
            //var audioElement = jQuery(this).siblings(audioId)[0];
            var audioElement = audioElements[jQuery(this).attr('for')];
            audioElement.load();
            audioElement.play();
        });

        /* playButton.addEventListener('click', function() {

            // check if context is in suspended state (autoplay policy)
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            // play or pause track depending on state
            if (this.dataset.playing === 'false') {
                audioElement.play();
                this.dataset.playing = 'true';
            } else if (this.dataset.playing === 'true') {
                audioElement.pause();
                this.dataset.playing = 'false';
            }

        }, false); */
    }
});