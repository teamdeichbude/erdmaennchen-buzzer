/*eslint-env browser */
/*global jQuery, io */

let soundEmojis = window.soundEmojis; //defined in soundRegistry.js

jQuery(function ()
{
    let jqSingleBuzzCheckbox = jQuery('#singleBuzzer');
    let activateButton = jQuery("#activate");

    let listItm = "<li>";
    var socket = io('/admin');
    sendToggleSingleBuzzStatus();

    socket.on("sde-admin-playersChanged", function (data)
    {
        let jqList = jQuery("#allPlayersList");
        jqList.empty();

        for (let p in data.allPlayers)
        {
            let player = data.allPlayers[p];
            let playerId = player._id.match('#(.*)')[1];
            jqList.append(jQuery('<li id="' + playerId + '">').html('<span class="buzzerState disabled"></span>' + player.name + "<span class='sound'>" + soundEmojis[player.soundIdent] + "</span>"));
        }
    });

    socket.on('sde-admin-buzzerStateChagned', function(data) {

    });

    socket.on('sde-player-buzzstate-updated', function (data) {
        let playerId = data.playerId.match('#.*');
        let playerLi = jQuery(playerId[0]);
        playerLi.removeClass('enabled win lose');
        if (data.enabled || data.win === true) {
            playerLi.addClass('enabled');
        }
        if (data.win === true) {
            playerLi.addClass('win');
        }
        if (data.win === false) {
            playerLi.addClass('lose');
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