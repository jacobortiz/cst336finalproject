$(document).ready(function() {

    $('#amount').change(function() { 
        var value = $(this).val();
        add_match_boxes();
    });

    $('#e-amount').change(function() { 
        var value = $(this).val();
        e_add_match_boxes();
    });

    function add_match_boxes() {
        $(".mb").remove();
        let amount = $('#amount').val()/2;
        for (let i = 0; i < amount; i++) {
            $("#tc-modal-body").append("<div class='form-group mb'><label for='mb-" + (i + 1) + "'>Match " + (i + 1) + "</label><input type='text' class='form-control' id='mb-" + (i + 1) + "-1' placeholder='Participant 1'><input type='text' class='form-control tp' id='mb-" + (i + 1) + "-2' placeholder='Participant 2'></div>");
        }
    }

    function e_add_match_boxes() {
        $(".e-mb").remove();
        let amount = $('#e-amount').val()/2;
        for (let i = 0; i < amount; i++) {
            $("#te-modal-body").append("<div class='form-group e-mb'><label for='e-mb-" + (i + 1) + "'>Match " + (i + 1) + "</label><input type='text' class='form-control' id='e-mb-" + (i + 1) + "-1' placeholder='Participant 1'><input type='text' class='form-control tp' id='e-mb-" + (i + 1) + "-2' placeholder='Participant 2'></div>");
        }
    }

    function check_entries() {

        let title = $("#t-title").val();
        if (title == "") {
            alert_modal("Error: No title entered!", "warning");
            return false;
        }

        let zip = $("#t-zip").val();
        if (zip == "") {
            alert_modal("Error: no zip entered!", "warning")
            return false
        }

        let amount = $('#amount').val()/2;

        for (let i = 1; i <= amount; i++ ) {
            let Participant1 = $('#mb-' + i + "-1").val();
            let Participant2 = $('#mb-' + i + "-2").val();

            if (Participant1 == "") {
                alert_modal("Error: P1 missing for match " + i + "!", "warning");
                return false;
            }

            if (Participant2 == "") {
                alert_modal("Error: P2 missing for match " + i + "!", "warning");
                return false;
            }
        }

        return true;
    }

    function e_check_entries() {

        let title = $("#te-title").val();
        if (title == "") {
            e_alert_modal("Error: No title entered!", "warning");
            return false;
        }

        let zip = $("#te-zip").val();
        if (zip == "") {
            e_alert_modal("Error: no zip entered!", "warning")
            return false
        }

        let amount = $('#e-amount').val()/2;

        for (let i = 1; i <= amount; i++ ) {
            let Participant1 = $('#e-mb-' + i + "-1").val();
            let Participant2 = $('#e-mb-' + i + "-2").val();

            if (Participant1 == "") {
                e_alert_modal("Error: P1 missing for match " + i + "!", "warning");
                return false;
            }

            if (Participant2 == "") {
                e_alert_modal("Error: P2 missing for match " + i + "!", "warning");
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

    function e_get_data() {
        let title = $("#te-title").val();
        let zip = $("#te-zip").val();        
        let amount = $('#e-amount').val();
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
            let Participant1 = $('#e-mb-' + i + "-1").val();
            let Participant2 = $('#e-mb-' + i + "-2").val();

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
        ready = check_entries();

        if (!ready) {
            return;
        }
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

    function submit_tournament_edit() {
        ready = e_check_entries();

        if (!ready) {
            return;
        }
        data = e_get_data();

        console.log(data);
        
        $.ajax({
            type: "POST",
            url: "/finalProject/edit_tournament",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(result, status) {
                console.log("Success ", result)
                if (!result.successful) {
                    e_alert_modal(result.message, "warning");
                } else {
                    e_alert_modal("Success", "success");
                }
            },
            error: function(xhr, status, error) {
                err = eval("error: (" + xhr.responseText + ")");
                console.error(err);
            }
        });
    }

    function delete_tournament() {

        let title = $("#td-question").text();

        $.ajax({
            type: "POST",
            url: "/finalProject/delete_tournament",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                title: title
            }),
            success: function(result, status) {
                location.reload(true); 
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
            $('#t-w-alert').text(text);
            $("#t-w-alert").show();
        } else {
            $('#t-s-alert').text(text);
            $("#t-s-alert").show();
            setTimeout(function () { 
                location.reload(true); 
            }, 2000);
        }
    }

    function e_alert_modal(text, type) {
        e_hide_alerts();
        if (type == "warning") {
            $('#te-w-alert').text(text);
            $("#te-w-alert").show();
        } else {
            $('#te-s-alert').text(text);
            $("#te-s-alert").show();
            setTimeout(function () { 
                location.reload(true); 
            }, 2000);
        }
    }

    function hide_alerts() {
        $("#t-w-alert").hide();
        $("#t-s-alert").hide();
    }

    function e_hide_alerts() {
        $("#te-w-alert").hide();
        $("#te-s-alert").hide();
    }

    $("#t-submit").on("click", submit_tournament);
    $("#te-submit").on("click", submit_tournament_edit);
    $("#td-cd").on("click", delete_tournament);

    add_match_boxes();
    e_add_match_boxes();

});

function edit(title) {
    console.log(title);
    $('#te-title').val(title)
    $('#editTournamentModal').modal('show');
}

function del(title) {
    $('#td-question').text(title)
    $('#deleteTournamentModal').modal('show');
}