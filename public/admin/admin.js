
/*eslint-env browser */
/*global jQuery, io */

jQuery(function ()
{
    let listItm = "<li>";
    console.log("admin init");
    var socket = io();

    socket.on("sde-admin-playersChanged", function (data)
    {
        console.log(data);
        let jqList = jQuery("#allPlayersList");
        jqList.empty();

        for (let p in data.allPlayers)
        {
            let player = data.allPlayers[p];
            jqList.append(jQuery(listItm).text(player.name + "|| " + player.soundIdent));
        }
    });

    socket.on("sde-error", function (data)
    {
        console.error("sde error: " + data.error);
    });

    socket.on("sde-player-buzzed", function (data)
    {
        jQuery("#buzzerOrder").prepend(
            jQuery(listItm)
                .append([data.player.name], jQuery('<span class="time">').text(new Date(data.time).format("dd/MM/yyyy HH:mm:ss fff")))
        );
    });

    jQuery("#activate").on("click", function ()
    {
        socket.emit("sde-admin-activate", true);
    });
});