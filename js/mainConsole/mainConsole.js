//页面加载： 初始化方法
//权限控制-----根据用户权限类型-设置展示隐藏哪些按钮
window.onload = function() {
    var token = foowwLocalStorage.get("token");
    if (token == null) {
        selfAlter("登陆异常，请重新登陆", 0);
        setTimeout(window.location.href = "../index.html", 1000)
    }
    var nickName = foowwLocalStorage.get("nickName");
    $("#login_nickName").text(nickName);
    searchUsers();
    searchRoles();
}