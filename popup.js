window.addEventListener('load', function (evt) {
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'payload.js'
	});
});

function getservertime(serverurl){
    jQuery.ajax({
        type: 'GET',
        url: serverurl,
        success: function(req, Status){
            var serverTime = req.getResponseHeader('Date')
            var localTime = Date.parse(servertime)
            var koreaTime = localtime.toLocalString("en-US", {timeZone: "Asia/Seoul"})
            //koreaTime -> "22/09/2020, 13:00:00" 문자열로됨
        }
    })
}