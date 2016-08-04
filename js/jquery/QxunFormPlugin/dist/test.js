/* ========================================================================
 * Bootstrap: button.js v3.3.5
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+ function($) {
  'use strict';

  // Form PUBLIC CLASS DEFINITION
  // ==============================

  var QxunForm = function(element, options) {
    this.$element = $(element)
    this.options = $.extend({}, QxunForm.DEFAULTS, options)
    this.isLoading = false
    this.validateFormObj = null
    this.init()
  }

  QxunForm.VERSION = '1.0.0'

  QxunForm.DEFAULTS = {
    submitUrl: "", //提交地址
    submitBtnId: "mobileSubmitBtn", //提交的按钮Id
    //jquery validate的验证规则
    validate: {
      rules: {}, //规则
      messages: {} //信息
    },
    successRetrunUrl: "",
    extendValidate: null, //额外自定义验证
    extendSerialize: null, //额外自定义数据
    extendFill: null, //自定义填充表单
    afterSuccess: null, //提交成功后自定义操作
    getFormDataUrl: "", //获取数据的url
    primaryKeyId: "",
    isDetails: false
  }

  //初始化
  QxunForm.prototype.init = function() {
    var that = this;
    this.initValidate();
    this.bindEvent();
    //如果有主键id表示是修改或者详情
    if ($.trim(that.options.primaryKeyId) != "") {
      that.getFormData();
    }
  }

  //初始化验证
  QxunForm.prototype.initValidate = function() {
    this.validateFormObj = this.element.validate(this.options.validate);
  }

  //绑定事件
  QxunForm.prototype.bindEvent = function() {
    //绑定提交按钮事件
    var that = this;
    $("#" + that.options.submitBtnId + "").bind("click", function() {
      //表单验证
      if (!that.checkForm()) {
        return false;
      } else {
        that.submit(that);
      }
    });
  }

  //提交数据
  QxunForm.prototype.initValidate = function() {
    var that=this;
    $.ajax({
      url: that.options.submitUrl,
      type: "post",
      data: that.serialize(),
      dataType: "json",
      beforeSend: function() {
        //可以写提交的时的等待图片
      },
      success: function(data) {
        that.afterSuccess(data);
      },
      error: function() {
        alert("服务器异常！");
        return false;
      }
    });
  }

  //序列化表单数据
  QxunForm.prototype.serialize = function() {

    function convertArray(array) {
      var json = {};
      for (var i in array) {
        if (typeof(json[array[i].name]) == 'undefined') {
          json[array[i].name] = array[i].value;
        } else {
          json[array[i].name] += "," + array[i].value;
        }
      }
      return json;
    }

    var data = convertArray(this.element.serializeArray());
    return this.extendSerialize(data);
  }

  //表单验证
  QxunForm.prototype.checkForm = function() {
    var flag = this.validateFormObj.checkForm();
    this.validateFormObj.showErrors();
    //当默认所有的验证都正确时才会验证自定义的（返回true，false）
    if (flag) {
      return this.extendValidate();
    } else {
      return flag;
    }
  }

  //额外自定义验证
  QxunForm.prototype.extendValidate = function() {
    if ($.isFunction(this.options.extendValidate)) {
      return this.options.extendValidate();
    } else {
      return true;
    }
  }

  //额外自定义数据
  QxunForm.prototype.extendSerialize = function(json) {
    if ($.isFunction(this.options.extendSerialize)) {
      json = this.options.extendSerialize(json);
    }
    return json;
  }

  //提交成功后自定义操作
  QxunForm.prototype.afterSuccess = function(data) {

    function defaultDealSuccess() {
      //"默认数据结构":{
      //    message: "系统异常"  //错误信息
      //    data: "diUyZkRDZXFiRUxaYUZSb2Q1U1hDWDRENTU1Ym5pR2VNSQ.." //返回的内容
      //    code: 0
      //}
      if (data != null && data.code == 0) {
        //默认都会跳转到指定的地址,如果不传插件默认刷新当前页面
        if (that.successRetrunUrl == "") {
          location = location;
        } else {
          location.href = that.successRetrunUrl; //指定的地址
        }
      } else {
        alert(data.message);
        return false;
      }
    }

    if ($.isFunction(this.options.afterSuccess)) {
      this.options.afterSuccess(data);
    } else {
      defaultDealSuccess(data, this.options);
    }
  }

  //填充表单其他额外的操作
  QxunForm.prototype.extendFill = function(data) {
    if ($.isFunction(this.options.extendFill)) {
      this.options.extendFill(data);
    }
  }

  //重置表单
  QxunForm.prototype.resetForm = function() {
    this.element[0].reset();
  }

  //根据主键值获取实体信息
  QxunForm.prototype.getFormData = function() {
    var that = this;
    $.ajax({
      url: that.options.getFormDataUrl,
      type: "get",
      dataType: 'json',
      beforeSend: function() {
        //可以写提交的时的等待图片
      },
      success: function(data) {
        if (data == null) {
          alert("获取数据失败！")
        } else {
          if (data.IsSuccess) {
            if (that.options.isDetails) {
              that.autoFillDetails(data.ExtInfo);
            } else {
              that.autoFillForm(data.ExtInfo);
            }
          } else {
            alert(data.message)
          }
        }
      },
      error: function() {
        alert("服务器异常！获取数据失败！");
        return false;
      }
    });
  }

  //填充表单
  QxunForm.prototype.autoFillForm = function(data) {
    var that = this;
    var key, value, tagName, type, arr;
    for (x in data) {
      key = x;
      value = data[x];
      $(that.element).find("[name='" + key + "'],[name='" + key + "[]']").each(function() {
        tagName = $(this)[0].tagName;
        type = $(this).attr('type');
        if (tagName == 'INPUT') {
          if (type == 'radio') {
            $(this).attr('checked', $(this).val() == value);
          } else if (type == 'checkbox') {
            arr = value.split(',');
            for (var i = 0; i < arr.length; i++) {
              if ($(this).val() == arr[i]) {
                $(this).attr('checked', true);
                break;
              }
            }
          } else {
            $(this).val(value);
          }
        } else if (tagName == 'SELECT') {
          $(this).val(value).change(); //加了一个change主要是为了省市区联动
        } else if (tagName == 'TEXTAREA') {
          $(this).val(value);
        }
      });
    }
    //自定义填充表单
    that.extendFill(data);
  }

  //如果是详情页面自动填充
  QxunForm.prototype.autoFillDetails = function(data) {
    var that = this;
    var key, value, type;
    for (x in data) {
      key = x;
      value = data[x];
      $("p[name='" + key + "']").each(function() {
        type = $(this).attr("data-type");
        switch (type) {
          case "img":
            break;
          case "vioce":
            break;
          case "map":
            break;
          default:
            $(this).html(value);
            break;
        }
      });
    }
    //自定义填充表单
    that.extendFill(data);
  }

  // QxunForm PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function() {
      new QxunForm($(this), options);
    })
  }

  var old = $.fn.qxunForm

  $.fn.qxunForm = Plugin
  $.fn.qxunForm.Constructor = QxunForm


  // QxunForm NO CONFLICT
  // ==================

  $.fn.qxunForm.noConflict = function() {
    $.fn.qxunForm = old
    return this
  }


  // QxunForm DATA-API
  // ===============
  //暂无

}(jQuery);