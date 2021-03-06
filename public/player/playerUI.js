/*eslint-env browser */
/*global jQuery, io */

// eslint-disable-next-line no-undef
if (!soundEmojis) {
    let soundEmojis = window.soundEmojis; //defined in soundRegistry.js
}

jQuery(function ()
{
    let teamName;
    let selectedSound;
    let buzzMode = 'buzz'; // or 'text'

    var socket = io('/player');
    socket.on('disconnect', function()
    {
        socket.open();
    });
    
    socket.on('connect', function()
    {
        sendPlayerData();
    });

    jQuery("#teamname").on('keyup blur', function()
    {
        jQuery('#step-name-button').prop('disabled', this.value.trim().length === 0);
    });

    jQuery('#step-name-button').on('click', function(e)
    {
        teamName = jQuery('#teamname').val();
        jQuery('#step-name').addClass('hide');
        jQuery('#step-sound').addClass('show');
    });

    jQuery('#step-sound-button').on("click", function (e)
    {
        jQuery('#step-sound').addClass('hide');
        jQuery('#step-play').addClass('show');
        selectedSound = jQuery('input[type=radio]:checked').val();
        sendPlayerData();
    });

    jQuery('label').on('click', function(e)
    {
        let soundInput= jQuery('#'+jQuery(this).attr('for'));
        if (soundInput && soundInput.prop('disabled') !== true) {
            jQuery('#step-sound-button').html('Bester Buzzer Sound ever, let\'s go!');
            jQuery('#step-sound-button').prop('disabled', false);
        }
    });

    jQuery('#buzz').on("click", function (e)
    {
        window.resumeAudioContext();
        socket.emit('sde-player-buzzed', jQuery('#textBuzzerInput').val());
    });

    socket.on("sde-player-buzzstatechange", function (data)
    {
        console.log(data);
        jQuery('#buzz').removeClass('win lose');
        jQuery('#buzz')[0].disabled = !data.enabled;

        if (data.enabled) {
            jQuery('#buzzList').html("");
        } else if(data.win === null || data.win === undefined) {
            jQuery('#textBuzzerInput').val('');
            jQuery('#textBuzzerInput').addClass('hidden');
        }

        if (buzzMode === 'buzz') {
            jQuery('#buzz').html(data.enabled ? 'BUZZ!' : 'Bereit machen ...');
            if (data.win === true) {
                jQuery('#buzz').addClass('win');
                jQuery('#buzz').html('Buzzer ausgel??st!');
            } else if (data.win === false) {
                jQuery('#buzz').addClass('lose');
                jQuery('#buzz').html('Zu langsam!');
            }
        } else if (buzzMode === 'text') {
            jQuery('#buzz').html(data.enabled ? 'Antwort abgeben' : 'Bereit machen ...');
            if (data.win !== undefined && data.win !== null) {
                jQuery('#buzz').addClass('win');
                jQuery('#buzz').html('Antwort verschickt!');
            }
        }

        socket.emit('sde-player-buzzstate-updated', data);
    });

    socket.on("sde-player-buzztypebuzz", function() {
        buzzMode = 'buzz';
        jQuery('#textBuzzerInput').addClass('hidden');
    });

    socket.on("sde-player-buzztypetext", function() {
        buzzMode = 'text';
        jQuery('#textBuzzerInput').removeClass('hidden');
    });

    socket.on("sde-player-buzzed", function(data)
    {
        if (data.player.soundIdent && data.isFirstBuzz) {
            window.playSound(data.player.soundIdent);
        }
        if (jQuery('#buzzList').children().length < 3) {
            jQuery('#buzzList').append(
                // eslint-disable-next-line no-undef
                '<li>' + soundEmojis[data.player.soundIdent] + ' ' + data.player.name
                + '<span class="time">' + data.formattedTime + '</span></li>'
            );
        }
    });

    socket.on('sde-player-disableBuzzSounds', function (data)
    {
        jQuery('input[name=sound]').each( function( i, el ) {
            var soundInput = jQuery( el );
            if (data.includes(soundInput.attr('id'))) {
                soundInput.prop('disabled', true);
                soundInput.prop('checked', false);
            } else {
                soundInput.prop('disabled', false);
            }
        });
        if (jQuery('input:checked').length === 0) {
            jQuery('#step-sound-button').html('W??hle einen Buzzer Sound!');
            jQuery('#step-sound-button').prop('disabled', true);
        }
    });

    socket.on("sde-error", function (data)
    {
        console.error("sde error: " +  data.error);
    });

    function sendPlayerData()
    {
        if (teamName && selectedSound) {
            socket.emit('sde-player-connect', {
                playerName: teamName,
                playerAudio: selectedSound
            });
        }
    }
});