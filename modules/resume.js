const skills = new Array(
    {fr: "Informatique (Logiciel)", en: "Cumputer Science", level: 5},
    {fr: "Informatique (Données)", en: "Data Processing", level: 4},
    {fr: "Électronique", en: "Electronic", level: 3},
    {fr: "Réseaux et Télécoms", en: "Networks and Telecoms", level: 2},
    {fr: "Anglais", en: "English", level: 4}
)
const softwares = new Array(
    {name: "VisualStudio Code", level: 5},
    {name: "Eclipse", level: 5},
    {name: "Oracle", level: 4},
    {name: "Arduino", level: 2},
    {name: "Looping", level: 3},
)
const technologies = new Array(
    {name: "Git", level: 4},
    {name: "PL/SQL", level: 4},
    {name: "Spring", level: 2},
    {name: "NodeJS", level: 5},
    {name: "WSL", level: 3},
)

module.exports = class Resume{

    static getPage(req, res){
        console.log(`${req.headers["x-forwarded-for"] || req.connection.remoteAddress} asked for resume`)
        res.render("resume", {layout: "layout",
            skills: skills,
            softwares: softwares,
            technologies: technologies,
            helpers: {
                printLevel: function(level){
                    let levels = `<span class="right">`
                    for(let i=0 ; i<level ; i++){
                        levels += `<span class="dot red"></span>` 
                    }
                    for(let i=0 ; i<5-level ; i++){
                        levels += `<span class="dot white"></span>` 
                    }
                    return levels + `</span>`
                },
                getAge: function(){
                    const birthday = new Date("1998-07-08")
                    const ageDate = new Date(new Date() - birthday)
                    return ageDate.getFullYear() - 1970
                }
            },
            theme: req.cookies["theme"] || "black",
            lang: req.cookies["lang"] || "fr"
        })
    }

}