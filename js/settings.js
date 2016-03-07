myApp.onPageBeforeInit('settings', function (page) {
    /*устанавливаем события для сохранения параметров пользователя*/
    document.getElementsByName('login')[0].onchange=function(){
    }
    document.getElementsByName('pass')[0].onchange=function(){
    }
    document.getElementById('checkpassword').onclick=function(){
        var username=document.getElementsByName('login')[0].value;
        var password=document.getElementsByName('pass')[0].value;
        var result=myCrm.checkUserCredentials(username,password);
        if(!result){
            myApp.alert('Не удалось войти в систему',['']);
        }
        else{
            currentUser=User.init({
                id:result,
                name:username,
                password:password
            });
            myApp.alert('Проверка прошла успешно!',['']);
        };
    };
    document.getElementsByName('login')[0].value=currentUser.getName();
    document.getElementsByName('pass')[0].value=currentUser.getPassword();
});
