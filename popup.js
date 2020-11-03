var timerIsAlive = null
var serverUrl

window.addEventListener('load', function (evt) {
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'payload.js'
	});
});
chrome.runtime.onMessage.addListener(function(message){
    serverUrl = message
})

window.onload = function(){
    makeList()
    document.getElementById('start').addEventListener('click', ActiveButton)
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
}
function ActiveButton(){
    var stopTime = selectBoxVal()
    getservertime(serverUrl, stopTime)//location.href==chrome extension
}

function getservertime(serverurl, stopTime){
    $.ajax({
        type: 'GET',
        url: serverurl,
        success: function(req, Status, xhr){
            var serverTime = xhr.getResponseHeader('Date')
            var localTime = Date.parse(serverTime)
            localTime = new Date(localTime)
            var koreaTime = localTime.toLocaleString('en-US', {timeZone: 'Asia/Seoul'})
            //var koreaTime = localTime.toLocaleString('en-US', {timeZone: 'America/New_York'})
            //Servertime : Tue, 03 Nov 2020 07:06:45 GMT
            //localTime : Tue Nov 03 2020 16:06:45 GMT+0900 (대한민국 표준시)
            //Server Time : 11/3/2020, 4:06:45 PM
            startTime = localTime
            timerStart(startTime, stopTime)
        },
        error: function(e){
            document.getElementById("message").innerHTML = "Server connect fail "
        }
    });
}

function timerStart(startTime, stopTime){
    const sec = 1000, min = sec * 60, hour = min * 60, day = hour * 24
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
            clearInterval(timer)
        }
        document.getElementById("H").innerText = Math.floor((offset % (day))/(hour))
        document.getElementById("M").innerText = Math.floor((offset % (hour))/(min))
        document.getElementById("S").innerText = Math.floor((offset % (min))/(sec))
        startTime.setMilliseconds(startTime.getMilliseconds() + 500)
    }, 500)
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