myApp.onPageInit('task', function (page) {
    var id=page.query.id;
    taskinfo=myCrm.getTask(id);
    var info=(function leftmenu(){
        var cont=$$(page.container).find(".content-block").html().replace(/&gt;/g,'>').replace(/&lt;/g,'<');
        obj={
            name: taskinfo.name,
            importance: taskinfo.importance_c,
            urgency: taskinfo.urgency_c,
            date_begin: moment(taskinfo.date_due).format('DD.MM.YYYY'),
            description: taskinfo.description
        };
        var menu = _.template(cont)(obj);
        return menu;
    }());
    $$(page.container).find(".content-block").html(info);
});
