const links = {
    impostor: {
        name: "Impostor (Serveur Privé)<br/><i>au.floliroy.fr</i>",
        direct: "https://github.com/Impostor/Impostor/releases/download/v1.1.0/Impostor-Client-win-x64.zip",
        versions: {
            name: "GitHub",
            link: "https://github.com/Impostor/Impostor/releases/tag/v1.1.0"
        }
    },
    mumbleWin: {
        name: "Mumble (winhttp.dll)",
        direct: "/winhttp",
        versions: null
    },
    mumbleLog: {
        name: "Mumble (Logiciel)<br/><i>mbl.floliroy.fr</i>",
        direct: "https://www.mumble.info/downloads/windows-64",
        versions: {
            name: "Mumble",
            link: "https://www.mumble.info/downloads/"
        }
    },
    betterCrewLink: {
        name: "BetterCrewLink (Logiciel)<br/><i>bcl.floliroy.fr</i>",
        direct: "https://github.com/OhMyGuus/BetterCrewLink/releases/download/v2.2.3/Better-CrewLink-Setup-2.2.3.exe",
        versions: {
            name: "GitHub",
            link: "https://github.com/OhMyGuus/BetterCrewLink/releases"
        }
    },
    sheriff: {
        name: "Sheriff (Plugin)",
        direct: "/sheriff",
        versions: null
    }
}

module.exports = class AmongUs{

    static getPage(req, res){
        console.log(`${req.headers["x-forwarded-for"] || req.connection.remoteAddress} asked for amongus`)
        res.render("amongus", {layout: "layout",
            links: links,
            theme: req.cookies["theme"] || "black",
            lang: req.cookies["lang"] || "fr"
        })
    }

}