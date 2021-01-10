/**
 * All the libraries
 */
const moment = require('moment')
const express = require('express')
const cookieParser = require('cookie-parser')
const handlebars = require('express-handlebars')

/**
 * Setup the handlebars lib
 */
const app = express()
app.use(cookieParser())
app.set("view engine", "handlebars")
app.engine("handlebars", handlebars({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials/",
    helpers: {
        ifEquals: function(val1, val2, options){
            return val1 == val2 ? options.fn(this) : options.inverse(this)
        }
    }
}))

/**
 * Pages
 */
function getPage(page, req, res){
    res.render(page, {layout: "index",
        theme: req.cookies["theme"] || "black",
        lang: req.cookies["lang"] || "fr"
    })
}

app.get("/", function(req, res){
    getPage("main", req, res)
})
app.get("/resume", function(req, res){
    getPage("resume", req, res)
})
app.get("/amongus", function(req, res){
    getPage("amongus", req, res)
})

/**
 * Téléchargement 
 */
app.get("/winhttp", function(req, res){
    res.download(__dirname + "/public/ressources/winhttp.dll")
})

/**
 * Gestion des cookies
 */
app.get("/switchTheme", function(req, res){
    res.cookie("theme", !req.cookies["theme"] || req.cookies["theme"] == "black" ? "white" : "black")
    res.redirect(req.header("Referrer"))
})
app.get("/switchLang", function(req, res){
    res.cookie("lang", req.query.lang)
    res.redirect(req.header("Referrer"))
})

/**
 * Start server
 */
app.use(express.static("public"))
app.listen(8000, function(){
    console.log("Server running on port 8000!")
})

/**
 * Add date to console.log
 */
const basicConsole = console.log
console.log = function(){
    const date = `[${moment(new Date()).format("DD/MM/yyyy - HH:mm:ss")}]`
    Array.prototype.unshift.call(arguments, date)
    basicConsole.apply(this, arguments)
}