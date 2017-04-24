
'use strict'

var init = require('../app/init'); 
var path = require('path');
const request = require('request')
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var rp = require('request-promise');
var sleep = require('sleep');
var wow = require('promise-sleep')
var fs = require('fs');

let urlArray = [];
let currentUrlIndex = 0; 

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/*', function(req, res) {
  //console.log(req.body.entry[0].messaging[0])
  //const challenge = req.query['hub.challenge']
  // const messaging = req.body.entry[0].messaging[0];
  // const senderId = messaging.sender.id
  // const recipient = messaging.recipient.id
  // const timestamp = messaging.timestamp
  // const messageText = messaging.message.text

  init(res,req)

  //res.status(200).send(req.query['hub.challenge']);
});

let matches = {
    "matchId": [],
    "winner": [],
    "blueSide": [],
    "firstDragon": [],
    "dragonKills": [],
    "firstBaron": [],
    "baronKills": [],
    "firstInhibitor": [],
    "firstTower": [],
    "towerKills": [],

    // player stats
    "championId": [],
    "kills": [],
    "assists": [],
    "deaths": [],
    "totalDamageDealt": [],
    "totalDamageDealtToChampions": [],
    "totalDamageTaken": [],
    "doubleKills": [],
    "tripleKills": [],
    "quadraKills": [],
    "pentaKills": [],
    "goldEarned": [],
    "minionsKilled": [],
    "champLevel": [],
}


function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 6000);
  });
}

function delay(t) {
   return new Promise(function(resolve) { 
       setTimeout(resolve, t)
   });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



function demo() {

let playerId = 479257
console.log("1")
console.log("2")


rp("https://br.api.riotgames.com/api/lol/BR/v2.2/matchlist/by-summoner/" + playerId + "?rankedQueues=RANKED_FLEX_SR,RANKED_SOLO_5x5,RANKED_TEAM_5x5,TEAM_BUILDER_DRAFT_RANKED_5x5,TEAM_BUILDER_RANKED_SOLO&seasons=PRESEASON3,SEASON3,PRESEASON2014,SEASON2014,PRESEASON2015,SEASON2015,PRESEASON2016,SEASON2016,PRESEASON2017,SEASON2017&api_key=RGAPI-3d164b6c-45ff-435c-aa4c-0dc0ff4c4429")
.then(function(body){
  
  const jsonResponse = JSON.parse(body)
  const playerMatches = jsonResponse.matches;
  let callTimes = 0 
  console.log(playerMatches.length)
  for(let key in playerMatches){
    const matchId = playerMatches[key].matchId
    matches.matchId.push(matchId)
    urlArray.push("https://br.api.riotgames.com/api/lol/BR/v2.2/match/" + matchId + "?api_key=RGAPI-3d164b6c-45ff-435c-aa4c-0dc0ff4c4429")
  
}
  calls();

  })

}

function calls(){
        let playerId = 479257
        const currentUrl = urlArray[currentUrlIndex]
        rp(currentUrl)
          .then(function(body){
            const response = JSON.parse(body)
                    let participantId
        let teamIndex
        response.participantIdentities.map((data) => {

            // set needed variables
            if (data.player.summonerId == playerId) {
                participantId = data.participantId
                teamIndex = ((response.participants[participantId - 1].teamId) / 100) - 1
            }
        })
            matches.winner.push(response.teams[teamIndex].winner)
            matches.blueSide.push((teamIndex == 0 ? true : false))
            matches.firstDragon.push(response.teams[teamIndex].firstDragon)
            matches.dragonKills.push(response.teams[teamIndex].dragonKills)
            matches.firstBaron.push(response.teams[teamIndex].firstBaron)
            matches.baronKills.push(response.teams[teamIndex].baronKills)
            matches.firstInhibitor.push(response.teams[teamIndex].firstInhibitor)
            matches.firstTower.push(response.teams[teamIndex].firstTower)
            matches.towerKills.push(response.teams[teamIndex].towerKills)
            matches.championId.push(response.participants[participantId - 1].championId)
            matches.kills.push(response.participants[participantId - 1].stats.kills)
            matches.assists.push(response.participants[participantId - 1].stats.assists)
            matches.deaths.push(response.participants[participantId - 1].stats.deaths)
            matches.totalDamageDealt.push(response.participants[participantId - 1].stats.totalDamageDealt)
            matches.totalDamageDealtToChampions.push(response.participants[participantId - 1].stats.totalDamageDealtToChampions)
            matches.totalDamageTaken.push(response.participants[participantId - 1].stats.totalDamageTaken)
            matches.doubleKills.push(response.participants[participantId - 1].stats.doubleKills)
            matches.tripleKills.push(response.participants[participantId - 1].stats.tripleKills)
            matches.quadraKills.push(response.participants[participantId - 1].stats.quadraKills)
            matches.pentaKills.push(response.participants[participantId - 1].stats.pentaKills)
            matches.goldEarned.push(response.participants[participantId - 1].stats.goldEarned)
            matches.minionsKilled.push(response.participants[participantId - 1].stats.minionsKilled)
            matches.champLevel.push(response.participants[participantId - 1].stats.champLevel)
            const file = JSON.stringify(matches)
            console.log(currentUrlIndex)
            sleep.sleep(2)
            currentUrlIndex++;

            fs.writeFile("./test.json", file, function(err) {
              if(err) {
                  return console.log(err);
              }

              console.log("The file was saved!");
          });

            calls()
          }
        )
          .catch(function (err) {
             calls()
          });
    
  
}

// for(let i =0; i< 1180; i++){
//   rp('http://www.google.com')
//     .then(function (htmlString) {
//        console.log(i)
//     })
// }
demo();

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

