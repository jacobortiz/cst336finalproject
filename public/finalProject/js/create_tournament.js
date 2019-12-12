$(document).ready(function() {

    $('#amount').change(function() { 
        var value = $(this).val();
        add_match_boxes();
    });

    function add_match_boxes() {
        $(".mb").remove();
        let amount = $('#amount').val()/2;
        for (let i = 0; i < amount; i++) {
            $("#tc-modal-body").append("<div class='form-group mb'><label for='mb-" + (i + 1) + "'>Match " + (i + 1) + "</label><input type='text' class='form-control' id='mb-" + (i + 1) + "-1' placeholder='Participant 1'><input type='text' class='form-control tp' id='mb-" + (i + 1) + "-2' placeholder='Participant 2'></div>");
        }
    }

    function check_entries() {

        let title = $("#t-title").val();
        if (title == "") {
            alert_modal("Error: No title entered!");
            return false;
        }

        let zip = $("#t-zip").val();
        if (zip == "") {
            alert_modal("Error: no zip entered!")
            return false
        }

        let amount = $('#amount').val()/2;

        for (let i = 1; i <= amount; i++ ) {
            let Participant1 = $('#mb-' + i + "-1").val();
            let Participant2 = $('#mb-' + i + "-2").val();

            if (Participant1 == "") {
                alert_modal("Error: P1 missing for match " + i + "!");
                return false;
            }

            if (Participant2 == "") {
                alert_modal("Error: P2 missing for match " + i + "!");
                return false;
            }
        }
        

        return true;
    }

    //  3  2  1  winner
    //  -
    //  -  -  _  _
    //  -  -
    //  -
    function get_data() {
        let title = $("#t-title").val();
        let zip = $("#t-zip").val();        
        let amount = $('#amount').val();
        let levels = 0;

        if (amount == 16) {
            levels = 4;
        } else if (amount == 8) {
            levels = 3;
        } else if (amount == 4) {
            levels = 2;
        }

        let match_count = amount/2;
        let matches = [];

        for (let i = 1; i <= match_count; i++ ) {
            let Participant1 = $('#mb-' + i + "-1").val();
            let Participant2 = $('#mb-' + i + "-2").val();

            matches.push([Participant1, Participant2]);
        }

        data = {
            title: title,
            zip: zip,
            levels: levels,
            matches: matches
        }

        console.log(data);

        return data;
    }

    function submit_tournament() {
        check_entries();
        data = get_data();
        
        $.ajax({
            type: "POST",
            url: "/finalProject/create_tournament",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(result, status) {
                console.log("Success ", result)
                if (!result.successful) {
                    alert_modal(result.message, "warning");
                } else {
                    alert_modal("Success", "success");
                }
            },
            error: function(xhr, status, error) {
                err = eval("error: (" + xhr.responseText + ")");
                console.error(err);
            }
        });
    }

    function alert_modal(text, type) {
        hide_alerts();
        if (type == "warning") {
            $('#t-s-alert').text(text);
            $("#t-s-alert").show();
        } else {
            $('#t-w-alert').text(text);
            $("#t-w-alert").show();
        }
    }

    function hide_alerts() {
        $("#t-w-alert").hide();
        $("#t-s-alert").hide();
    }

    $("#t-submit").on("click", submit_tournament);

    add_match_boxes();

});