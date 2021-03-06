const links = {
    impostor: {
        name: "Impostor<br/>(Serveur Privé)",
        direct: "https://github.com/Impostor/Impostor/releases/download/v1.1.0/Impostor-Client-win-x64.zip",
        versions: {
            name: "GitHub",
            link: "https://github.com/Impostor/Impostor/releases/tag/v1.1.0"
        },
        server: "/impostor"
    },
    mumbleWin: {
        name: "Mumble<br/>(winhttp.dll)",
        direct: "/winhttp",
        versions: null,
        server: null
    },
    mumbleLog: {
        name: "Mumble<br/>(Logiciel)",
        direct: "https://www.mumble.info/downloads/windows-64",
        versions: {
            name: "Mumble",
            link: "https://www.mumble.info/downloads/"
        },
        server: "/mumble"
    },
    betterCrewLink: {
        name: "BetterCrewLink<br/>(Logiciel)",
        direct: "https://github.com/OhMyGuus/BetterCrewLink/releases/download/v2.2.3/Better-CrewLink-Setup-2.2.3.exe",
        versions: {
            name: "GitHub",
            link: "https://github.com/OhMyGuus/BetterCrewLink/releases"
        },
        server: "/bettercrewlink"
    },
    sheriff: {
        name: "Sheriff<br/>(Plugin)",
        direct: "/sheriff",
        versions: null,
        server: null
    }
}

module.exports = class AmongUs{

    static getPage(req, res){
        console.log(`${req.headers["x-forwarded-for"] || req.connection.remoteAddress} asked for amongus`)
        res.render("partials/layout", {body: "amongus",
            links: links,
            theme: req.cookies["theme"] || "black",
            lang: req.cookies["lang"] || "fr",
            version: require("../package.json").version
        })
    }

}