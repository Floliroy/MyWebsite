/**
 * Function to switch theme with ajax method
 */
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

/**
 * Function to replace when clicking on anchor
 */
function offsetAnchor() {
    if (location.hash.length !== 0) {
        window.scrollTo(window.scrollX, window.scrollY - 100)
    }
}
$(document).on('click', 'a[href^="#"]', function(event) {
    window.setTimeout(function() {
        offsetAnchor()
    }, 0)
})
window.setTimeout(offsetAnchor, 0)

/**
 * Set page transition
 */
$(function(){
    "use strict"
    var smoothState = $("#smoothState"),
    options = {
        prefetch: true,
        cacheLength: 3,
        scroll: true,
        blacklist: "img",
        onStart: {
            duration: 250,
            render: function ($container) {
                $container.addClass("is-exiting")
            }
        },
        onReady: {
            duration: 0,
            render: function ($container, $newContent) {
                $container.removeClass("is-exiting")
                $container.html($newContent)
            }
        }
    },
    smoothState = smoothState.smoothState(options).data("smoothState")
})


/**
 * Function to ask for a server name
 */
function askForServer(event, elem){
    if(event.keyCode != 13) return
    console.log("OUI")    
    $.ajax({
        method: "POST",
        url: elem.id,
        data: {
            password: elem.value
        },
        success: function(retour, _) {
            console.log(retour)
            alert(retour)
        }
    })    
}