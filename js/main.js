// var HOST = "http://192.168.1.129:8080/";
var HOST = "http://121.40.124.14:8080/";
//var HOST = returnCitySN["cip"] != null ? returnCitySN["cip"] : "http://127.0.0.1:8080/";


$.ajaxSetup({

    beforeSend: function(xhr) {
        var token = foowwLocalStorage.get("token");;
        if (this.type == "POST" && token != null) {
            console.log("ajax beforesend token:", token)
            xhr.setRequestHeader('token', token);
            var trace = JSON.stringify({
                "fromWay": 0,
                "platform": "pc"
            });
            xhr.setRequestHeader("trace", trace);
        }
    },
    complete: function(xhr, status) {
        if (status == "success") {
            //token 异常直接跳转
            if (xhr.responseJSON.code == 201) {
                selfAlter("Token异常，正在跳转登陆页...", 0)
                setTimeout(window.location.href = "../index.html", 1000)
            }
            //普通异常，页面提示
            if (xhr.responseJSON.code != 200) {
                selfAlter(xhr.responseJSON.message, 0)
            }


        }
    },

    // 响应 全局拦截处理方法
    error: function(jqXHR, textStatus, errorMsg) {  // 出错时默认的处理函数
        // jqXHR 是经过jQuery封装的XMLHttpRequest对象
        // textStatus 可能为： null、"timeout"、"error"、"abort"或"parsererror"
        // errorMsg 可能为： "Not Found"、"Internal Server Error"等
        switch (jqXHR.status) {
            case (500):
                selfAlter("请求地址异常", 0);
                break;
            case (401):
                selfAlter("未登录", 0);
                break;
            case (403):
                selfAlter("当前用户没有权限", 0);
                break;
            case (408):
                selfAlter("请求超时", 0);
                break;
            default:
                selfAlter("未知错误", 0);
        }
    }
});

function selfAlter(info, status) {

    $('.alter_msg').remove();
    var alterMsg = "<div class='alter_msg' id='";
    if (status == 1) {
        alterMsg += "alter_msg_ok' >";
    } else {
        alterMsg += "alter_msg_error' >";
    }
    alterMsg += "<div id='alter_msg_info'>" + info + "</div>";
    $('body').prepend(alterMsg);

    // 获取浏览器窗口 
    var windowScreen = document.documentElement;
    // 想要弹出框设置的窗口大小设置
    var iWidth = 240; //弹出窗口的宽度;
    var iHeight = 40; //弹出窗口的高度;

    // 通过窗口宽高和div宽高计算位置 
    var i_left = (windowScreen.clientWidth - iWidth) / 2 + "px";
    var i_top = "20px" //(windowScreen.clientHeight - iHeight) / 2 + "px";

    $('.alter_msg').slideDown(2000).height(iHeight).width(iWidth)
        .css("top", i_top).css("left", i_left)
    setTimeout(function() { $('.alter_msg').slideUp(2000); }, 3000);
}


//>>>>>>>>>>>>>>>>设置缓存<<<<<<<<<<<<<<<<<<
var date = new Date().getTime();
//设置localStorage的值
// foowwLocalStorage.set("test", "你好", date + 10000);
//获取localStorage的值
// var data = foowwLocalStorage.get("test");


const foowwLocalStorage = {
    set: function(key, value, ttl_ms) {
        var data = { value: value, expirse: new Date(ttl_ms).getTime() };
        localStorage.setItem(key, JSON.stringify(data));
    },
    get: function(key) {
        var data = JSON.parse(localStorage.getItem(key));
        if (data !== null) {
            // debugger
            if (data.expirse != null && data.expirse < new Date().getTime()) {
                localStorage.removeItem(key);
            } else {
                return data.value;
            }
        }
        return null;
    }
}