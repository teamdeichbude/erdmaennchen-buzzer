/*eslint-env browser */
/*global jQuery, io */

jQuery(function ()
{
    var socket = io();
    jQuery('form').submit(function (e)
    {
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', jQuery('#m').val());
        jQuery('#m').val('');
        return false;
    });
});