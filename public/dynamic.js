function switchTheme(){
    const actualTheme = document.body.classList.contains("blackTheme") ? "blackTheme" : "whiteTheme"
    $.ajax({
        method: "GET",
        url: "/switchTheme",
        success: function() {
            document.body.classList.remove(actualTheme)
            document.body.classList.add(actualTheme == "blackTheme" ? "whiteTheme" : "blackTheme")

            document.getElementById("theme").src = actualTheme == "blackTheme" ? "./images/moon.png" : "./images/sun.png"
        }
    })
}

$(document).ready(function(){
    for(let div of document.getElementsByTagName("div")){
        if(!div.id.startsWith("more-")){
            div.onclick = function(){
                $(`#more-${div.id}`).toggle()
            }
        }else{
            $(`#${div.id}`).hide()
        }
    }
})