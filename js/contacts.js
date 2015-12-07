myApp.onPageInit('contacts', function (page) {
    contactinfo=myCrm.getContacts();
    var myList = myApp.virtualList($$(page.container).find('.virtual-list'), {
        items: contactinfo,
        template: $$('#item-template').html().split('\n').join('').trim(),
        rowsAfter:contactinfo.length,
        height: 45
    });
    var mySearchbar = myApp.searchbar('.searchbar', {
        searchList: '.list-block',
        searchIn: '.item-title'
    });
});
