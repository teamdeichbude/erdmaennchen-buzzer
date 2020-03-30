
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
            jqList.append(jQuery(listItm).html(player.name + "<span class='sound'>" + player.soundIdent + "</span>"));
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
                .append([data.player.name], jQuery('<span class="time">').text(data.formattedTime))
        );
    });

    jQuery("#activate").on("click", function ()
    {
        socket.emit("sde-admin-activate", true);
    });
});