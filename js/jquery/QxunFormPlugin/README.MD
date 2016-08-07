# QxunFormPlugin
jquery 表单插件
## 示例（demo）
表单添加：[表单添加](http://oceanbaby715.github.io/KnowledgeBase/js/jquery/QxunFormPlugin/demo/index.html)
表单修改[表单修改](http://oceanbaby715.github.io/KnowledgeBase/js/jquery/QxunFormPlugin/demo/edit.html)
详情：[详情](http://oceanbaby715.github.io/KnowledgeBase/js/jquery/QxunFormPlugin/demo/detail.html)
## 依赖 (dependence)
jQuery 1.7以上版本和jquery-validation 插件
## 使用方法 (usage)
引入js文件

    <script src="../dist/jquery.min.js"></script>
    <script src="../dist/jquery.validate.min.js"></script>
    <script src="../dist/qxun.custom.validation.js"></script>
    <script src="../dist/jquery.qxun.form.min.js"></script>
***
    $(function(){
        $("#form1").qxunForm({
            submitUrl: "xxx.xx",//提交地址
            submitBtnId: "mobileSubmitBtn",//提交的按钮Id
            //jquery validate的验证规则
            validate: {
                rules: {
                    userName:{required:true,isChinese:true},
                    password:{required:true,strongPassword:true},
                    userAge:{required:true,number:true},
                    email:{required:true,email:true},
                    homePage:{required:true,url:true},
                    brithday:{required:true,date:true},
                    language:{required:true},
                    hobby:{required:true},
                    userSex:{required:true}
                },
                errorPlacement:function(error,element){
                    var type=element.attr("type");
                    if (type=="radio" || type=="checkbox") {
                        error.appendTo(element.parent().parent().parent());
                    }else{
                        error.appendTo(element.parent());
                    }
                }
            },
            successRetrunUrl:"XXXX.XXX",
            extendValidate: null,//额外自定义验证
            extendSerialize: function(data){
                $("#postData").html(JSON.stringify(data));
                return data;
            }
        });
    })

## 参数列表 (options)

|    参数          |     说明       |   类型   |   默认值   | 可填值 |
|------------------|----------------|----------|------------|--------|
| submitUrl        | 表单提交的地址 | string   |     空     |        |
| submitBtnId      | 提交的按钮ID   | string   | mobileSubmitBtn ||
| validate         | 验证条件       | object   |空| |
| successRetrunUrl | 提交成功后跳转的url | string   | 空| |
| extendValidate   | 提交前额外的验证条件| function|null| |
| extendSerialize  | 提交前额外的数据组装| function   |    null |        |
| extendFill       | 编辑\详情时自定义的数据填充| function   | null |   |
| afterSuccess     | 提交成功后自定义操作| function   | null     |        |
| getFormDataUrl   | 获取数据的url       | string   | 空     |        |
| primaryKeyId     | 主键Id       | string   | 空     |        |
| isDetails        | 是否是详情页 | bool   | false     |  |

## 自定义验证（custom.validation）
需要引入

    <script src="../dist/qxun.custom.validation.js"></script>
***
|    参数          |     说明               |
|------------------|------------------------|
| isIntEqZero      | 判断整数value是否等于0 |
| isIntGtZero        | 判断整数value是否大于0 |
| isIntGteZero        | 判断整数value是否大于或等于0 |
| isIntNEqZero        | 判断整数value是否不等于0 |
| isIntLtZero        | 判断整数value是否小于0 |
| isIntLteZero        | 判断整数value是否小于或等于0 |
| isFloatEqZero        | 判断浮点数value是否等于0 |
| isFloatGtZero        | 判断浮点数value是否大于0 |
| isFloatGteZero        | 判断浮点数value是否大于或等于0 |
| isFloatNEqZero        | 判断浮点数value是否不等于0 |
| isFloatLtZero        | 判断浮点数value是否小于0 |
| isFloatLteZero        | 判断浮点数value是否小于或等于0 |
| isFloat        | 判断浮点型 |
| isInteger        | 匹配integer |
| isNumber        | 判断数值类型，包括整数和浮点数 |
| isDigits        | 只能输入[0-9]数字 |
| isChinese        | 判断中文字符 |
| isEnglish        | 判断英文字符 |
| isMobile        | 手机号码验证|
| isPhone        | 电话号码验证 |
| isTel        | 联系电话(手机/电话皆可)验证|
| isQq        | 匹配qq |
| isZipCode        | 邮政编码验证 |
| isPwd        | 匹配密码，以字母开头，长度在6-12之间，只能包含字符、数字和下划线。 |
| isIdCardNo        | 身份证号码验证 |
| ip        | IP地址验证 |
| stringCheck        | 字符验证，只能包含中文、英文、数字、下划线等字符 |
| isEnglish        | 电话号码验证 |
|strongPassword  | 长度不能小于8位，密码必须是字母大写，字母小写，数字，特殊字符中任意三个组合|
