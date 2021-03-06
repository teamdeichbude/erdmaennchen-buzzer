/*eslint-env browser */
/*global jQuery, io */

let soundEmojis = window.soundEmojis; //defined in soundRegistry.js

jQuery(function ()
{
    let jqSingleBuzzCheckbox = jQuery('#singleBuzzer');
    let activateButton = jQuery("#activate");
    let buzzerMode = 'Buzzer';

    let listItm = "<li>";
    var socket = io('/admin');
    sendToggleSingleBuzzStatus();

    socket.on("sde-admin-playersChanged", function (data)
    {
        jQuery('#playerCount').text(data.allPlayers.length);
        let jqList = jQuery("#allPlayersList");
        jqList.empty();

        for (let p in data.allPlayers)
        {
            let player = data.allPlayers[p];
            let playerId = player._id.match('#(.*)')[1];
            jqList.append(jQuery('<li id="' + playerId + '">').html(
                '<span class="buzzerState disabled"><span class="tooltip">Buzzer deaktiviert</span></span>'
                + player.name +
                "<span class='sound'>" + soundEmojis[player.soundIdent] + "</span>"
            ));
            updatePlayerStatus('#'+playerId, player.canBuzz, undefined);
        }
    });

    socket.on('sde-admin-buzzerStateChagned', function(data) {
       
    });

    socket.on('sde-player-buzzstate-updated', function (data) {
        let playerId = data.playerId.match('#.*');
        updatePlayerStatus(playerId[0], data.enabled, data.win);
        
    });

    function updatePlayerStatus(playerId, enabled, win) {
        let playerLi = jQuery(playerId);

        playerLi.removeClass('enabled win lose');
        playerLi.find('.tooltip').text('Buzzer deaktiviert');
        if (enabled || win === true) {
            playerLi.addClass('enabled');
            playerLi.find('.tooltip').text('Buzzer aktiviert');
        }
        if (win === true) {
            playerLi.addClass('win');
            playerLi.find('.tooltip').text('Erster Buzzer!');
        }
        if (win === false) {
            playerLi.addClass('lose');
            playerLi.find('.tooltip').text('Zu spät');
        }
    }

    socket.on("sde-error", function (data)
    {
        console.error("sde error: " + data.error);
    });

    socket.on("sde-player-buzzed", function (data)
    {
        let buzzerValue = data.formattedTime;
        if (data.textInput !== undefined && data.textInput !== '') {
            buzzerValue = data.textInput;
        }
        jQuery("#buzzerOrder").append(
            jQuery(listItm).attr('title', data.formattedTime)
                .append([data.player.name], jQuery('<span class="time">').text(buzzerValue))
        );
    });

    activateButton.on("click", function ()
    {
        activateButton.toggleClass('activate deactivate');
        setActivateButtonText();
        let activate = activateButton.hasClass('deactivate');
        socket.emit("sde-admin-activate", activate, buzzerMode);
        if (activate) {
            $("#preferences :input").prop("disabled", true);
        } else {
            $("#preferences :input").prop("disabled", false);
        }
    });

    jqSingleBuzzCheckbox.on('change', sendToggleSingleBuzzStatus);

    $('input[type=radio][name=buzzerType]').change(function() {
        buzzerMode = this.value;
    });

    function sendToggleSingleBuzzStatus()
    {
        socket.emit("sde-admin-toggleSingleBuzz", {single: jqSingleBuzzCheckbox.is(":checked")});
    }

    function setActivateButtonText() {
        if (activateButton.hasClass('deactivate')) {
            jQuery("#buzzerOrder").html("");
            activateButton.html("Deaktivieren");
        } else {
            activateButton.html("Freischalten");
        }
    }
});