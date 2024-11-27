require('dotenv').config()
/**
 * All the libraries
 */
const moment = require('moment')
const express = require('express')
const cookieParser = require('cookie-parser')
const turbolinks = require('turbolinks-express')

/**
 * My own libraries
 */
const AmongUs = require('./modules/amongus')
const Resume = require('./modules/resume')
const PrintTftPlayers = require('./modules/printTftPlayers')

/**
 * Setup the express lib
 */
const app = express()
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.set("view engine", "ejs")

/**
 * Pages
 */
function getPage(page, req, res){
    if(page != "error"){
        console.log(`${req.headers["x-forwarded-for"] || req.connection.remoteAddress} asked for ${page}`)
    }

    res.render("partials/layout", {body: page,
        theme: req.cookies["theme"] || "black",
        lang: req.cookies["lang"] || "fr",
        version: require("./package.json").version
    })
}

app.get("/home", function(req, res){
    getPage("index", req, res)
})
app.get("/printTftPlayers", function(req, res){
    getPage("printTftPlayers", req, res)
})
app.get("/", function(req, res){
    getPage("portfolio", req, res)
})
app.get("/resume", function(req, res){
    Resume.getPage(req, res)
})
app.get("/amongus", function(req, res){
    AmongUs.getPage(req, res)
})
app.get("/error", function(req, res){
    getPage("error", req, res)
})

/**
 * Server ask
 */
function checkPassword(req, res){
    if(req.body.password == process.env.PASSWORD){
        return true
    }
    res.send("Mauvais mot de passe")
    return false
}
app.post("/impostor", function(req, res){
    if(checkPassword(req, res)){
        res.send(`Serveur : ${process.env.IMPOSTOR_SERVER}`)
    }
})
app.post("/mumble", function(req, res){
    if(checkPassword(req, res)){
        res.send(`Serveur : ${process.env.MUMBLE_SERVER}\nMot de passe : ${process.env.PASSWORD}`)
    }
})
app.post("/bettercrewlink", function(req, res){
    if(checkPassword(req, res)){
        res.send(`Serveur : ${process.env.BCL_SERVER}`)
    }
})
app.post("/printTftPlayers", function(req, res){
    PrintTftPlayers.getList(req, res).catch(function(err){})
})

/**
 * Téléchargement 
 */
app.get("/winhttp", function(req, res){
    res.download(__dirname + "/public/ressources/winhttp.dll")
})
app.get("/sheriff", function(req, res){
    res.download(__dirname + "/public/ressources/AmongUs_SheriffMod.zip")
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
app.use(function (req, res){
	res.status(404)
    res.redirect("error")
})
app.use(turbolinks.redirect)
app.use(turbolinks.location)
app.listen(8080, function(){
    console.log("Server running on port 8080!")
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