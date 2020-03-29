/*eslint-env browser */
/*global jQuery, io */

jQuery(function ()
{
    var socket = io();
    jQuery('#submit').on("click", function (e)
    {
        socket.emit('sde-connectPlayer', {

            playerName: jQuery('#teamname').val(),
            playerAudio: jQuery("#sound").val()
        });
    });
});