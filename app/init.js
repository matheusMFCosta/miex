var getContent = require('./utils.js')
var request = require('request')
var res;
var req;

module.exports = function init(x,y,recipient,timestamp,messageText,_res,_req){
    res = _res;
    req = _req;
    const removedMultipleSpaces = messageText.replace(/ +(?= )/g,'');
    const splitedString = removedMultipleSpaces.split(" ");
    const messaging = req.body.entry[0].messaging[0];
    const senderId = messaging.sender.id

    if(messageText.indexOf("/get last") != -1)
    {
        const maxResults =  splitedString[2]
        if(isNaN(maxResults)){
            sendTextMessage(senderId,"not a valid number")
            res.status(200).send(req.query['hub.challenge']);
            return;
        }
        getLastVideos(maxResults, senderId)
    }

    if(messageText.indexOf("/get filter") != -1)
    {
        const title =  splitedString[2]
        filterByTitle(title, senderId)
        res.status(200).send(req.query['hub.challenge']);
        
    }

    if(messageText.indexOf("/help") != -1)
    {
        sendTextMessage(senderId,
        "Commands:\n"+
        "/get filter <value>\n"+
        "/get last <number>"
        )
        res.status(200).send(req.query['hub.challenge']);
    }

    if(messageText.indexOf("/open page") != -1){
        res.redirect('https://www.youtube.com/channel/UCQMDYlEFnk8jwwCADkHHsnQ');
    }

}




function filterByTitle ( titleFilter, senderId ) {
    getContent ('https://www.googleapis.com/youtube/v3/search?part=snippet&q=orolegourmet&type=channel&key=AIzaSyA-l_jRIryVYPrDDTzofTHLXFzR4meFavY').then((body) =>
    {
        const textChunk = body.toString('utf8');
        const json = JSON.parse(textChunk)
        const channelId = json.items[0].id.channelId
        getContent (`https://www.googleapis.com/youtube/v3/search?part=snippet%20&q=${titleFilter}&type=video&channelId=${channelId}&key=AIzaSyA-l_jRIryVYPrDDTzofTHLXFzR4meFavY`).then((body) =>
        {
            const textChunk = body.toString('utf8');
            const json = JSON.parse(textChunk)
            const items = json.items
            var filteredVideo = [];
            for (  var i = 0 ; i < items.length; i++ ){
                var videoTitle = items[i].snippet.title;
                var videoDescription = items[i].snippet.description;
                if (videoTitle.toLowerCase().indexOf(titleFilter.toLowerCase()) != -1 || videoDescription.toLowerCase().indexOf(titleFilter.toLowerCase()) != -1){
                                    
                    var vidioUrl = "https://www.youtube.com/watch?v=" + items[i].id.videoId
                    var videoImage = items[i].snippet.thumbnails.high.url
                    var videoObject = {
                        title: videoTitle,
                        subtitle: videoDescription.slice(0,17) + "...",
                        item_url: vidioUrl,
                        image_url: videoImage
                    }
                    filteredVideo.push(videoObject);
                }
            }
            sendVideoCarrosel(senderId, filteredVideo) 
            res.status(200).send(req.query['hub.challenge']);
        })
        
    })
}   


function getLastVideos ( maxResults, senderId ){
    getContent('https://www.googleapis.com/youtube/v3/search?part=snippet&q=orolegourmet&type=channel&key=AIzaSyA-l_jRIryVYPrDDTzofTHLXFzR4meFavY').then((body) =>
    {
        const textChunk = body.toString('utf8');
        const json = JSON.parse(textChunk)
        const channelId = json.items[0].id.channelId
        getContent(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyA-l_jRIryVYPrDDTzofTHLXFzR4meFavY&channelId=${channelId}&part=snippet%2Cid&order=date&maxResults=${maxResults}`).then((body) =>
        {
            const textChunk = body.toString('utf8');
            const json = JSON.parse(textChunk)
            const items = json.items
            var filteredVideo = [];
            for(  var i = 0 ; i < items.length; i++ ){
                var videoTitle = items[i].snippet.title;
                var videoDescription = items[i].snippet.description;
                var vidioUrl = "https://www.youtube.com/watch?v=" + items[i].id.videoId
                    var videoImage = items[i].snippet.thumbnails.high.url
                    var videoObject = {
                        title: videoTitle,
                        subtitle: videoDescription.slice(0,17) + "...",
                        item_url: vidioUrl,
                        image_url: videoImage
                    }
            filteredVideo.push(videoObject);
            }
            sendVideoCarrosel(senderId, filteredVideo) 
            res.status(200).send(req.query['hub.challenge']);
        })
        
    })
}


function sendVideoCarrosel(sender, filteredVideo) {
    if (filteredVideo.length < 1){
        sendTextMessage(sender, "thre is no video related")
        return;
    }
    for (var i = 0; i<filteredVideo.length; i++){
        filteredVideo[i]["buttons"] = [{
        "type":"web_url",
        "url":filteredVideo[i].item_url,
        "title":"Assistir vídeo"
        }]
        filteredVideo[i].item_url = "";
    }
    let messageData = 
     {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":filteredVideo
      }
    }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:"EAAY1CXnam8oBAMWmbBVyK925ZAAwHJER1FQ8I5M7u4PQqTZCOoYrSgzvVLwOTga2g8hjbzU2zwRNvRNZBc758FxdQj7ye9gXudCj0IYfWZA76YkUpZAsB8ZCyZC5DpEZBvuFZCp8RKBxSyp3VwMXcn1VP4OwwbZAaKcrs8X135yR21WwZDZD"},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendTextMessage(sender, text) {

    let messageData = { text: text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:"EAAY1CXnam8oBAMWmbBVyK925ZAAwHJER1FQ8I5M7u4PQqTZCOoYrSgzvVLwOTga2g8hjbzU2zwRNvRNZBc758FxdQj7ye9gXudCj0IYfWZA76YkUpZAsB8ZCyZC5DpEZBvuFZCp8RKBxSyp3VwMXcn1VP4OwwbZAaKcrs8X135yR21WwZDZD"},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}