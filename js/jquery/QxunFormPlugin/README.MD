# QxunFormPlugin
jquery 表单插件
## 示例（demo）
表单添加：[表单添加](http://oceanbaby715.github.io/KnowledgeBase/js/jquery/QxunFormPlugin/demo/index.html)<br>
表单修改：[表单修改](http://oceanbaby715.github.io/KnowledgeBase/js/jquery/QxunFormPlugin/demo/edit.html)<br>
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
                }
            },
            afterSuccessUrl:"XXXX.XXX"
        });
    })

## 参数列表 (options)

|    参数          |     说明       |   类型   |   默认值   | 可填值 |
|------------------|----------------|----------|------------|--------|
| submitUrl        | 表单提交的地址 | string   |     空     |        |
| submitBtnId      | 提交的按钮ID   | string   | formSubmitBtn |     |
| validate         | 验证条件       | object   |   null   |          |
| clearForm | 提交成功后是否clearForm | bool   | true   |            |
| resetForm   | 提交成功后是否resetForm| bool  |true    |            |
| extendBeforeSubmit  | 提交之前的额外处理| object   |`extendBeforeSubmit:{validate:null,//验证serialize:null//重组数据}`|     |
| extendAfterSubmit |提交之后的额外处理| object   | `extendAfterSubmit:{success:null,//成功error:null//失败}` |   |
| afterSuccessUrl     | 提交成功后跳转的地址| string   | 空     |    |
| getDataUrl   |编辑或者详情获取数据的url| string   | 空     |        |
| isDetails     |是否是详情页面| bool   | false     |        |
| extendFill        | 额外的填充 | function   | null     |  |

## 实用方法
### formSerialize
将表单序列化成查询串。这个方法将返回一个形如： name1=value1&name2=value2的字符串。
`var queryString = $('#form1').formSerialize(); `
### fieldSerialize
将表单里的元素序列化成字符串。当你只需要将表单的部分元素序列化时可以用到这个方法。 这个方法将返回一个形如： name1=value1&name2=value2的字符串。
`var queryString = $('#form1 :password').fieldSerialize();`
### fieldValue
取出所有匹配要求的域的值，以数组形式返回,如果没有符合条件的域，这个数组将会是个空数组，否则它将会包含至少一个值
`var value = $('#form1 :password').fieldValue(); alert('The password is: ' + value[0]);`
### resetForm
把表单重置成最初的状态
`$('#form1').resetForm()`
### clearForm
清空表单所有元素的值
`$('#form1').clearForm()`
### clearFields
清空某个表单域的值。这个可以用在只需要清空表单里部分元素的值的情况
`$('#form1 :password').clearFields()`
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
