//时间对比
function timeContrast(startTime, endTime) {
    var startdate = new Date(Date.parse(startTime.replace(/-/g,"/"))), enddate = new Date(Date.parse(endTime.replace(/-/g,"/")));
    return enddate > startdate ? 2 : 1;
}

//获取url参数
function GetRequest() {
    var url = location.search; // 获取url中"?"符后的字串
    var theRequest = {};
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) { theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]); }
    }
    return theRequest;
}

//格式化日期
function getFormatDate(d) {
    d = new Date(d);
    var year = d.getFullYear(), month = d.getMonth() + 1, strDate = d.getDate();
    if (month >= 1 && month <= 9) month = "0" + month;
    if (strDate >= 0 && strDate <= 9) strDate = "0" + strDate;
    return year + '-' + month + '-' + strDate;
}

//手机号中间4位星号代替
function replaceMobile(mobile, front_len, end_len) {
    var symbol = '', mobile_len = mobile.length;
    var len = mobile_len - front_len - end_len;
    for(var i=0; i<len; i++) {  symbol += '*'; }
    return mobile.substr(0,front_len) + symbol + mobile.substr(mobile_len-end_len);
}

//显示提示框
var toastTimer = null;
function showToast(message, t) {
    var alert = document.getElementById('toast');
    if(alert == null) {
        alert = document.createElement("div");
        alert.id = 'toast';
        alert.className = 'fd';
        alert.innerText = message;
    } else {
        alert.style.opacity = .9;
    }
    document.body.appendChild(alert);
    t = t ? t : 1000;
    toastTimer = setTimeout(function() {
    hideToast();
    }, t);
}

// 隐藏提示框
function hideToast() {
    var alert = document.getElementById('toast');
    if(alert != null) {
        document.body.removeChild(alert);
        clearTimeout(toastTimer);
    }
}