/*eslint-env browser */
/*global jQuery, io */

jQuery(function ()
{
    $("#teamname").on('keyup blur', function(){
        $('#step-name-button').prop('disabled', this.value.trim().length === 0);
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
        'crowd gasp': 'assets/sounds/Crowdgasp.mp3'
    };

    for (let key in sounds) {
        jQuery('#sound-grid').append('<input type="radio" name="sound" id="' + key + '" value="' + key + '"><label for="' + key + '">' + key + '</label>')
    }

    var socket = io();
    jQuery('#submit').on("click", function (e)
    {
        socket.emit('sde-player-connect', {

            playerName: jQuery('#teamname').val(),
            playerAudio: jQuery("#sound").val()
        });
    });

    socket.on("sde-player-buzzstatechange", function (data)
    {
        jQuery('#buzz')[0].disabled = !data.enabled;
        if(data.win === true) {
            console.log("win");
        }
        else if(data.win === false) {
            console.log("lose");
        }
        else {
            console.log("go to waiting state");
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