
function login() {

    var userName = $("*[name='userName']").val();
    var password = $("*[name='password']").val();
    // 
    var datas = JSON.stringify({
        "loginName": userName,
        "password": password,
        "platform": 'pc',
        "fromWay": 0
    });
    
    $.ajax({
        type:'POST',
        url:HOST + "user/login",
        contentType:"application/json;charset=UTF-8",
        cache:false,
        dataType:'json',
        data: datas,
        success: function (data) {
            if(data.code == 200){
                selfAlter("登陆成功,正在跳转");
                foowwLocalStorage.set("token", data.data.token, date + 1000*60*5 );
                foowwLocalStorage.set("nickName", data.data.nickName, date + 1000*60*5);
                window.location.href="/html/mainConsole.html";
            }else{
                selfAlter(data.message);
            }
            
        },
        error: function () {
            selfAlter("error!!!!")
        }
    });
}
