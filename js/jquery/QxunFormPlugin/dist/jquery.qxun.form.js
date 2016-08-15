/*!
 * jQuery Form Plugin
 * version: 1.0.0-2016.08.10
 * Requires jQuery v1.7 or later7
 * Examples and documentation at: https://github.com/oceanbaby715/KnowledgeBase/tree/gh-pages/js/jquery/QxunFormPlugin
 * Project repository: https://github.com/oceanbaby715/KnowledgeBase/tree/gh-pages/js/jquery/QxunFormPlugin
 * licensed under the MIT.
 */

+ function($) {
  'use strict';

  // Form PUBLIC CLASS DEFINITION
  // ==============================

  var QxunForm = function(element, options) {
    this.element = $(element)
    this.options = $.extend(true,{}, QxunForm.DEFAULTS, options)
    this.validateFormObj = this.element.validate(this.options.validate)
    this.init()
  }

  QxunForm.VERSION = '1.0.0'

  QxunForm.DEFAULTS = {
    submitBtnId: "formSubmitBtn", //提交的按钮Id
    submitUrl: "", //ajax post地址
    validate: null,//jquery validate插件的验证规则
    clearForm:true,//提交成功后是否clearForm
    resetForm:true,//提交成功后是否resetForm
    //提交之前的额外处理
    extendBeforeSubmit:{
      validate:null,//验证
      serialize:null//重组数据
    },
    //提交之后的额外处理
    extendAfterSubmit:{
      success:null,//成功
      error:null//失败
    },
    afterSuccessUrl:"",//提交成功后跳转的地址
    getDataUrl:"",//编辑或者详情获取数据的url
    isDetails:false,//是否是详情页面
    extendFill:null//额外的填充
  }

  //初始化
  QxunForm.prototype.init = function() {
    var that = this;
    this.bindEvent();
    //如果填写了获取数据的地址表示是修改或者详情
    if ($.trim(that.options.getDataUrl) != "") {
      that.getFormData();
    }
  }

  //绑定事件
  QxunForm.prototype.bindEvent = function() {
    //绑定提交按钮事件
    var that = this;
    if ($.trim(that.options.submitBtnId) != "") {
      $("#" + that.options.submitBtnId + "").bind("click", function() {
        //表单验证
        if (!that.checkForm()) {
          return false;
        } else {
          that.submit();
          $("#"+that.options.submitBtnId).attr("disabled","true");
        }
      });
    }
  }

  //提交数据
  QxunForm.prototype.submit = function() {
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
        that.extendAfterSubmit.success(that,data);
      },
      error: function(jqXHR, textStatus, errorMsg) {
        that.extendAfterSubmit.error(that,jqXHR, textStatus, errorMsg);
      },
      complete:function(){
        $("#"+that.options.submitBtnId).removeAttr("disabled");
      }
    });
  }

  //序列化表单数据
  QxunForm.prototype.serialize = function() {
    var json = {};
    var data = this.element.serializeArray();
    $.each(data, function () {
        if (json[this.name] !== undefined) {
            if (!json[this.name].push) {
                json[this.name] = [json[this.name]];
            }
            json[this.name].push(this.value || '');
        } else {
            json[this.name] = this.value || '';
        }
    });
    //serializeArray方法，当checkbox、radio一个都不选择时会获取不到name，特殊处理
    var $radio = $('input[type=radio],input[type=checkbox]',this.element);
    $.each($radio,function(){
        if(!json.hasOwnProperty(this.name)){
            json[this.name] = '';
        }
    });
    return this.extendBeforeSubmit.serialize(this,json);
  }

  //提交之前的额外处理
  QxunForm.prototype.extendBeforeSubmit = {
    //验证
    validate: function(that) {
      if ($.isFunction(that.options.extendBeforeSubmit.validate)) {
        return that.options.extendBeforeSubmit.validate();
      } else {
        return true;
      }
    },
    //重组数据
    serialize: function(that,json) {
      if ($.isFunction(that.options.extendBeforeSubmit.serialize)) {
        json = that.options.extendBeforeSubmit.serialize(json);
      }
      return json;
    }
  }

  //提交之后的额外处理
  QxunForm.prototype.extendAfterSubmit = {
    //成功操作
    success: function(that,data) {
      //提交成功后默认操作
      function defaultDealSuccess() {
        //{IsSuccess: true, ErrorMsg: null, ResponseCode: 0, ExtInfo: "diUyZkRDZXFiRUxaYUZSb2Q1U1hDWDROcEx5S2JPd2V4RQ.."} 新增返回结构
        //{IsSuccess: true, ErrorMsg: null, ResponseCode: 0, ExtInfo: true}//修改返回结构
        if (data != null) {
          if (data.IsSuccess) {
            //resetForm
            if (that.options.resetForm) {
              that.element.resetForm();
            }
            //clearForm
            if (that.options.clearForm) {
              that.element.clearForm();
            }
            //默认都会跳转到指定的地址,如果不传插件默认刷新当前页面
            if ($.trim(that.options.afterSuccessUrl) == "") {
              location = location;
            } else {
              location.href = that.options.afterSuccessUrl;
            }
          } else {
            alert(data.message);
            return false;
          }
        } else {
          alert("后台出错了");
        }
      }
      //如果没有自定义操作则按照默认的方式执行
      if ($.isFunction(that.options.extendAfterSubmit.success)) {
        this.options.extendAfterSubmit.success(data);
      } else {
        defaultDealSuccess();
      }
    },
    //出错操作
    error: function(that, jqXHR, textStatus, errorMsg) {
      if ($.isFunction(that.options.extendAfterSubmit.error)) {
        that.options.extendAfterSubmit.error(jqXHR, textStatus, errorMsg);
      } else {
        alert(jqXHR.status+" "+textStatus+" "+errorMsg);
        return false;
      }
    }
  }

  //表单验证
  QxunForm.prototype.checkForm = function() {
    var flag = this.validateFormObj.checkForm();
    this.validateFormObj.showErrors();
    //当默认所有的验证都正确时才会验证自定义的（返回true，false）
    if (flag) {
      return this.extendBeforeSubmit.validate(this);
    } else {
      return flag;
    }
  }

  //编辑、详情获取数据
  QxunForm.prototype.getFormData = function() {
    var that = this;
    $.ajax({
      url: that.options.getDataUrl,
      type: "get",
      dataType: 'json',
      beforeSend: function() {
        //可以写提交的时的等待图片
      },
      success: function(data) {
        //{IsSuccess: true, ErrorMsg: null, ResponseCode: 0, ExtInfo: {Id:1,Name:'张三'...}} 新增返回结构
        if (data != null) {
          if (data.IsSuccess) {
            if (that.options.isDetails) {
              that.autoFillDetails(data.ExtInfo);
            } else {
              that.autoFillForm(data.ExtInfo);
            }
          }else{
            alert(data.message)
          }
        }else{
          alert("后台出错了！")
        }
      },
      error: function(jqXHR, textStatus, errorMsg) {
        alert(jqXHR.status+" "+textStatus+" "+errorMsg);
        return false;
      }
    });
  }

  //填充表单
  QxunForm.prototype.autoFillForm = function(data) {
    var that = this;
    var key, value, tagName, type, arr;
    for (var x in data) {
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
        } else if (tagName == 'SELECT' || tagName == 'TEXTAREA') {
          $(this).val(value);
        }
      });
    }
    //自定义填充表单
    that.extendFill(data);
  }

  //填充详情页
  QxunForm.prototype.autoFillDetails = function(data) {
    var that = this;
    var key, value, type;
    for (var x in data) {
      key = x;
      value = data[x];
      $(that.element).find("[name='" + key + "']").each(function() {
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

  //填充表单其他额外的操作
  QxunForm.prototype.extendFill = function(data) {
    if ($.isFunction(this.options.extendFill)) {
      this.options.extendFill(data);
    }
  }



  
  /**
   * Feature detection
   */
  var feature = {};
  feature.fileapi = $("<input type='file'/>").get(0).files !== undefined;
  feature.formdata = window.FormData !== undefined;
  /**
   * formToArray() gathers form element data into an array of objects that can
   * be passed to any of the following ajax functions: $.get, $.post, or load.
   * Each object in the array has both a 'name' and 'value' property.  An example of
   * an array for a simple login form might be:
   *
   * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
   *
   * It is this array that is passed to pre-submit callback functions provided to the
   * ajaxSubmit() and ajaxForm() methods.
   */
  $.fn.formToArray = function(semantic, elements) {
    var a = [];
    if (this.length === 0) {
      return a;
    }

    var form = this[0];
    var formId = this.attr('id');
    var els = semantic ? form.getElementsByTagName('*') : form.elements;
    var els2;

    if (els && !/MSIE [678]/.test(navigator.userAgent)) { // #390
      els = $(els).get(); // convert to standard array
    }

    // #386; account for inputs outside the form which use the 'form' attribute
    if (formId) {
      els2 = $(':input[form="' + formId + '"]').get(); // hat tip @thet
      if (els2.length) {
        els = (els || []).concat(els2);
      }
    }

    if (!els || !els.length) {
      return a;
    }

    var i, j, n, v, el, max, jmax;
    for (i = 0, max = els.length; i < max; i++) {
      el = els[i];
      n = el.name;
      if (!n || el.disabled) {
        continue;
      }

      if (semantic && form.clk && el.type == "image") {
        // handle image inputs on the fly when semantic == true
        if (form.clk == el) {
          a.push({
            name: n,
            value: $(el).val(),
            type: el.type
          });
          a.push({
            name: n + '.x',
            value: form.clk_x
          }, {
            name: n + '.y',
            value: form.clk_y
          });
        }
        continue;
      }

      v = $.fieldValue(el, true);
      if (v && v.constructor == Array) {
        if (elements) {
          elements.push(el);
        }
        for (j = 0, jmax = v.length; j < jmax; j++) {
          a.push({
            name: n,
            value: v[j]
          });
        }
      } else if (feature.fileapi && el.type == 'file') {
        if (elements) {
          elements.push(el);
        }
        var files = el.files;
        if (files.length) {
          for (j = 0; j < files.length; j++) {
            a.push({
              name: n,
              value: files[j],
              type: el.type
            });
          }
        } else {
          // #180
          a.push({
            name: n,
            value: '',
            type: el.type
          });
        }
      } else if (v !== null && typeof v != 'undefined') {
        if (elements) {
          elements.push(el);
        }
        a.push({
          name: n,
          value: v,
          type: el.type,
          required: el.required
        });
      }
    }

    if (!semantic && form.clk) {
      // input type=='image' are not found in elements array! handle it here
      var $input = $(form.clk),
        input = $input[0];
      n = input.name;
      if (n && !input.disabled && input.type == 'image') {
        a.push({
          name: n,
          value: $input.val()
        });
        a.push({
          name: n + '.x',
          value: form.clk_x
        }, {
          name: n + '.y',
          value: form.clk_y
        });
      }
    }
    return a;
  };

  //Serializes form data into a 'submittable' string. This method will return a string in the format: name1=value1&amp;name2=value2
  $.fn.formSerialize = function(semantic) {
    return $.param(this.formToArray(semantic));
  };

  /**
   * Serializes all field elements in the jQuery object into a query string.
   * This method will return a string in the format: name1=value1&amp;name2=value2
   */
  $.fn.fieldSerialize = function(successful) {
    var a = [];
    this.each(function() {
      var n = this.name;
      if (!n) {
        return;
      }
      var v = $.fieldValue(this, successful);
      if (v && v.constructor == Array) {
        for (var i = 0, max = v.length; i < max; i++) {
          a.push({
            name: n,
            value: v[i]
          });
        }
      } else if (v !== null && typeof v != 'undefined') {
        a.push({
          name: this.name,
          value: v
        });
      }
    });
    //hand off to jQuery.param for proper encoding
    return $.param(a);
  };

  $.fn.fieldValue = function(successful) {
    for (var val = [], i = 0, max = this.length; i < max; i++) {
      var el = this[i];
      var v = $.fieldValue(el, successful);
      if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
        continue;
      }
      if (v.constructor == Array) {
        $.merge(val, v);
      } else {
        val.push(v);
      }
    }
    return val;
  };

  /**
   * Returns the value of the field element.
   */
  $.fieldValue = function(el, successful) {
    var n = el.name,
      t = el.type,
      tag = el.tagName.toLowerCase();
    if (successful === undefined) {
      successful = true;
    }

    if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
        (t == 'checkbox' || t == 'radio') && !el.checked ||
        (t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
        tag == 'select' && el.selectedIndex == -1)) {
      return null;
    }

    if (tag == 'select') {
      var index = el.selectedIndex;
      if (index < 0) {
        return null;
      }
      var a = [],
        ops = el.options;
      var one = (t == 'select-one');
      var max = (one ? index + 1 : ops.length);
      for (var i = (one ? index : 0); i < max; i++) {
        var op = ops[i];
        if (op.selected) {
          var v = op.value;
          if (!v) { // extra pain for IE...
            v = (op.attributes && op.attributes.value && !(op.attributes.value.specified)) ? op.text : op.value;
          }
          if (one) {
            return v;
          }
          a.push(v);
        }
      }
      return a;
    }
    return $(el).val();
  };

  //Clears the form data. 
  $.fn.clearForm = function(includeHidden) {
    return this.each(function() {
      $('input,select,textarea', this).clearFields(includeHidden);
    });
  };

  //Clears the selected form elements.
  $.fn.clearFields = $.fn.clearInputs = function(includeHidden) {
    var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; // 'hidden' is not in this list
    return this.each(function() {
      var t = this.type,
        tag = this.tagName.toLowerCase();
      if (re.test(t) || tag == 'textarea') {
        this.value = '';
      } else if (t == 'checkbox' || t == 'radio') {
        this.checked = false;
      } else if (tag == 'select') {
        this.selectedIndex = -1;
      } else if (t == "file") {
        if (/MSIE/.test(navigator.userAgent)) {
          $(this).replaceWith($(this).clone(true));
        } else {
          $(this).val('');
        }
      } else if (includeHidden) {
        // includeHidden can be the value true, or it can be a selector string
        // indicating a special test; for example:
        //  $('#myForm').clearForm('.special:hidden')
        // the above would clean hidden inputs that have the class of 'special'
        if ((includeHidden === true && /hidden/.test(t)) ||
          (typeof includeHidden == 'string' && $(this).is(includeHidden))) {
          this.value = '';
        }
      }
    });
  };

  //Resets the form data.  Causes all form elements to be reset to their original value.
  $.fn.resetForm = function() {
    return this.each(function() {
      // guard against an input with the name of 'reset'
      // note that IE reports the reset function as an 'object'
      if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
        this.reset();
      }
    });
  };


  // QxunForm PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function() {
      new QxunForm($(this), option);
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