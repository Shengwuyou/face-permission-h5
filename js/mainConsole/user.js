var userList = null;
var roleList = null;
//查询系统用户
function searchUsers() {
    var uId = $("#query_uId").val();
    var nickName = $("#query_nickName").val();
    var mobilePhone = $("#query_mobilePhone").val();
    var email = $("#query_email").val();
    var status = $("#query_status").val() == "" ? null : parseInt($("#query_status").val())
    var loginName = $("#query_loginName").val();
    var type = $("#query_type").val() == "" ? null : parseInt($("#query_type").val());
    var startTime = $("#query_startTime").val();
    var endTime = $("#query_endTime").val();


    var datas = JSON.stringify({
        "uId": checkBlank(uId),
        "nickName": checkBlank(nickName),
        "mobilePhone": checkBlank(mobilePhone),
        "email": checkBlank(email),
        "status": status,
        "loginName": checkBlank(loginName),
        "type": type,
        "startTime": checkBlank(startTime),
        "endTime": checkBlank(endTime),
        "page": 0,
        "size": 10,
        "lastId": null,
        "orderBy": 0
    });

    $.ajax({
        type: 'POST',
        url: HOST + "user/queryUsers",
        contentType: "application/json;charset=UTF-8",
        cache: false,
        dataType: 'json',
        data: datas,
        success: function(data) {
            if (data.code == 200) {
                userList = data.data.list;
                addTrUser(userList);
            }
        }
    });
}

// 查询系统存在的权限
function searchRoles() {

    $.ajax({
        type: 'GET',
        url: HOST + "role/getRoles",
        contentType: "application/json;charset=UTF-8",
        cache: false,
        dataType: 'json',
        success: function(data) {
            if (data.code == 200) {
                roleList = data.data;
            }
        }
    });

}


// 注册用户       checkBox的规则检查，很多地方使用   https://www.cnblogs.com/zhangyubao/p/7016728.html
function register() {
    var nickName = $("#nickName").val();
    var mobilePhone = $("#mobilePhone").val();
    var email = $("#email").val();
    var headPic = $("#headPic").val();
    var sex = parseInt($('input[name="user_form_sex"]:checked').val());
    var status = parseInt($('input[name="user_form_status"]:checked').val());
    var loginName = $("#loginName").val();
    var password = $("#password").val();
    var type = parseInt($("#accountType option:selected").val());
    var roles = getCheckBox("user_form_role");

    var datas = JSON.stringify({
        "nickName": nickName,
        "mobilePhone": mobilePhone,
        "email": email,
        "headPic": headPic,
        "sex": sex,
        "status": status,
        "loginName": loginName,
        "password": password,
        "type": type,
        "role": roles
    });


    $.ajax({
        type: 'POST',
        url: HOST + "user/cmsRegister",
        contentType: "application/json;charset=UTF-8",
        cache: false,
        dataType: 'json',
        data: datas,
        success: function(data) {
            if (data.code == 200) {
                var userList = data.data.list;
                addTrUser(userList);
                searchUsers();
            }
        }
    });

}

// 更新用户信息
function update() {
    var userId = $("#userId").val();
    var nickName = $("#nickName").val();
    var mobilePhone = $("#mobilePhone").val();
    var email = $("#email").val();
    var headPic = $("#headPic").val();
    var sex = parseInt($('input[name="user_form_sex"]:checked').val());
    var status = parseInt($('input[name="user_form_status"]:checked').val());
    var loginName = $("#loginName").val();
    var password = $("#password").val();
    if ($("#password").val() == "noChange") {
        password = null;
    }
    var grade = parseInt($("#loginName").val());
    var type = parseInt($("#accountType option:selected").val());
    var roles = getCheckBox("user_form_role");

    var datas = JSON.stringify({
        "userId": userId,
        "nickName": nickName,
        "mobilePhone": mobilePhone,
        "email": email,
        "headPic": headPic,
        "sex": sex,
        "status": status,
        "loginName": loginName,
        "password": password,
        "grade": grade,
        "type": type,
        "role": roles
    });


    $.ajax({
        type: 'POST',
        url: HOST + "user/update",
        contentType: "application/json;charset=UTF-8",
        cache: false,
        dataType: 'json',
        data: datas,
        success: function(data) {
            if (data.code == 200) {
                selfAlter(data.message, 1);
                // $(".modal").css('display', 'none');
                $(".modal").modal('hide');
                $('.modal-backdrop').remove(); //去掉遮罩层
                searchUsers();
            }
        }
    });

}



// 创建表格 ，表格插入数据加在头还是尾巴的问题  https://zhidao.baidu.com/question/134554535438055125.html
function addTrUser(userList) {
    // 拿到table的div块
    var tableDiv = $("#content").children(".box").children(".table");
    //拿到div块下的table块
    var userTable = tableDiv.find("#table-users");
    // 清空表格块原有数据（表头保存）
    $("#table-users  tr:not(:first)").remove();

    for (let index = 0; index < userList.length; index++) {
        var userInfo = userList[index];
        var sex;
        switch (userInfo.sex) {
            case 0:
                sex = "未知";
                break;
            case 1:
                sex = "男";
                break;
            case 2:
                sex = "女";
                break;
            default:
                sex = "/";
        }
        var status;
        switch (userInfo.status) {
            case 0:
                status = "未知";
                break;
            case 1:
                status = "有效";
                break;
            case 2:
                status = "无效";
                break;
            default:
                status = "/";
        }
        var type;
        switch (userInfo.type) {
            case 0:
                type = "游客";
                break;
            case 1:
                type = "普通";
                break;
            case 2:
                type = "VIP";
                break;
            case 3:
                type = "管理员";
                break;
            case 4:
                type = "ROOT";
                break;
            default:
                status = "/";
        }
        var userTr = "<tr><th width='13'><input type='checkbox' class='checkbox' /></th>" +
            "<th>" + index + "</th>" +
            "<th>" + userInfo.uId + "</th>" +
            "<th>" + userInfo.nickName + "</th>" +
            "<th>" + userInfo.loginName + "</th>" +
            "<th>" + userInfo.mobilePhone + "</th>" +
            "<th>" + userInfo.email + "</th>" +
            "<th>" + sex + "</th>" +
            "<th>" + status + "</th>" +
            "<th>" + type + "</th>" +
            "<th>" + userInfo.grade + "</th>" +
            "<th>" + userInfo.createTime + "</th>" +
            "<th> <a class='ico del'></a>" +
            "<a class='ico edit' data-toggle='modal' data-target='#myModal' onclick='modelHtml(1," + index + ")'></a></th></tr>";
        userTable.append(userTr);
    }

}
// 检查空格的参数情况
function checkBlank(val) {
    if (val == "") {
        return null;
    }
    return val;
}
//检查checkBox 的参数 转成Integer
function getCheckBox(checkName) {
    obj = document.getElementsByName(checkName);
    check_val = [];
    for (k in obj) {
        if (obj[k].checked)
            check_val.push(parseInt(obj[k].value));
    }
    return check_val
}

// 弹出注册/修改用户的输入页面
$('#register-box').modal({
    overlayClose: true,
    on: 'click'
}); //关键是这个，实现弹出效果；即jQuery的重绘，给人弹出的效果}



function modelHtml(htmlType, trIndex) {
    if (htmlType == 0) {
        $(".modal-title").html("用户新增");
    } else if (htmlType == 1) {
        $(".modal-title").html("用户修改");
    }

    var modalBody = "<form class='bs-example bs-example-form' id='user_register_form' role='form'>"
        // <!-- userID -->
    if (htmlType == 1) {
        modalBody += "<div class='input-group'>" +
            "<div class='user_register_req'>UserId: </div>" +
            "<input type='text' class='col-lg-6 form-control' id='userId' disabled='disabled'/>" +
            "</div>";
    }

    // <!-- 昵称 -->
    modalBody += "<div class='input-group'>" +
        "<div class='user_register_req'>昵称: </div>" +
        "<input type='text' class='col-lg-6 form-control' id='nickName' placeholder='请输入昵称' />" +
        "</div>";

    // <!-- 手机号 -->
    modalBody += "<div class='input-group'>" +
        "<div class='user_register_req'>手机号: </div>" +
        "<input type='text' class='col-lg-6 form-control' id='mobilePhone' placeholder='请输入手机号'";
    if (htmlType == 1) {
        modalBody += " disabled='disabled' "
    }
    modalBody += " /></div>";

    // <!-- 邮箱 -->
    modalBody += "<div class='input-group'>" +
        "<div class='user_register_req'>邮箱: </div>" +
        "<input type='text' class='col-lg-6 form-control' id='email' placeholder='请输入邮箱' />" +
        "</div>";

    // <!-- 头像图片 目前展示不设置（涉及上传到oss） -->
    modalBody += "<div class='input-group'>" +
        "<div class='user_register_req'>头像URL: </div>" +
        "<input type='text' class='col-lg-6 form-control' id='headPic' placeholder='请输入头像URL' />" +
        "</div>";

    // <!-- 性别 -->
    modalBody += "<div class='input-group'>" +
        "<div class='user_register_req'>性别: </div>" +
        "<label class='radio inline user_register_req_radio'>" +
        "    <input type='radio' name='user_form_sex' value=0>未知</label>" +
        "<label class='radio inline user_register_req_radio'>" +
        "    <input type='radio' name='user_form_sex' value=1>男</label>" +
        "<label class='radio inline user_register_req_radio'>" +
        "    <input type='radio' name='user_form_sex' value=2>女</label>" +
        "</div>";

    // <!-- 状态 -->
    modalBody += "<div class='input-group'>" +
        "<div class='user_register_req'>状态: </div>" +
        "<label class='radio inline user_register_req_radio'>" +
        "    <input type='radio' name='user_form_status' value=0>未知</label>" +
        "<label class='radio inline user_register_req_radio'>" +
        "    <input type='radio' name='user_form_status' value=1>有效</label>" +
        "<label class='radio inline user_register_req_radio'>" +
        "    <input type='radio' name='user_form_status' value=2>无效</label>" +
        "</div>";

    // <!-- 登陆名 -->
    modalBody += "<div class='input-group'>" +
        "<div class='user_register_req'>登陆名: </div>" +
        "<input type='text' class='col-lg-6 form-control' id='loginName' placeholder='请输入登陆名'";
    if (htmlType == 1) {
        modalBody += " disabled='disabled' ";
    }
    modalBody += "/></div>";

    // <!-- 密码 -->
    modalBody += "<div class='input-group'>" +
        "<div class='user_register_req'>密码: </div>" +
        "<input type='password' class='col-lg-6 form-control' id='password' placeholder='请输入密码'/>" +
        "</div>";

    if (htmlType == 1) {
        // <!-- 账号等级 -->
        modalBody += "<div class='input-group'>" +
            "<div class='user_register_req'>账号等级: </div>" +
            "<input type='text' class='col-lg-6 form-control' id='grade' />" +
            "</div>";
    }

    // <!-- 账号类型 -->
    modalBody += "<div class='input-group'>" +
        "<div class='user_register_req'>账号类型: </div>" +
        "<select class='col-lg-6 form-control' id='accountType'>" +
        " <option value=1>普通</option>" +
        " <option value=2>VIP</option>" +
        " <option value=3>管理员</option>" +
        "</select>" +
        "</div>";

    // <!-- 权限 -->
    modalBody += "<div class='input-group user_form_roles'>" +
        " <div class='user_register_req'>权限：</div> <div class= 'from_role_div'>";
    roleList.forEach(role => {
        if (role.status == 2) {
            modalBody += "<label class='checkbox user_register_req_checkbox'>" +
                "<input type='checkbox' name='user_form_role' id='role_" + role.roleCode + "' value=" + role.roleCode + ">" + role.memo + "</label>";
        }
    });
    modalBody += "</div></div>";

    modalBody += "</form>"
        // $(".modal-body").append(modalBody);
    $(".modal-body").html(modalBody);




    var modalFooter = "  <button type='button' class='btn' data-dismiss='modal'>Close</button>" +
        "<button type='button' class='btn' onclick='";
    if (htmlType == 0) {
        modalFooter += "register()";
    } else if (htmlType == 1) {
        modalFooter += "update()";
    }
    modalFooter += "'>Save</button>";

    $(".modal-footer").html(modalFooter);

    //修改的页面将修改前的值填入
    if (htmlType == 1) {
        var userInfo = userList[trIndex];
        $("#userId").val(userInfo.uId);
        $("#nickName").val(userInfo.nickName);
        $("#mobilePhone").val(userInfo.mobilePhone);
        $("#loginName").val(userInfo.loginName);
        $("#password").val("noChange");
        $("#email").val(userInfo.email);
        $("#grade").val(userInfo.grade);

        var sex = $("input[name='user_form_sex']");
        addCheckedForUpdate(userInfo.sex, sex);
        var status = $("input[name='user_form_status']");
        addCheckedForUpdate(userInfo.status, status);
        var type = $("input[name='user_form_type']");
        addCheckedForUpdate(userInfo.type, type);
        var rolesArr = JSON.parse(userInfo.roles);
        for (i in rolesArr) {
            var roleCode = rolesArr[i];
            $("#role_" + roleCode).prop('checked', true);
        }
    }
}

function addCheckedForUpdate(val, elementName) {
    if (val == null || val == "") { val = 0; }
    elementName.eq(val).prop('checked', true);
}