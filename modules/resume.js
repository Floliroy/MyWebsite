const skills = new Array(
    {fr: "Développement back-end", en: "Back-end Dev", level: 4},
    {fr: "Développement full-stack", en: "Full-stack Dev", level: 3},
    {fr: "Gestion de projets", en: "Project Management", level: 3},
    {fr: "NodeJS", en: "NodeJS", level: 4},
    {fr: "Java Spring", en: "Java Spring", level: 3},
    {fr: "SQL", en: "SQL", level: 3}
)
const softwares = new Array(
    {name: "VS Code", level: 4},
    {name: "Eclipse", level: 4},
    {name: "Oracle", level: 3},
    {name: "Arduino", level: 2},
    {name: "Looping", level: 3},
)

module.exports = class Resume{

    static getPage(req, res){
        console.log(`${req.headers["x-forwarded-for"] || req.connection.remoteAddress} asked for resume`)

        const birthday = new Date("1998-07-08")
        const ageDate = new Date(new Date() - birthday)

        res.render("partials/layout", {body: "resume",
            skills: skills,
            softwares: softwares,
            age: ageDate.getFullYear() - 1970,
            theme: req.cookies["theme"] || "black",
            lang: req.cookies["lang"] || "fr",
            version: require("../package.json").version
        })
    }

}