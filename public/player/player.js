/*eslint-env browser */
/*global jQuery, io */

jQuery(function ()
{
    var socket = io();
    jQuery('#submit').on("click", function (e)
    {
        socket.emit('sda-namechange',  jQuery('#teamname').val());
    });
});