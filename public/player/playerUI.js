/*eslint-env browser */
/*global jQuery, io */

jQuery(function ()
{
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
    });

    jQuery('#buzz').on("click", function (e)
    {
        socket.emit('sde-player-buzzed', {

        });
    });
});