function removeOtherForm(caller){
    $("input[type=text]").not(`#${caller.id}`).val("")
    if(caller.id != "separator"){
        $("#namesList").val("")
    }
}

function removeOtherFormTextArea(){
    $("input[type=text]").not(`#separator`).val("")
}


$("#loading").hide()
$("#response").hide()
$("input[type=button]").click(function(){
    $.ajax({
        method: "POST",
        url: "printTftPlayers",
        data: $("form").serialize(),
        success: function(response) {
            $("#loading").hide()
            $("#response").html(response)
            $("#response").show()
        },
        error : function(xhr, ajaxOptions, thrownError){
            $("#loading").hide()
            $("#response").html(`<span class="right"><button id="#retour" onclick="retour()">Retour</button></span><h1>${xhr.responseText}</h1>`)
            $("#response").show()
        }
    })
    $("form").hide()
    $("#loading").show()
})

function retour(){
    $("input[type=text]").val("")
    $("#namesList").val("")
    $("form").show()
    $("#loading").hide()
    $("#response").hide()
}