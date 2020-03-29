
/*eslint-env browser */
/*global jQuery, io */

jQuery(function ()
{

    console.log("admin init");
    var socket = io();

    socket.on("sde-admin-playerAdded", function(data) {
        console.log(data);
        let jqList = jQuery("#allPlayersList");
        jqList.empty();

        for(let p in data.allPlayers) {
            let player = data.allPlayers[p];
            jqList.append(jQuery("<li>").text(player.name + "|| " + player.soundIdent));
        }
    });
});