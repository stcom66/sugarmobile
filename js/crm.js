//функции для работы с crm
//
//User=(function(){
//    if (arguments.callee._singletonInstance) {
//        return arguments.callee._singletonInstance;
//    }
//    arguments.callee._singletonInstance = this;
//    var id=undefined;
//    var name=getUsernameFromStorage();
//    var hash=getPasswordFromStorage();
//    var userSet=false;
//    if(name && hash){
//        this.userSet=true;
//    };
//    function getUsernameFromStorage(){
//        if(localStorage.getItem('username')!==null&&localStorage.getItem('username').length!=0){
//            return localStorage.getItem('username');
//        }
//        return undefined;
//    }
//    function getPasswordFromStorage(){
//        if(localStorage.getItem('hash')!==null&&localStorage.getItem('hash').length!=0){
//            return localStorage.getItem('hash');
//        }
//        return undefined;
//    }
//
//    return ({
//        id:id,
//        name:name,
//        getUsernameFromStorage:getUsernameFromStorage,
//        getPasswordFromStorage:getPasswordFromStorage,
//        ifUserSet:function(){
//            return userSet;
//        },
//        saveUserData:function(username,password){
//            localStorage.setItem('username',username);
//            localStorage.setItem('hash',md5(password));
//            name=username;
//            hash=md5(password);
//            userSet=true;
//        },
//        setUserData:function(userData){
//        for(prop in userData) {
//            if (!this.hasOwnProperty(prop)) continue;
//            prop=userData[prop];
//        }
//    }
//    });
//})();
////function User(){
////    if (arguments.callee._singletonInstance) {
////        return arguments.callee._singletonInstance;
////    }
////    arguments.callee._singletonInstance = this;
////    this.id=undefined;
////    this.name=getUsernameFromStorage();
////    this.hash=getPasswordFromStorage();
////    this.userSet=false;
////    if(this.name && this.hash){
////        this.userSet=true;
////    }
////
////    function getUsernameFromStorage(){
////        if(localStorage.getItem('username')!==null&&localStorage.getItem('username').length!=0){
////            return localStorage.getItem('username');
////        }
////        return undefined;
////    }
////
////    function getPasswordFromStorage(){
////        if(localStorage.getItem('hash')!==null&&localStorage.getItem('hash').length!=0){
////            return localStorage.getItem('hash');
////        }
////        return undefined;
////    }
////
////    // функции для регистрации пользователя в программе
////
////    this.ifUserSet=function(){
////        return this.userSet;
////    }
////
////
////    this.saveUserData=function(username,password){
////        localStorage.setItem('username',username);
////        localStorage.setItem('hash',md5(password));
////        this.name=username;
////        this.hash=md5(password);
////        this.userSet=true;
////    }
////
////
////    this.setUserData=function(userData){
////        for(prop in userData) {
////            if (!this.hasOwnProperty(prop)) continue;
////            this[prop]=userData[prop];
////        }
////    }
////}

;(function () {
    var inited;
    var session;

    function crm() {
    }

    function makeRequest(url) {
        var reqpar = {};
        $$.ajax({
            url: url,
            contentType: "json",
            crossDomain: true,
            async: false,
            success: function (data, status, xhr) {
                reqpar = JSON.parse(data);
            }
        });
        return reqpar;
    }

    function makeUri(method, par) {
        return "http://www.1c2all.ru/service/v4_1/rest.php?method=" + method + "&input_type=JSON&response_type=JSON&rest_data=" + encodeURIComponent(JSON.stringify(par));
    }

    function setError(errorText) {
        crmError.errorText = errorText;
        crmError.isError = true;
    }

    function isError(errorText) {
        return crmError.isError;
    }

    /*
     * подготовка результатов  запроса для последующего вывода
     * */
    function prepareDeals(entry) {
        if (typeof(entry) == 'object') {
            var items = {};
            var elements = [];
            for (var i = 0; i < entry.entry_list.length; i++) {
                var value_list = entry.entry_list[i].name_value_list;
                var curitem = {};
                for (var key in value_list) {
                    if (value_list.hasOwnProperty(key)) {
                        curitem[value_list[key].name] = value_list[key].value;
                    }
                }
                var relitem;
                relation=entry.relationship_list[i].link_list||entry.relationship_list[i];
                    relation.forEach(function(link){
                        curitem[link.name]=[];
                        link.records.forEach(function(r){
                            var relitem=new Object();
                            record= r.link_value||r;
                            for (var key in record) {
                                if (record.hasOwnProperty(key)) {
                                    relitem[record[key].name] = record[key].value;
                                }
                            }
                            curitem[link.name].push(relitem);
                        });
                    });
                elements.push(curitem);
            }
            return elements;
        }
        return undefined;
    }

    function prepareContacts(entry) {
        if (typeof(entry) == 'object') {
            var items = {};
            var elements = [];
            for (var i = 0; i < entry.entry_list.length; i++) {
                var value_list = entry.entry_list[i].name_value_list;
                var curitem = {};
                for (var key in value_list) {
                    if (value_list.hasOwnProperty(key)) {
                        curitem[value_list[key].name] = value_list[key].value;
                    }
                }
                var relitem;
                if(!entry.relationship_list[i]){elements.push(curitem);continue;}
                relation=entry.relationship_list[i].link_list||entry.relationship_list[i];
                relation.forEach(function(link){
                    curitem[link.name]=[];
                    link.records.forEach(function(r){
                        var relitem=new Object();
                        record= r.link_value||r;
                        for (var key in record) {
                            if (record.hasOwnProperty(key)) {
                                relitem[record[key].name] = record[key].value;
                            }
                        }
                        curitem[link.name].push(relitem);
                    });
                });
                elements.push(curitem);
            }
            return elements;
        }
        return undefined;
    }
    function prepareTasks(entry) {
        if (typeof(entry) == 'object') {
            var items = {};
            var elements = [];
            for (var i = 0; i < entry.entry_list.length; i++) {
                var value_list = entry.entry_list[i].name_value_list;
                var curitem = {};
                for (var key in value_list) {
                    if (value_list.hasOwnProperty(key)) {
                        curitem[value_list[key].name] = value_list[key].value;
                    }
                }
                var relitem;
                relation=(entry.relationship_list[i])?entry.relationship_list[i].link_list||entry.relationship_list[i]:[];
                relation.forEach(function(link){
                    curitem[link.name]=[];
                    link.records.forEach(function(r){
                        var relitem=new Object();
                        record= r.link_value||r;
                        for (var key in record) {
                            if (record.hasOwnProperty(key)) {
                                relitem[record[key].name] = record[key].value;
                            }
                        }
                        curitem[link.name].push(relitem);
                    });
                });
                elements.push(curitem);
            }
            return elements;
        }
        return undefined;
    }

    function prepareUnit(entry) {
        if (typeof(entry) == 'object') {
            var items = {};
            var elements = [];
            for (var i = 0; i < entry.entry_list.length; i++) {
                var value_list = entry.entry_list[i].name_value_list;
                var curitem = {};
                for (var key in value_list) {
                    if (value_list.hasOwnProperty(key)) {
                        curitem[value_list[key].name] = value_list[key].value;
                    }
                }
                var relitem;
                relation=entry.relationship_list[i].link_list||entry.relationship_list[i];
                relation.forEach(function(link){
                    curitem[link.name]=[];
                    var relitem={};
                    link.records.forEach(function(record){
                        for (var key in record) {
                            if (record.hasOwnProperty(key)) {
                                relitem[record[key].name] = record[key].value;
                            }
                        }
                        curitem[link.name].push(relitem);
                    });
                });
                elements.push(curitem);
            }
            return elements;
        }
        return undefined;
    }

    crm.init = function () {
        var self = this;
        inited = true;
        if (!arguments.callee._singletonInstance) {
            arguments.callee._singletonInstance = self;
        }
        return arguments.callee._singletonInstance
    }

    crm.login = function (username, hash) {
        if (typeof(arguments[0]) == "function") {
            //считаем что передали пользователя
            if (!arguments[0].getName() || !arguments[0].getHash()) {
                myApp.alert('Установите в настройках имя пользователя', ['']);
                return false;
            }
            var url = makeUri('login', {
                user_auth: {
                    user_name: arguments[0].getName(),
                    password: arguments[0].getHash()
                },
                application_name: "Arch Skin CRM"
            });
        }
        else {
            //передали имя пользователя
            var url = makeUri('login', {
                user_auth: {
                    user_name: username,
                    password: hash
                },
                application_name: "Arch Skin CRM"
            });
        }
        reqpar = makeRequest(url);
        if (reqpar.name == "Invalid Login") {
            setError("Не получается проверить пользователя");
            return false;
        }
        session = reqpar.id;
        return reqpar.name_value_list.user_id.value;
    }

    crm.checkUserCredentials = function (username, password) {
        return this.login(username, md5(password));
    };
    crm.select_tasks = function () {
        var url = makeUri('get_entry_list', {
            session: this.session,
            module_name: "Tasks",
            query: "",
            order_by: "",
            offset: 0,
            select_fields: ["id", "name", "date_entered", "description", "importance_c"],
            link_name_to_fields_array: [],
            max_results: 20,
            deleted: 0,
            favorites: false
        });
        return makeRequest(url);
    }
    crm.getfulluserinfo = function (userid) {
        var url = makeUri('get_entry_list', {
            session: this.session,
            module_name: "Users",
            query: "users.id=" + userid,
            order_by: "",
            offset: 0,
            select_fields: ["title", "department", "phone_mobile", "first_name", "last_name"],
            link_name_to_fields_array: [],
            max_results: 2,
            deleted: 0,
            favorites: false
        });
        responce = makeRequest(url);
        var user = {};
        user.department = responce.entry_list[0].name_value_list.department.value;
        user.title = responce.entry_list[0].name_value_list.title.value;
        user.phone_mobile = responce.entry_list[0].name_value_list.phone_mobile.value;
        user.first_name = responce.entry_list[0].name_value_list.first_name.value;
        user.last_name = responce.entry_list[0].name_value_list.last_name.value;
        return user;
    }
    crm.checkCredentials = function (user) {
        if (!user.userSet) {
            this.setError("user not set");
            return false;
        }
        if (!isError() && !checkUserExist(user)) {
            setError("user not exist");
            return false;
        }
        return true;
    }
    crm.showError = function () {
        if (isError) {
            isError = false;
            myApp.alert(errorText, [""]);
            return true;
        }
        return false;
    }
    crm.checkUserExist = function (user) {
        return this.login(user.getName(), user.getHash());
    }
    crm.getOpenedDeals = function () {
        var url = makeUri('get_entry_list', {
            session: session,
            module_name: "Opportunities",
            query: "opportunities.sales_stage<>'Closed Won' and opportunities.sales_stage<>'Closed Lost'",
            order_by: "",
            offset: 0,
            select_fields: ["id", "name", "amount", "description"],
            link_name_to_fields_array: [
                {
                    name: 'accounts',
                    value: ["name"]
                }
            ],
            max_results: 1000,
            deleted: 0,
            favorites: false
        });
        return prepareDeals(makeRequest(url));
    }
    crm.getMyDeals = function () {
        var url = makeUri('get_entry_list', {
            session: session,
            module_name: "Opportunities",
            query: "opportunities.sales_stage<>'Closed Won' and opportunities.sales_stage<>'Closed Lost' and opportunities.assigned_user_id="+currentUser.getId(),
            order_by: "",
            offset: 0,
            select_fields: ["id", "name", "amount", "description"],
            link_name_to_fields_array: [
                {
                    name: 'accounts',
                    value: ["name"]
                }
            ],
            max_results: 1000,
            deleted: 0,
            favorites: false
        });
        return prepareDeals(makeRequest(url));
    }
    crm.getDeal = function (dealid) {
        var url = makeUri('get_entry', {
            session: session,
            module_name: "Opportunities",
            id: dealid,
            select_fields: ["id", "name", "amount", "description", "date_closed", "sales_stage", "assigned_user_id"],
            link_name_to_fields_array: [
                {
                    name: 'accounts',
                    value: ["name"]
                },
                {
                    name: 'contacts',
                    value: ["id","name", "phone_mobile"]
                },
                {
                    name: 'tasks',
                    value: ["id","name"]
                }
            ]
        });
        var entry = makeRequest(url);
        deal = prepareDeals(entry)[0];
        var url = makeUri('get_entry', {
            session: session,
            module_name: "Users",
            id: deal.assigned_user_id,
            select_fields: ["id", "name"],
            link_name_to_fields_array: []
        });
        var entry = makeRequest(url);
        if(entry.entry_list.length){
            deal.manager=entry.entry_list[0].name_value_list.name.value;
        }
        else{
            deal.manager='';
            }
        return deal;
    }
    crm.setDeal = function (id,dealdata) {
        var name_value=[];
        for(key in dealdata){
            if(dealdata.hasOwnProperty(key)){
                name_value.push({
                    name:key,
                    value:dealdata[key]
                });
            }
        }
        name_value.push({
            name:"id",
            value:id
        });
        var url = makeUri('set_entry', {
            session: session,
            module_name: "Opportunities",
            name_value_list:name_value
        });
        var entry = makeRequest(url);
        return entry;
    }
        //получаем контакты
    crm.getContacts=function(){
        var url = makeUri('get_entry_list', {
            session: session,
            module_name: "Contacts",
            query: "",
            order_by: "name",
            offset: 0,
            select_fields: ["id", "name"],
            link_name_to_fields_array: [],
            max_results: 1000,
            deleted: 0,
            favorites: false
        });
        return prepareContacts(makeRequest(url));
    }
    crm.getContact = function (contactid) {
        var url = makeUri('get_entry', {
            session: session,
            module_name: "Contacts",
            id: contactid,
            select_fields: ["id",  "date_entered",  "date_modified",  "modified_user_id",  "created_by",  "description",  "deleted",  "assigned_user_id",  "first_name",  "last_name",  "title",  "do_not_call",  "phone_home",  "phone_mobile",  "phone_work",  "phone_other",  "phone_fax",  "primary_address_street",  "primary_address_city",  "primary_address_state",  "primary_address_postalcode",  "primary_address_country",  "lead_source",  "birthdate",  "campaign_id",  "joomla_account_id",  "portal_account_disabled",  "portal_user_type"],
            link_name_to_fields_array: []
        });
        var entry = makeRequest(url);
        contact = prepareContacts(entry)[0];
        var url = makeUri('get_entry', {
            session: session,
            module_name: "Users",
            id: contact.assigned_user_id,
            select_fields: ["id", "name"],
            link_name_to_fields_array: []
        });
        var entry = makeRequest(url);
        if(entry.entry_list.length){
            contact.manager=entry.entry_list[0].name_value_list.name.value;
        }
        else{
            contact.manager='';
        }
        return contact;
    }
    //получить сделки текущего пользователя
    crm.getUserDeals = function (userid) {
        var url = makeUri('get_entry_list', {
            session: this.session,
            module_name: "Opportunities",
            query: "opportunities.assigned_user_id='" + userid + "'",
            order_by: "",
            offset: 0,
            select_fields: ["id", "name", "amount", "description"],
            link_name_to_fields_array: [
                {
                    name: 'accounts',
                    value: ["name"]
                }
            ],
            max_results: 1000,
            deleted: 0,
            favorites: false
        });
        var entry = makeRequest(url);
        return entry;
    }
    //получить закрытые сделки
    crm.getClosedDeals = function () {
        var url = makeUri('get_entry_list', {
            session: session,
            module_name: "Opportunities",
            query: "opportunities.sales_stage='Closed Won' or opportunities.sales_stage='Closed Lost'",
            order_by: "",
            offset: 0,
            select_fields: ["id", "name", "amount", "description"],
            link_name_to_fields_array: [
                {
                    name: 'accounts',
                    value: ["name"]
                }
            ],
            max_results: 1000,
            deleted: 0,
            favorites: false
        });
        return prepareDeals(makeRequest(url));
    }
    //получить проигранные сделки
    crm.getLostDeals = function () {
        var url = makeUri('get_entry_list', {
            session: session,
            module_name: "Opportunities",
            query: "opportunities.sales_stage='Closed Lost'",
            order_by: "",
            offset: 0,
            select_fields: ["id", "name", "amount", "description"],
            link_name_to_fields_array: [
                {
                    name: 'accounts',
                    value: ["name"]
                }
            ],
            max_results: 1000,
            deleted: 0,
            favorites: false
        });
        return prepareDeals(makeRequest(url));
    }
    //получить сделки без задач
    crm.getWithoutTasksDeals = function () {

    }
    crm.getTask = function (taskid) {
        var url = makeUri('get_entry', {
            session: session,
            module_name: "Tasks",
            id: taskid,
            select_fields: ["id", "name", "description", "date_due", "date_start", "importance_c","urgency_c"],
            link_name_to_fields_array: [
                {
                    name: 'contacts',
                    value: ["id","name"]
                }
            ]
        });
        var entry = makeRequest(url);
        task = prepareTasks(entry)[0];
        //var url = makeUri('get_entry', {
        //    session: session,
        //    module_name: "Users",
        //    id: deal.assigned_user_id,
        //    select_fields: ["id", "name"],
        //    link_name_to_fields_array: []
        //});
        //var entry = makeRequest(url);
        //if(entry.entry_list.length){
        //    deal.manager=entry.entry_list[0].name_value_list.name.value;
        //}
        //else{
        //    deal.manager='';
        //}
        return task;
    }
    crm.getTasks = function () {
        var url = makeUri('get_entry_list', {
            session: session,
            module_name: "Tasks",
            query: "",
            select_fields: ["id", "name", "description", "date_due", "date_start", "importance_c","urgency_c"],
            link_name_to_fields_array: [
                {
                    name: 'contacts',
                    value: ["id","name"]
                }
            ]
        });
        var entry = makeRequest(url);
        tasks = prepareTasks(entry);
        //var url = makeUri('get_entry', {
        //    session: session,
        //    module_name: "Users",
        //    id: deal.assigned_user_id,
        //    select_fields: ["id", "name"],
        //    link_name_to_fields_array: []
        //});
        //var entry = makeRequest(url);
        //if(entry.entry_list.length){
        //    deal.manager=entry.entry_list[0].name_value_list.name.value;
        //}
        //else{
        //    deal.manager='';
        //}
        return tasks;
    }

    window.Crm = crm;
}());

myCrm = Crm.init();
var userId=myCrm.checkUserExist(currentUser);
if(userId){
    currentUser.init({id:userId});
}

//function Crm(){
//    if (arguments.callee._singletonInstance) {
//        return arguments.callee._singletonInstance;
//    }
//    arguments.callee._singletonInstance = this;
//
//    this.inited=false;
//    this.session=undefined;
//
//    this.makeUri=function(method,par){
//        return "http://www.1c2all.ru/service/v4_1/rest.php?method="+method+"&input_type=JSON&response_type=JSON&rest_data="+encodeURIComponent(JSON.stringify(par));
//    }
//
//    this.login=function(username,hash){
//        var url=this.makeUri('login',{
//            user_auth:{
//                user_name:username,
//                password:hash
//            },
//            application_name:"Arch Skin CRM"
//        });
//        reqpar= dataRequest.makeRequest(url);
//        if(reqpar.name=="Invalid Login"){
//            this.setError("Не получается проверить пользователя");
//        }
//        if(!this.isError()){
//            currentUser.setUserData({
//                id:reqpar.name_value_list.user_id.value
//            });
//            this.session=reqpar.id;
//            return true;
//        }
//        return false;
//    }
//
//    this.select_tasks=function (){
//        var url=this.makeUri('get_entry_list',{
//            session:this.session,
//            module_name:"Tasks",
//            query : "",
//            order_by: "",
//            offset:0,
//            select_fields:["id","name","date_entered","description","importance_c"],
//            link_name_to_fields_array:[],
//            max_results: 20,
//            deleted:0,
//            favorites:false
//        });
//        return dataRequest.makeRequest(url);
//    }
//
//    this.getfulluserinfo=function(userid){
//        var url=this.makeUri('get_entry_list',{
//            session:this.session,
//            module_name:"Users",
//            query : "users.id=1",
//            order_by: "",
//            offset:0,
//            select_fields:["title","department","phone_mobile","first_name","last_name"],
//            link_name_to_fields_array:[],
//            max_results: 2,
//            deleted:0,
//            favorites:false
//        });
//        responce=dataRequest.makeRequest(url);
//        user.department=responce.entry_list[0].name_value_list.department.value;
//        user.title=responce.entry_list[0].name_value_list.title.value;
//        user.phone_mobile=responce.entry_list[0].name_value_list.phone_mobile.value;
//        user.first_name=responce.entry_list[0].name_value_list.first_name.value;
//        user.last_name=responce.entry_list[0].name_value_list.last_name.value;
//        return true;
//    }
//
//    this.CheckCredentials=function(user){
//        if(!user.userSet){
//            this.setError("user not set");
//            return false;
//        }
//        if(!this.isError()&&!this.checkUserExist(user)){
//            this.setError("user not exist");
//            return false;
//        }
//        return true;
//    }
//
//    this.showError=function(){
//        if(crmError.isError){
//            crmError.isError=false;
//            myApp.alert(this.errorText, [""]);
//            return true;
//        }
//        return false;
//    }
//
//    this.setError=function(errorText){
//        crmError.errorText=errorText;
//        crmError.isError=true;
//    }
//
//    this.isError=function(errorText){
//        return crmError.isError;
//    }
//
//    this.checkUserExist=function(user){
//        return this.login(user.name,user.hash);
//    }
//
//    //получить открытые сделки
//    this.getOpenedDeals=function(){
//        var url=this.makeUri('get_entry_list',{
//            session:this.session,
//            module_name:"Opportunities",
//            query : "opportunities.sales_stage<>'Closed Won' and opportunities.sales_stage<>'Closed Lost'",
//            order_by: "",
//            offset:0,
//            select_fields:["id","name","amount","description"],
//            link_name_to_fields_array:[
//                {
//                    name:'accounts',
//                    value: ["name"]
//                }
//            ],
//            max_results: 1000,
//            deleted:0,
//            favorites:false
//        });
//        var entry=dataRequest.makeRequest(url);
//        return entry;
//    }
//
//    //получить сделки текущего пользователя
//    this.getUserDeals=function(userid){
//        var url=this.makeUri('get_entry_list',{
//            session:this.session,
//            module_name:"Opportunities",
//            query : "opportunities.assigned_user_id='"+userid+"'",
//            order_by: "",
//            offset:0,
//            select_fields:["id","name","amount","description"],
//            link_name_to_fields_array:[
//                {
//                    name:'accounts',
//                    value: ["name"]
//                }
//            ],
//            max_results: 1000,
//            deleted:0,
//            favorites:false
//        });
//        var entry=dataRequest.makeRequest(url);
//        return entry;
//    }
//    //получить закрытые сделки
//    this.getClosedDeals=function(){
//        var url=this.makeUri('get_entry_list',{
//            session:this.session,
//            module_name:"Opportunities",
//            query : "opportunities.sales_stage='Closed Won' or opportunities.sales_stage='Closed Lost'",
//            order_by: "",
//            offset:0,
//            select_fields:["id","name","amount","description"],
//            link_name_to_fields_array:[
//                {
//                    name:'accounts',
//                    value: ["name"]
//                }
//            ],
//            max_results: 1000,
//            deleted:0,
//            favorites:false
//        });
//        var entry=dataRequest.makeRequest(url);
//        return entry;
//    }
//    //получить проигранные сделки
//    this.getLostDeals=function(){
//        var url=this.makeUri('get_entry_list',{
//            session:this.session,
//            module_name:"Opportunities",
//            query : "opportunities.sales_stage='Closed Lost'",
//            order_by: "",
//            offset:0,
//            select_fields:["id","name","amount","description"],
//            link_name_to_fields_array:[
//                {
//                    name:'accounts',
//                    value: ["name"]
//                }
//            ],
//            max_results: 1000,
//            deleted:0,
//            favorites:false
//        });
//        var entry=dataRequest.makeRequest(url);
//        return entry;
//    }
//    //получить сделки без задач
//    this.getWithoutTasksDeals=function(){
//
//    }
//}
//
//// запросы и сеть
//dataRequest={
//    makeRequest:function(url){
//    var reqpar={};
//    $$.ajax({
//        url:url,
//        contentType:"json",
//        crossDomain:true,
//        async:false,
//        success:function (data, status, xhr){
//            reqpar=JSON.parse(data);
//        }
//    });
//    return reqpar;
//    }
//};



