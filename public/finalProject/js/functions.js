$(document).ready(function() {
    $("#search-field").focus();
});

// Close when the user clicks anywhere outside of the modal
var login_modal = document.getElementById("loginForm");
var create_account_modal = document.getElementById("createAccountForm");

// window.onclick = function(event) {
//     if (event.target == login_modal) {
//         login_modal.style.display = "none";
//     }
    
//     if (event.target == create_account_modal) {
//         create_account_modal.style.display = "none";
//     }
// };

$("#search-button").on("click", function (){
  
    if($("#search-field").val() == "") {
         $(`<div class="alert alert-danger mt-3" 
                style="width: 100%; text-align: center">
                    "Please fill empty fields"
           </div>`).appendTo(".container-fluid"); 
        return;
    }
    
    if ($("#searchBy").val() == "") {
        $(`<div class="alert alert-danger mt-3" 
                style="width: 100%; text-align: center">
                    "Please fill field: Search By..."
           </div>`).appendTo(".container-fluid"); 
        return;
    }
    
    $.ajax({
        type: "POST",
        url: "/finalProject/find_tournament",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
             "keyword": $("#search-field").val(),
            "searchBy": $("#searchBy").val()
        }),
        success: function(result, status) {
            document.querySelector('#search-field').value = '';
            $("#searchBy").prop('selectedIndex', 0);
            $(".container-fluid").empty();
            
            if(result.tournament.length == 0) {
                $(`<div class="alert alert-danger mt-3" 
                        style="width: 100%; text-align: center">
                            "No results found :^("
                   </div>`).appendTo(".container-fluid"); 
                return;
            }
            
            //set quotes table head
            $(`<div class="table-row header" style="background: #2196F3">
                  <div class="text" style="width: 20%">Tournament Name</div>
                  <div class="text" style="width: 20%">Tournament Manager</div>
                  <div class="text" style="width: 20%">Tournament Location</div>
                  <div class="text" style="width: 20%">Tournament Created</div>
                  <div class="text" style="width: 20%">Views</div>
              </div>`).appendTo(".container-fluid"); 
            
            //populate quotes table
            for (let i = 0; i < result.tournament.length; i++) {
                $.ajax({
                    url: 'https://form-api.com/api/geo/country/zip',
                    type: "get",
                    data: {
                            key: "trupnRbwQSI582Sltys7",
                        country: "US",
                        zipcode: result.tournament[i].zip,
                    },
                    success: function(response) {
                        $(`<div class="table-row" style="background: white">
                        <div id="tournamentName" class="text" style="width: 20%; color: black">
                            ${result.tournament[i].title}
                        </div>
                            <div class="text" style="width: 20%; color: black">${result.tournament[i].fullName}</div>
                            <div class="text" style="width: 20%; color: black">${response.result.city}</div>
                            <div class="text" style="width: 20%; color: black">${result.tournament[i].created.split("T", 1)}</div>
                            <div class="text" style="width: 20%"> <button class="btn-primary" onclick="window.location.href = './bracketing?title=${result.tournament[i].title.replace(" ", "%20")}'">View</button></div>
                        </div>`).appendTo(".container-fluid"); 
                    },
                    error: function(xhr) {
                        console.log("AJAX Request couldn't be fulfilled!", xhr);
                    }
                });
            }
        },
        error: function(xhr, status, error) {
            error = eval("error: (" + xhr.responseText + ")");
            console.error(error);
        }
    });
    
    return;
});

$('#submit-login-button').on('click', function(e) {
    e.preventDefault();
    
    $.ajax({
        type: "POST",
        url: "/finalProject/login",
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
            error = eval("error: (" + xhr.responseText + ")");
            console.error(error);
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
                alert("Account Created");
                window.location.href = '/finalProject';
            }
            else {
                // Show an error message or something and stay here
                alert(result.message);
            }
        },
        error: function(xhr, status, error) {
            error = eval("error: (" + xhr.responseText + ")");
            console.error(error);
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
});


