/*eslint-env browser */
/*global jQuery, io */

const allBuffers = {};
let audioContext;

jQuery(function () {
    var sounds = {
        awkestra: 'assets/sounds/Awkestra.mp3',
        cena: 'assets/sounds/cena.mp3',
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

    for (let key in sounds) {
        if (key === 'cena') {
            jQuery('#sound-grid').append(' <input type="radio" name="sound" id="' + key + '" value="' + key + '">'
            +'<label for="' + key + '">' + key + '</label>');
        } else {
            jQuery('#sound-grid').append(' <input type="radio" name="sound" id="' + key + '" value="' + key + '">'
            +'<label for="' + key + '">' + key + '</label>');
        }
    }

    const audiocontextplease = window.AudioContext || window.webkitAudioContext // Safari and old versions of Chrome
                            || false;
    
        jQuery('#step-name').on('click', function() {
            if (!audiocontextplease || audioContext !== undefined) {
                return;
            }

            audioContext = new audiocontextplease();
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            //console.log(audioContext);
            
            for (let key in sounds) {
                let request = new XMLHttpRequest();
                request.open('GET', '/' + sounds[key], true);
                request.responseType = 'arraybuffer';
                request._key = key;
                request.addEventListener('load', bufferSound, false);
                request.send();
            }
            
            function bufferSound(event) {
                var request = event.target;
                var audioData = request.response;

                audioContext.decodeAudioData(
                    audioData,
                    function(buffer) {
                        allBuffers[request._key] = buffer;
                    },
                    function(e){
                        console.log("Error with decoding audio data" + e.err);
                    }
                );
            }
        });
        
        jQuery('label').on('click', function(e) {
            var audioId = jQuery(this).attr('for');
            playSound(audioId);
        });

        
});

function playSound(soundId) {
    var source;
    source = audioContext.createBufferSource();
    source.connect(audioContext.destination);
    source.buffer = allBuffers[soundId];

    source.connect(audioContext.destination);
    source.start();
}

window.playSound = playSound;