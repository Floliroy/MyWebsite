/**
 * Set page transition
 */
let loader = $(".loader")
//Function at beginning of page change
function loaderIn(namespace) {
    return gsap.fromTo(loader,
        {
            rotation: namespace == "home" ? 30 : -30,
            scaleX: 0,
            xPercent: -5
        },
        {
            duration: 0.8,
            xPercent: 0,
            scaleX: 1,
            rotation: 0,
            ease: "power4.inOut",
            transformOrigin: `${namespace == "home" ? "right" : "left"} center`
        })
}
//Function at end of page change
function loaderAway(namespace) {
    return gsap.to(loader, {
        duration: 0.8,
        scaleX: 0,
        xPercent: namespace == "home" ? -5 : 5,
        rotation: namespace == "home" ? -30 : 30,
        transformOrigin: `${namespace == "home" ? "left" : "right"} center`,
        ease: "power4.inOut"
    })
}
//Init of page change div animation
gsap.set(loader, {
    scaleX: 0,
    rotation: -30,
    xPercent: -5,
    yPercent: 50,
    transformOrigin: "left center",
    autoAlpha: 1
})
barba.hooks.enter(function(){
    window.scrollTo(window.scrollX, 0)
})
//Barba init
barba.init({
    transitions: [{
        name: "default",
        async leave() {            
            $(".loader").css("background-image", `url("../images/transition${$("body").hasClass("blackTheme")?"Black":"White"}.png")`)
            await loaderIn("default")
        },
        enter() {
            loaderAway("default")
        }
    },{
        name: "home",
        to: {
            namespace: ["index"]
        },
        async leave() {
            $(".loader").css("background-image", `url("../images/transition${$("body").hasClass("blackTheme")?"Black":"White"}Reverse.png")`)
            await loaderIn("home")
        },
        enter() {
            loaderAway("home")
        }
    }]
})