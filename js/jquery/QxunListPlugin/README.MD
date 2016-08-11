# QxunListPlugin
jquery 列表插件
## 示例（demo）
列表：[列表](http://oceanbaby715.github.io/KnowledgeBase/js/jquery/QxunListPlugin/demo/index.html)<br>
## 依赖 (dependence)
jQuery 1.7以上版本和jquery-tmpl 插件
## 使用方法 (usage)
引入js文件

    <script src="../dist/jquery.min.js"></script>
    <script src="../dist/jquery.tmpl.min.js"></script>
    <script src="../dist/jquery.qxun.list.js"></script>
***
    $(function(){
        $("#list").QxunList({
            getDataUrl: "data.json?rnd=2",
            tmplId:"listTmpl",
            listContainerId:"list",
            searchBtnId:"searchBtnId",
            searchClass:"searchItem",
            pageSize:10
        })
    })

## 参数列表 (options)

|    参数          |     说明       |   类型   |   默认值   | 可填值 |
|------------------|----------------|----------|------------|--------|
| getDataUrl       | 获取数据的地址 | string   |     空     |        |
| tmplId      | jqueyr tmpl模板ID   | string   |  |     |
| listContainerId  | 容器ID       | string   |      |          |
| searchBtnId | 搜索按钮的id | string   |    |            |
| searchClass   | 搜索条件的class| string  |    |            |
| pageSize  | 每页显示的条数| int   |||

