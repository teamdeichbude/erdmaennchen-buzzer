jQuery(window).on("ready", function() {
    jQuery("#setname").on("click", function(){
        let name = jQuery("#playername").text();

        jQuery.ajax({
            type: "POST",
            url: "localhost:3000",
            data: {testmsg: "testest", teamname: name},
            success: function(event, res) {
                console.log(event,res);
            },
            dataType: "JSON"
          });
    });
});