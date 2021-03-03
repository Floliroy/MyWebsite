function removeOtherForm(caller){
    $("input[type=text]").not(`#${caller.id}`).val("")
    if(caller.id != "separator"){
        $("#namesList").val("")
    }
}

function removeOtherFormTextArea(){
    $("input[type=text]").not(`#separator`).val("")
}

$("input[type=button]").click(function(){
    $.ajax({
        method: "POST",
        url: "printTftPlayers",
        data: $("form").serialize(),
        success: function(retour, _) {
            $("#main").html(retour)
        }
    })
    $("#main").html("Chargement")
})