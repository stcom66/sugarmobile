myApp.onPageInit('contact', function (page) {
    var id=page.query.id;
    contactinfo=myCrm.getContact(id);
    (function fillContent(){
        var cont=$$(".page[data-page='contact'] .page-content .content-block").html().replace(/&gt;/g,'>').replace(/&lt;/g,'<');
        obj={
            firstName: contactinfo.first_name,
            lastName: contactinfo.last_name,
            manager: contactinfo.manager,
            phoneHome: contactinfo.phone_home,
            phoneMobile: contactinfo.phone_mobile,
            phoneWork: contactinfo.phone_work,
            address: '',
            leadSource: contactinfo.lead_source
        };
        $$(".page[data-page='contact'] .page-content .content-block").html(_.template(cont)(obj));
    }());
});

