var timerIsAlive
var serverUrl
/*
window.addEventListener('load', function (evt) {
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'payload.js'
    })
})
chrome.runtime.onMessage.addListener(function(message){
    serverUrl = message
})
*/
window.onload = function(){
    chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'payload.js'
    })
    chrome.runtime.onMessage.addListener(function(message){
        serverUrl = message['url']
        try{
            chrome.cookies.get({'name': 'time', 'url': String(serverUrl)}, function (cookie){
                //alert('yes cookie')
                if(cookie){
                    val = JSON.parse(cookie.value)
                    stopTime = new Date(val['stop'])
                    getservertime(serverUrl, stopTime)
                }else{
                    killCookie()
                    //alert('no cookie')
                    makeList()
                }
            })
        }catch (error){
            //alert('no cookie' + String(error))
            makeList()
        }
    })    
}

function makeList(){
    for (var i = 0; i<24; i++){
        $('#hourOption').append('<option value="'+i+'">'+String(i)+'</option>')
        $('#minOption').append('<option value="'+i+'">'+String(i)+'</option>')
        $('#secOption').append('<option value="'+i+'">'+String(i)+'</option>')
    }
    for (var i=24; i<60; i++){
        $('#minOption').append('<option value="'+i+'">'+String(i)+'</option>')
        $('#secOption').append('<option value="'+i+'">'+String(i)+'</option>')
    }
    document.getElementById('start').addEventListener('click', ActiveButton)
    document.getElementById('stop').addEventListener('click', DeactivButton)
}
function ActiveButton(){
    var stopTime = selectBoxVal()
    document.getElementById('start').style.display='none'
    document.getElementById('message').innerHtml = ' '
    getservertime(serverUrl, stopTime)//location.href==chrome extension
}
function DeactivButton(){
    timerIsAlive = false
    document.getElementById('message').innerHTML = "STOP"
    document.getElementById('start').style.display='none'
    document.getElementById('stop').style.display='none'
    //alert('delete cookie')
    killCookie()
}

function getservertime(serverurl, stopTime){
    $.ajax({
        type: 'GET',
        url: serverurl,
        success: function(req, Status, xhr){
            var serverTime = xhr.getResponseHeader('Date')
            var localTime = Date.parse(serverTime)
            startTime = new Date(localTime)
            var koreaTime = startTime.toLocaleString('en-US', {timeZone: 'Asia/Seoul'})
            //var koreaTime = localTime.toLocaleString('en-US', {timeZone: 'America/New_York'})
            //Servertime : Tue, 03 Nov 2020 07:06:45 GMT
            //localTime : Tue Nov 03 2020 16:06:45 GMT+0900 (대한민국 표준시)
            //Server Time : 11/3/2020, 4:06:45 PM
            //alert('set cookie')
            chrome.cookies.set({'url': String(serverUrl), 'name': 'time',
                'value': JSON.stringify({'stop': stopTime}), 
                'expirationDate': stopTime.getTime()})
            timerStart(startTime, stopTime)
        },
        error: function(e){
            document.getElementById("message").innerHTML = "Server connect fail "
        }
    });
}

function timerStart(startTime, stopTime){
    const sec = 1000, min = sec * 60, hour = min * 60, day = hour * 24
    timerIsAlive = true
    offset = stopTime - startTime
    if(offset < 0){
        stopTime.setDate(stopTime.getDate() + 1)
        offset = stopTime - startTime
    }
    timer = setInterval(function(){
        offset = stopTime - startTime
        if(offset <= 0){
            chrome.tabs.reload()//time is over refrash
            document.getElementById("message").innerHTML = "refrash"
            DeactivButton()
            clearInterval(timer)
        }
        if(!timerIsAlive){
            clearInterval(timer)
        }
        document.getElementById("H").innerText = Math.floor((offset % (day))/(hour))
        document.getElementById("M").innerText = Math.floor((offset % (hour))/(min))
        document.getElementById("S").innerText = Math.floor((offset % (min))/(sec))
        startTime.setMilliseconds(startTime.getMilliseconds() + 250)
    }, 250)
    
}

function selectBoxVal(){
    let today = new Date();
    let year = today.getFullYear()
    let month = today.getMonth()
    let day = today.getDate()
    let hour = $("#hourOption option:selected").val()
    let min = $("#minOption option:selected").val()
    let sec = $("#secOption option:selected").val() - 1 //for system delay
    return new Date(year, month, day, hour, min, sec, 0)
}

function killCookie(){
    chrome.cookies.remove({'name': 'time', 'url': String(serverUrl)})
    chrome.cookies.remove({'name': 'time', 'url': String(serverUrl)})
}