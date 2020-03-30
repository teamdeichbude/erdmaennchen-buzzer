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
        jQuery('#sound-grid').append(' <input type="radio" name="sound" id="' + key + '" value="' + key + '"><label for="' + key + '">' + key + '</label>')
    }

    jQuery('label').on('click', function(e) {
        jQuery('#step-sound-button').prop('disabled', false);
    })

    var socket = io();
    jQuery('#step-sound-button').on("click", function (e)
    {
        socket.emit('sde-player-connect', {
            playerName: jQuery('#teamname').val(),
            playerAudio: jQuery('input[type=radio]:checked').val()
        });
    });

    socket.on("sde-player-buzzstatechange", function (data)
    {
        console.log(data);
        jQuery('#buzz').removeClass('win lose');
        jQuery('#buzz')[0].disabled = !data.enabled;

        jQuery('#buzz').html(data.enabled ? 'BUZZ!' : 'Warte ...');

        if(data.win === true) {
            jQuery('#buzz').addClass('win');
            jQuery('#buzz').html('Buzzer ausgelöst!');
        }
        else if(data.win === false) {
            jQuery('#buzz').addClass('lose');
            jQuery('#buzz').html('Zu langsam!');
        }
    });

    socket.on("sde-error", function (data)
    {
        console.error("sde error: " +  data.error);
    });

    jQuery('#buzz').on("click", function (e)
    {
        socket.emit('sde-player-buzzed', {

        });
    });
});