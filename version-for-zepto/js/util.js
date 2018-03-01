//时间对比
function time_contrast(startTime,endTime){
    var startdate = new Date((startTime).replace(/-/g,"/")), enddate = new Date((endTime).replace(/-/g,"/"));
    return enddate < startdate ? 2 : 1;
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
function getFormatDate(d){
    d = new Date(d);
    var year = d.getFullYear(), month = d.getMonth() + 1, strDate = d.getDate();
    if (month >= 1 && month <= 9) month = "0" + month;
    if (strDate >= 0 && strDate <= 9) strDate = "0" + strDate;
    return year + '-' + month + '-' + strDate;
}

// 初始化数组
function stringBuffer() {
    this._strs = [];
}

//手机号中间4位星号代替
function replace_mobile(mobile,front_len,end_len){
    var symbol = '', mobile_len = mobile.length;
    var len = mobile_len - front_len - end_len;
    for(var i=0; i<len; i++) {  symbol += '*'; }
    return mobile.substr(0,front_len) + symbol + mobile.substr(mobile_len-end_len);
}

//显示提示框
var toast_timer = 0;
function showToast(message,t){
    var alert = document.getElementById("toast");
    if(alert == null){
        alert =  document.createElement("div");
        alert.id = 'toast';
        alert.className = 'fd';
        alert.innerText = message;
    }else{
        alert.style.opacity = .9;
    }
    document.body.appendChild(alert);
    t = (t != undefined) ? t : 1000;
    toast_timer = setTimeout("hideToast()", t);
}

//隐藏提示框
function hideToast(){
    var alert = document.getElementById("toast");
    if(alert != null) document.body.removeChild(alert); clearTimeout(toast_timer);
}

//百度统计
// var _hmt = _hmt || [];
// function baiduTj(){
//     var hm = document.createElement("script");
//     hm.src = "//hm.baidu.com/hm.js?c387ed6270528c83be86971d3a4b9176";
//     var s = document.getElementsByTagName("script")[0];
//     s.parentNode.insertBefore(hm, s);
// }

//判断是否设备系统
function isIosOrAndroid(){
    var u = navigator.userAgent,isAndroid,isiOS,app;
    isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isAndroid) app = 1;
    if(isiOS) app = 2;
    return app;
}
