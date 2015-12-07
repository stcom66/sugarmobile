/*
* выводим в форму сделки следующие поля
* название
* сумма
* контрагент
* стадия продаж
* дата закрытия
* описание
* ответственный
* задачи по сделке
* контакты по сделке
* */

myApp.onPageInit('deal', function (page) {
    var id=page.query.id;
    dealinfo=myCrm.getDeal(id);
    var info=(function leftmenu(){
        var cont=$$(page.container).find(".content-block").html().replace(/&gt;/g,'>').replace(/&lt;/g,'<');
        obj={
            name: dealinfo.name,
            amount: dealinfo.amount,
            partner:function(dealinfo){
                if(dealinfo.accounts && dealinfo.accounts.length>0){
                    return dealinfo.accounts[0].name;
                }
                return '';
            }(dealinfo),
            salestage:dealinfo.sales_stage,
            dateclose:moment(dealinfo.date_closed).format('DD.MM.YYYY'),
            description:dealinfo.description,
            manager:dealinfo.manager,
            contacts:dealinfo.contacts||[],
            tasks:dealinfo.tasks||[]
        };
        var menu = _.template(cont)(obj);
        return menu;
    }());
    $$(page.container).find(".content-block").html(info);
    $$(page.navbarInnerContainer).find('#savedeal').on('click',function(event){
        event.preventDefault();
        var formData = myApp.formToJSON('#maininfo');
        if(myCrm.setDeal(page.query.id,formData)){
            myApp.modal({
                title:  '',
                text: 'Данные записаны успешно',
                buttons: [
                    {
                        text: 'OK',
                    },
                ]
            })
        }
    });
});
