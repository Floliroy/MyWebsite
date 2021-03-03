const {Tft} = require('riotgames-gg')
const tft = new Tft({ region: "EUW", apikey: process.env.RIOT_TOKEN})

const axios = require('axios')
const battlefy = require('battlefy-api')

Map.prototype.getPoints = function(name){
    for(let elem of this.values()){
        if(elem.name == name){
            return elem.points
        }
    }
}
Map.prototype.getByPoints = function(points){
    if(points >= 2400) return {name:"M/GM/Chall", points:2400}

    const incr = this == tierShortcuts ? 400 : 100
    for(let elem of this.values()){
        if(elem.points <= points && elem.points + incr > points){
            return elem
        }
    }
}
Array.prototype.orderByElo = function(){
    this.sort(function(a, b){
        return getEloByRank(b.rank) - getEloByRank(a.rank)
    })
}

/**
 * Const for the tiers and ranks
 */
const tierShortcuts = new Map()
tierShortcuts.set("CHALLENGER", {name: "Chall", points:2400})
tierShortcuts.set("GRANDMASTER",{name: "GM",    points:2400})
tierShortcuts.set("MASTER",     {name: "Master",points:2400})
tierShortcuts.set("DIAMOND",    {name: "D",     points:2000})
tierShortcuts.set("PLATINUM",   {name: "P",     points:1600})
tierShortcuts.set("GOLD",       {name: "G",     points:1200})
tierShortcuts.set("SILVER",     {name: "S",     points:800})
tierShortcuts.set("BRONZE",     {name: "B",     points:400})
tierShortcuts.set("IRON",       {name: "F",     points:0})
const rankShortcuts = new Map()
rankShortcuts.set("I",  {name: "1", points:300})
rankShortcuts.set("II", {name: "2", points:200})
rankShortcuts.set("III",{name: "3", points:100})
rankShortcuts.set("IV", {name: "4", points:0})

/** Check if the tier is master or further */
function isMasterPlus(tier){
    return tier == "CHALLENGER" || tier == "GRANDMASTER" || tier == "MASTER" || 
        tier == "Chall" || tier == "GM" || tier == "Master" || tier == "M/GM/Chall"
}
/** Transform text rank to a number elo */
function getEloByRank(rank){
    const args = rank.split(" ")
    const tier = args[0].replace(/\d+/g,'')
    const lps = parseInt(args[1].replace(/\D/g,''))

    if(isMasterPlus(tier)){
        return tierShortcuts.getPoints(tier) + lps
    }else{
        const rank = args[0].replace(/\D/g,'')
        return tierShortcuts.getPoints(tier) + rankShortcuts.getPoints(rank) + lps
    }
}
/** Transform number elo to a text rank */
function getRankByElo(elo){
    const tier = tierShortcuts.getByPoints(elo)
    
    if(isMasterPlus(tier.name)){
        return `${tier.name} ${elo - tier.points}LP`
    }else{
        const rank = rankShortcuts.getByPoints(elo - tier.points)
        return `${tier.name}${rank.name} ${elo - tier.points - rank.points}LP`
    }
}

/** Get TFT info about a summoner */
async function getTftSummonerByName(name) {
    let redo
    do{
        redo = false
        try{
            const response = await tft.League.entriesByName(encodeURI(name))
            const summoner = response[0]
            
            const div = isMasterPlus(summoner.tier) ? "" : rankShortcuts.get(summoner.rank).name
            const rank = `${tierShortcuts.get(summoner.tier).name}${div} ${summoner.leaguePoints}LP`
            const games = summoner.wins + summoner.losses
            return {name: name, games: games, rank: rank}
        }catch(err){
            if(!err.response || err.response.status != 429){
                return null
            }else{
                redo = true
            }
        }  
    }while(redo)
}

module.exports = class PrintTftPlayers{

    static async getList(req, res){
        let summonersList = new Array()
        if(req.body.cooldownLink || req.body.cooldownId){
            const id = req.body.cooldownId ? req.body.cooldownId : new URL(req.body.cooldownLink).pathname.split("/")[3]
            const datas = await battlefy.getTournamentTeams(id)
            for await(let data of datas){
                summonersList.push(data.players[0].inGameName)
            }
        }else if(req.body.pcsLink || req.body.pcsId){
            const id = req.body.pcsId ? req.body.pcsId : new URL(req.body.pcsLink).pathname.split("/")[3]
            const datas = await axios.get(`https://api.toornament.com/viewer/v2/tournaments/${id}/participants`, {
                headers: {
                    "X-Api-Key": `${process.env.TOORNAMENT_TOKEN}`,
                    "Range": "participants=0-49"
                }
            })
            for await(let data of datas.data){
                summonersList.push(data.custom_fields.summoner_player_id)
            }
        }else if(req.body.namesList && req.body.separator){
            summonersList = req.body.namesList.split(req.body.separator)
        }else{
            return
        }

        let players = new Array()
        let playersNotFound = new Array()
        for await(const name of summonersList){
            const player = await getTftSummonerByName(name)
            console.log(player)
            if(player != null){
                players.push(player)
            }else{
                playersNotFound.push({name: name})
            }
        }
        players.orderByElo()

        let eloTotal = 0
        for(let player of players){
            eloTotal += getEloByRank(player.rank)
        }
        const eloMoy = getRankByElo(Math.round(eloTotal / players.length))
        res.render("pages/printTftPlayersResponse", {
            players: players,
            playersNotFound: playersNotFound,
            eloMoy: eloMoy,
            theme: req.cookies["theme"] || "black",
            lang: req.cookies["lang"] || "fr",
            version: require("../package.json").version
        })
    }

}