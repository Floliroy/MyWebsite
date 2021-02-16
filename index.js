/**
 * All the libraries
 */
const moment = require('moment')
const fs = require('fs')
const http = require('http')
const https = require('https')
const express = require('express')
const cookieParser = require('cookie-parser')
const handlebars = require('express-handlebars')

/**
 * My own libraries
 */
const AmongUs = require('./modules/amongus')
const Resume = require('./modules/resume')

/**
 * Certificate https
 */
const privateKey = fs.readFileSync('/etc/letsencrypt/live/www.floliroy.fr/privkey.pem', 'utf8')
const certificate = fs.readFileSync('/etc/letsencrypt/live/www.floliroy.fr/cert.pem', 'utf8')
const ca = fs.readFileSync('/etc/letsencrypt/live/www.floliroy.fr/chain.pem', 'utf8')
const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
}

/**
 * Setup the handlebars lib
 */
const app = express()
app.use(cookieParser())
app.set("view engine", "handlebars")
app.engine("handlebars", handlebars({
    layoutsDir: __dirname + "/views/layouts/",
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
    if(page != "error"){
        console.log(`${req.headers["x-forwarded-for"] || req.connection.remoteAddress} asked for ${page}`)
    }

    res.render(page, {layout: "layout",
        theme: req.cookies["theme"] || "black",
        lang: req.cookies["lang"] || "fr"
    })
}

app.get("/", function(req, res){
    getPage("index", req, res)
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
 * Téléchargement 
 */
app.get("/winhttp", function(req, res){
    res.download(__dirname + "/public/ressources/winhttp.dll")
})
app.get("/sheriff", function(req, res){
    res.download(__dirname + "/public/ressources/AmongUs_SheriffMod.zip")
})
/**
 * For https
 */
app.get("/.well-known/acme-challenge/t00YZa5Dzvgq20zsQd1xLOj6nT9iNzbyNexe6LmEEK8", function(req, res){
    res.download(__dirname + "/.well-known/acme-challenge/t00YZa5Dzvgq20zsQd1xLOj6nT9iNzbyNexe6LmEEK8")
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
http.get('*', function(req, res) { 
    res.redirect('https://' + req.headers.host + req.url);
})
app.use(express.static("public"))
app.use(function (req, res){
	res.status(404)
    res.redirect("error")
})
const httpServer = http.createServer(app)
httpServer.listen(8080, function(){
    console.log("Server running on port 8080!")
})
const httpsServer = https.createServer(credentials, app)
httpsServer.listen(8443, function(){
    console.log("Server running on port 8443!")
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