/*eslint-env browser */
/*global jQuery, io */

const allBuffers = {};
let audioContext;
let sounds = window.sounds; //defined in soundRegistry
let soundEmojis = window.soundEmojis; //defined in soundRegistry

let audiocontextplease = window.AudioContext || window.webkitAudioContext // Safari and old versions of Chrome
|| false;
jQuery(function ()
{


    for (let key in sounds)
    {
        let content = key;
        if (soundEmojis[key])
        {
            content = soundEmojis[key];
        }
        addSoundToSoundGrid(key, content);
    }



    // document.addEventListener("visibilitychange", () =>
    // {
    //     if (!document.hidden)
    //     {
    //         console.log(audiocontextplease);
    //         audiocontextplease.resume();
    //     }
    // }, false);

    jQuery('#step-name').on('click', function ()
    {

        if (!audiocontextplease || audioContext !== undefined)
        {
            return;
        }

        audioContext = new audiocontextplease();
        if (audioContext && audioContext.state === 'suspended')
        {
            audioContext.resume();
        }
        //console.log(audioContext);

        for (let key in sounds)
        {
            let request = new XMLHttpRequest();
            request.open('GET', '/' + sounds[key], true);
            request.responseType = 'arraybuffer';
            request._key = key;
            request.addEventListener('load', bufferSound, false);
            request.send();
        }

        function bufferSound(event)
        {
            var request = event.target;
            var audioData = request.response;

            audioContext.decodeAudioData(
                audioData,
                function (buffer)
                {
                    allBuffers[request._key] = buffer;
                },
                function (e)
                {
                    console.log("Error with decoding audio data" + e.err);
                }
            );
        }
    });

    jQuery('label').on('click', function (e)
    {
        var audioId = jQuery(this).attr('for');

        resumeAudioContext();
        //console.log(audioContext);

        playSound(audioId);
    });


});

function resumeAudioContext() {
    audioContext = new audiocontextplease();
    if (audioContext && audioContext.state === 'suspended')
    {
        audioContext.resume();
    }
}

function playSound(soundId)
{
    var source;
    source = audioContext.createBufferSource();
    source.connect(audioContext.destination);
    source.buffer = allBuffers[soundId];

    source.connect(audioContext.destination);
    source.start();
}

function addSoundToSoundGrid(soundId, labelContent)
{
    jQuery('#sound-grid').append(' <input type="radio" name="sound" id="' + soundId + '" value="' + soundId + '">'
        + '<label for="' + soundId + '">' + labelContent + '</label>');
}

window.playSound = playSound;