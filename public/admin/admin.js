
/*eslint-env browser */
/*global jQuery, io */

jQuery(function ()
{

    let jqSingleBuzzCheckbox = jQuery('#singleBuzzer');
    let activateButton = jQuery("#activate");

    let listItm = "<li>";
    console.log("admin init");
    var socket = io();
    sendToggleSingleBuzzStatus();

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
        jQuery("#buzzerOrder").append(
            jQuery(listItm)
                .append([data.player.name], jQuery('<span class="time">').text(data.formattedTime))
        );
    });

    activateButton.on("click", function ()
    {
        if (activateButton.hasClass('activate')) {
            jQuery("#buzzerOrder").html("");
            activateButton.html("Buzzer deaktivieren");
        } else {
            activateButton.html("Buzzer freischalten");
        }
        console.log("emit sde-admin-activate with " + activateButton.hasClass('activate'));
        socket.emit("sde-admin-activate", activateButton.hasClass('activate'));
        activateButton.toggleClass('activate deactivate');
    });

    jqSingleBuzzCheckbox.on('change', sendToggleSingleBuzzStatus);

    function sendToggleSingleBuzzStatus()
    {
        socket.emit("sde-admin-toggleSingleBuzz", {single: jqSingleBuzzCheckbox.is(":checked")});
    }
});