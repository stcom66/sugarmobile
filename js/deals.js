myApp.onPageInit('deals', function (page) {
    var myDeals=myCrm.getMyDeals();
    var itemtemplate=document.getElementById('item-template').innerHTML;
    itemtemplate=itemtemplate.split('\n').join('').trim();
    var listobj={
        items: myDeals,
        template: itemtemplate,
        height: 75
    };
    //if(!($$('.list-block.virtual-list li').length>0)){
    //    $$('.list-block.virtual-list').html('');

    var myList = myApp.virtualList($$(page.container).find('.virtual-list'), listobj);
    //}
    //myList.resetFilter();
    //myList.update();
    var mySearchbar = myApp.searchbar('.searchbar', {
        searchList: '.list-block',
        searchIn: '.item-title, .item-subtitle'
    });

    //установка событий
    $$(page.navbarInnerContainer).find(".subnavbar .buttons-row").on('click',function(e){
       k=1;
        switch(e.target.id){
            case "mytab":
                myApp.virtualList($$('.virtual-list')[0], {
                    items: myCrm.getMyDeals(),
                    template: $$('#item-template').html().split('\n').join('').trim(),
                    height: 75
                });
                $$('.subnavbar a').removeClass('active');
                $$('#mytab').addClass('active');
                break;
            case "openedtab":
                var openedDeals=myCrm.getOpenedDeals();
                var itemtemplate=document.getElementById('item-template').innerHTML;
                itemtemplate=itemtemplate.split('\n').join('').trim();
                var listobj={
                    items: openedDeals,
                    template: itemtemplate,
                    height: 75
                };
                myApp.virtualList(document.getElementsByClassName('virtual-list')[0], listobj);
                $$('.subnavbar a').removeClass('active');
                $$('#openedtab').addClass('active');
                break;
            case "closedtab":
                myApp.virtualList($$('.virtual-list')[0], {
                    items: myCrm.getClosedDeals(),
                    template: $$('#item-template').html().split('\n').join('').trim(),
                    height: 75
                });
                $$('.subnavbar a').removeClass('active');
                $$('#closedtab').addClass('active');
                break;
            case "losttab":
                myApp.virtualList($$('.virtual-list')[0], {
                    items: myCrm.getLostDeals(),
                    template: $$('#item-template').html().split('\n').join('').trim(),
                    height: function (item) {
                        if (item.picture) return 80; //item with picture is 100px height
                        else return 77; //item without picture is 44px height
                    }
                });
                $$('.subnavbar a').removeClass('active');
                $$('#losttab').addClass('active');
                break;
        }
    });
    $$('.panel-left .content-block').html($$(page.container).find('#left-menu-tmpl').html());
    $$('#sortorder input[type="radio"][name="sortorder"]').on('change',function(e){
        switch(this.value){
            case "Контрагент":
                if($$(document).find('.virtual-list')!=0){
                    var itemsArray=$$(document).find('.virtual-list')[0].f7VirtualList.items;
                    itemsArray=_.sortBy(itemsArray, function(n) {
                        return n.accounts[0].name;
                    });
                    $$(document).find('.virtual-list')[0].f7VirtualList.replaceAllItems(itemsArray);
                }

            break;
            case "Название":
                if($$(document).find('.virtual-list')!=0){
                    var itemsArray=$$(document).find('.virtual-list')[0].f7VirtualList.items;
                    itemsArray=_.sortBy(itemsArray, function(n) {
                        return n.name;
                    });
                    $$(document).find('.virtual-list')[0].f7VirtualList.replaceAllItems(itemsArray);
                }

                break;
            case "СуммаCделки":
                if($$(document).find('.virtual-list')!=0){
                    var itemsArray=$$(document).find('.virtual-list')[0].f7VirtualList.items;
                    itemsArray=_.sortBy(itemsArray, function(n) {
                        return n.amount;
                    });
                    $$(document).find('.virtual-list')[0].f7VirtualList.replaceAllItems(itemsArray);
                }

                break;
        }
    });
});

myCrm.deals_leftmenu=function(){
    var cont=document.getElementById('left-menu-tmpl').innerHTML.replace('&gt;','>');
    cont=cont.replace('&lt;','<');
    var menu = _.template(cont)({
        name: "Сладости"
    });
    return menu;
};
