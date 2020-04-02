/*eslint-env browser */
/*global jQuery, io */

jQuery(function ()
{
    jQuery("#teamname").on('keyup blur', function(){
        jQuery('#step-name-button').prop('disabled', this.value.trim().length === 0);
    });

    jQuery('#step-name-button').on('click', function(e) {
        jQuery('#step-name').addClass('hide');
        jQuery('#step-sound').addClass('show');
    });

    jQuery('#step-sound-button').on('click', function(e) {
        jQuery('#step-sound').addClass('hide');
        jQuery('#step-play').addClass('show');
    });

    jQuery('label').on('click', function(e) {
        let soundInput= jQuery('#'+jQuery(this).attr('for'));
        if (soundInput && soundInput.prop('disabled') !== true) {
            jQuery('#step-sound-button').html('Bester Buzzer Sound ever, let\'s go!');
            jQuery('#step-sound-button').prop('disabled', false);
        }
    });

    var socket = io();
    var selectedSound = "";
    jQuery('#step-sound-button').on("click", function (e)
    {
        selectedSound = jQuery('input[type=radio]:checked').val();
        socket.emit('sde-player-connect', {
            playerName: jQuery('#teamname').val(),
            playerAudio: selectedSound
        });
    });

    socket.on("sde-player-buzzstatechange", function (data)
    {
        console.log(data);
        jQuery('#buzz').removeClass('win lose');
        jQuery('#buzz')[0].disabled = !data.enabled;

        if (data.enabled) {
            jQuery('#buzzList').html("");
        }

        jQuery('#buzz').html(data.enabled ? 'BUZZ!' : 'Bereit machen ...');

        if(data.win === true) {
            jQuery('#buzz').addClass('win');
            jQuery('#buzz').html('Buzzer ausgelöst!');
        }
        else if(data.win === false) {
            jQuery('#buzz').addClass('lose');
            jQuery('#buzz').html('Zu langsam!');
        }
    });

    socket.on("sde-player-buzzed", function(data) {
        if (data.player.soundIdent && data.isFirstBuzz) {
            window.playSound(data.player.soundIdent);
        }
        if (jQuery('#buzzList').children().length < 3) {
            jQuery('#buzzList').append(
                '<li>' + data.player.name + '<span class="time">' + data.formattedTime + '</span></li>'
            );
        }
        console.log(data);
    });

    socket.on('sde-player-disableBuzzSounds', function (data) {
        jQuery('input[name=sound]').each( function( i, el ) {
            var soundInput = jQuery( el );
            if(data.includes(soundInput.attr('id'))) {
                soundInput.prop('disabled', true);
            }else {
                soundInput.prop('disabled', false);
            }
        });
    });

    socket.on("sde-error", function (data)
    {
        console.error("sde error: " +  data.error);
    });

    jQuery('#buzz').on("click", function (e)
    {
        socket.emit('sde-player-buzzed', {});
    });
});