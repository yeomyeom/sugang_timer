window.addEventListener('load', function (evt) {
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'payload.js'
	});
});

chrome.runtime.onMessage.addListener(function (message){
    getservertime(message);
});

function getservertime(serverurl){
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
            document.getElementById("serverTime").innerHTML = 
            "Server name : " + serverurl +
            "<br>Server Time : " + koreaTime;
        },
        error: function(output){
            document.getElementById("serverTime").innerHTML =
            "Server connect fail " + output;
        }
    });
};