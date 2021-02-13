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

function offsetAnchor() {
    if (location.hash.length !== 0) {
        window.scrollTo(window.scrollX, window.scrollY - 100);
    }
}
$(document).on('click', 'a[href^="#"]', function(event) {
    window.setTimeout(function() {
        offsetAnchor();
    }, 0);
});
window.setTimeout(offsetAnchor, 0);