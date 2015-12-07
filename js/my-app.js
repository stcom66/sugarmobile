var myApp = new Framework7({
    init: false, // prevent app from automatic initialization
    animateNavBackIcon:true,
    pushState: true,
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }
});

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true,
    // Enable Dom Cache so we can use all inline pages
    domCache: true,
    swipePanel: 'left'
});
$$('.login-screen').on('closed', function (e) {
    pageContainer= $$(e.target);
    var username = pageContainer.find('input[name="username"]').val();
    var password = pageContainer.find('input[name="password"]').val();
    currentUser.saveUserData(username,password);
    pageContainer.find('input[name="username"]').val("");
    pageContainer.find('input[name="password"]').val("");
});
myApp.onPageBeforeInit('index', function (page) {
    /*
    * при открытии главной страницы приложения проверяем наличие интернет
    * если интернет есть пытаемся зайти в систему
    * в случае неуспешного логина выдаем окно с ошибкой
    * в случае успешного создаем текущего пользователя и присваиваем ему значения полученные с сервера
    * также присваиваем в срм идентификатор сессии
    * */
    myCrm.login(currentUser);
    //if(!myCrm.CheckCredentials(currentUser)){
    //    myApp.loginScreen();
    //}
});
// проверка регистрации пользователя при вводе логина и пароля.
$$('.login-screen .close-login-screen').on('click',function(e){
    var username = $$('.login-screen').find('input[name="username"]').val();
    var password = $$('.login-screen').find('input[name="password"]').val();
    currentUser.saveUserData(username,password);
    if(!myCrm.checkUserExist(currentUser)){
        e.stopPropagation();
        $$('.login-screen .close-login-screen').removeClass('close-login-screen');
        myApp.alert("Пользователя с таким именем и паролем не существует", [""]);
    }
    $$('.login-screen').find('input[name="username"]').val("");
    $$('.login-screen').find('input[name="password"]').val("");
    myCrm.getfulluserinfo(currentUser.id);
});
myApp.init(); // init app manually after you've attached all handlers




