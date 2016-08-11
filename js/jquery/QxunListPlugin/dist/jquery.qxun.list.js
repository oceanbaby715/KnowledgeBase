/*!
 * jQuery List Plugin
 * version: 1.0.0-2016.08.10
 * Requires jQuery v1.7 or later7
 * Examples and documentation at: https://github.com/oceanbaby715/KnowledgeBase/tree/gh-pages/js/jquery/QxunListPlugin
 * Project repository: https://github.com/oceanbaby715/KnowledgeBase/tree/gh-pages/js/jquery/QxunListPlugin
 * licensed under the MIT.
 */


+ function($) {
  //'use strict';
  // QxunList PUBLIC CLASS DEFINITION
  // ==============================

  var QxunList = function(element, options) {
    this.$element = $(element);
    this.options=$.extend({}, QxunList.DEFAULTS, options);
    this.footPage={
      Current:1,
      First:1,
      Last:0,
      Next:1, 
      Prev:0,
      PageSection:[]
    };
    this.searchJson={};
    this.init();
  };

  QxunList.VERSION = '0.1.0';

  QxunList.DEFAULTS = {
    getDataUrl: "",
    tmplId:"",
    listContainerId:"",
    searchBtnId:"searchBtnId",
    searchClass:"searchItem",
    pageSize:10
  };
  //初始化
  QxunList.prototype.init = function() {
    var that = this;
    $("#" + that.options.listContainerId).after('<div class="dropload-down"><div class="dropload-refresh">↑上拉加载更多</div></div>');
    that.createLoadTips(1);
    setTimeout(function() {
      that.loadData();
    }, 1000)
    that.bindEvent();
  };

  //获取数据(empty追加还是清空)
  QxunList.prototype.loadData = function(isEmpty) {
    var that = this;
    if (that.isLsatPage()) {
      return false;
    }
    $.ajax({
      type: 'GET',
      url: that.options.getDataUrl,
      async: false,
      data: {
        page: that.footPage.Next,
        pageSize: that.options.pageSize,
        searchJson: JSON.stringify(that.searchJson)
      },
      dataType: 'json',
      success: function(data) {
        //是否获取到数据
        if (data.ContentEntity && data.ContentEntity.Body && data.ContentEntity.Body.length > 0) {
          that.footPage = $.extend(true, {}, that.footPage, data.ContentEntity.Foot);
          //清空重新填充(搜索、刷新)
          if (isEmpty) {
            $("#" + that.options.listContainerId).empty();
          }
          //填充数据
          $("#" + that.options.tmplId).tmpl(data.ContentEntity.Body).appendTo("#" + that.options.listContainerId);
          //是否最后一页
          if (that.isLsatPage()) {
            that.createLoadTips(2);
          }else{
            that.createLoadTips();
          }
        } else {
          that.createLoadTips(2);
          return false;
        }
        //如果加载的数据不足产生滚动条，自动加载下一条数据
        if ($(window).height() >= $(document).height()) {
          if (!that.isLsatPage()) {
            that.createLoadTips(1);
            setTimeout(function() {
              that.loadData(false);
            }, 1000);
          }
        }
      },
      error: function(xhr, type) {
        alert("Ajax error!");
        that.createLoadTips(3);
      }
    });
  }
  //注册事件
  QxunList.prototype.bindEvent = function() {
    var that = this;
    //搜索事件
    $("#" + that.options.searchBtnId).click(function() {
      //重置页码
      that.footPage={
        Current:1,
        First:1,
        Last:0,
        Next:1, 
        Prev:0,
        PageSection:[]
      };
      //组装搜索条件
      $("." + that.options.searchClass).each(function() {
        that.searchJson[$(this).attr("name")] = $.trim($(this).val());
      });
      //清空显示提示在加载
      $("#" + that.options.listContainerId).empty();
      that.createLoadTips(1);
      setTimeout(function() {
        that.loadData(true);
      }, 1000)
    });
    //滚动条
    $(window).scroll(function() {
      //判断滚动条是否到底部了
      if ($(document).scrollTop() >= $(document).height() - $(window).height() - 20) {

        if (!that.isLsatPage()) {
          that.createLoadTips(1);
          setTimeout(function() {
            that.loadData(false);
          }, 1000)
        }
      }
    });
  }
  //创建加载的提示(1:正在加载中、2:没有数据了、default:上拉加载更多)
  QxunList.prototype.createLoadTips = function(status) {
    var tips = '<div class="dropload-refresh">↑上拉加载更多</div>';
    switch (status) {
      case 1:
        tips = '<div class="dropload-load"><span class="loading"></span>加载中...</div>';
        break;
      case 2:
        tips = '<div class="dropload-noData">暂无数据</div>';
        break;
      case 3:
        tips = '<div class="dropload-noData">获取数据失败,刷新重试</div>';
        break;
      default:
        break;
    }
    $(".dropload-down").empty().append(tips);
  }
  //判断是否是最后一页
  QxunList.prototype.isLsatPage=function(){
    var that=this;
    var flag=false;
    if (that.footPage.Current==that.footPage.Last) {
      flag=true;
    }
    return flag;
  }
  // QxunList PLUGIN DEFINITION
    // ========================

  function Plugin(option) {
    return this.each(function() {
      var options = typeof option == 'object' && option;
      new QxunList(this, options);
    });
  };
  $.fn.QxunList=Plugin;
}(jQuery)