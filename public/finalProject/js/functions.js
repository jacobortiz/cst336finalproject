$(document).ready(function() {
    $("#search-field").focus();
});

// Close when the user clicks anywhere outside of the modal
var login_modal = document.getElementById("loginForm");
var create_account_modal = document.getElementById("createAccountForm");

window.onclick = function(event) {
    if (event.target == login_modal) {
        login_modal.style.display = "none";
    }
    
    if (event.target == create_account_modal) {
        create_account_modal.style.display = "none";
    }
};


// array used as an example, data will come from a DB
let tournaments = [{name: "Mortal Kombat",
                    tournamentManager: "Shao Kahn",
                    numOfPlayers: 12},
                   {name: "Super Smash Bros.",
                    tournamentManager: "Mario",
                    numOfPlayers: 8}, 
                   {name: "Street Fighter",
                    tournamentManager: "Ryu",
                    numOfPlayers: 14}, 
                   {name: "Mario Kart",
                    tournamentManager: "Wario",
                    numOfPlayers: 7}];

function search() {
    
    $(".container-fluid").empty();
            
    let keyword = $("#search-field").val();
  
    if(keyword == "") {
        alert("Please fill in empty fields");
        return;
    }
  
    $(`<div class="table-row header" style="background: #2196F3">
            <div class="text" style="width: 20%">Tournament Name</div>
            <div class="text" style="width: 20%">Tournament Manager</div>
            <div class="text" style="width: 60%">Number of Players</div>
       </div>`).appendTo(".container-fluid"); 
    
    for (let i = 0; i < tournaments.length; i++) {
        if (tournaments[i].name.includes(keyword)) {
            $(`<div class="table-row">
                    <div id="tournamentName" class="text" style="width: 20%; color: white">
                        ${tournaments[i].name}
                    </div>
                    <div class="text" style="width: 20%; color: white">${tournaments[i].tournamentManager}</div>
                    <div class="text" style="width: 60%; color: white">${tournaments[i].numOfPlayers}</div>
               </div>`).appendTo(".container-fluid"); 
        }
    }
  
    if ($(".table-row").text().length == 0) {
        $("Tournament not found! :^(").appendTo(".container-fluid");
    }
    
    return;
}
           
$('#submit-login-button').on('click', function(e) {
    e.preventDefault();
    
    $.ajax({
        type: "POST",
        url: "/finalProject",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            "username": $("#LI_username").val(),
            "password": $("#LI_password").val()
        }),
        success: function(result, status) {
            console.log("got login status back", result);
            if (result.successful) {
                window.location.href = '/finalProject/admin';
            }
            else {
                // Show an error message or something and stay here
                alert(result.message);
            }
        },
        error: function(xhr, status, error) {
            err = eval("error: (" + xhr.responseText + ")");
            console.error(err);
        },
        complete: function(data, status) { //optional, used for debugging purposes
            console.log(status);
        }
    });
});

$('#create-account-button').on('click', function(e) {
    e.preventDefault();
    
    $.ajax({
        type: "POST",
        url: "/finalProject/create_account",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
               "fname": $("#CA_fname").val(),
               "lname": $("#CA_lname").val(),
                 "age": $("#CA_age").val(),
            "username": $("#CA_username").val(),
            "password": $("#CA_password").val()
        }),
        success: function(result, status) {
            console.log("got login status back", result);
            if (result.successful) {
                window.location.href = '/finalProject';
            }
            else {
                // Show an error message or something and stay here
                alert(result.message);
            }
        },
        error: function(xhr, status, error) {
            err = eval("error: (" + xhr.responseText + ")");
            console.error(err);
        },
        complete: function(data, status) { //optional, used for debugging purposes
            console.log(status);
        }
    });
});

$('#logout-button').on('click', function(e) {
    // Do not submit until I am ready
    e.preventDefault();
    
    $.ajax({
        type: "GET",
        url: "/finalProject/logout",
        dataType: "json",
        success: function(result, status) {
            console.log("got logout status back", result);
            if (result.successful) {
                // This will navigate to wherever i say...
                window.location.href = '/finalProject';
            }
            else {
                // Show an error message or something and stay here
                alert(result.message);
            }
        },
        error: function(xhr, status, error) {
            err = eval("error: (" + xhr.responseText + ")");
            console.error(err);
        },
        complete: function(data, status) { //optional, used for debugging purposes
            console.log(status);
        }
    });
})


