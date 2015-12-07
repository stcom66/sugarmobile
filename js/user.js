;(function() {
    function user() {
        _id=arguments[0].id;
    }
    var _id;
    var _name;
    var _hash;
    var _password;
    var _userSet=(_name!=undefined && _hash!=undefined);
    user.initFromStorage=function(){
        var user=this.init();
        user.setName(this.getUsernameFromStorage());
        user.setPassword(this.getPasswordFromStorage().password);
        return user;
    }
    user.getUsernameFromStorage=function(){
        if(localStorage.getItem('username')!==null&&localStorage.getItem('username').length!=0){
            return localStorage.getItem('username');
        }
        return undefined;
    };
    user.setUsernameToStorage=function(){
        localStorage.setItem('username',this._name);
    };
    user.getPasswordFromStorage=function(){
        if(localStorage.getItem('hash')!==null&&localStorage.getItem('hash').length!=0){
            return {hash:localStorage.getItem('hash'),password:localStorage.getItem('password')};
        }
        return {};
    };
    user.setPasswordToStorage=function(){
        localStorage.setItem('hash',this._hash);
        localStorage.setItem('password',this._password);
    };
    user.getId=function(){
        return this._id;
    }
    user.setId=function(id){
        this._id=id;
    }
    user.getName=function(){
        return this._name;
    }
    user.setName=function(name){
        this._name=name;
    }
    user.getPassword=function(){
        return this._password;
    }
    user.setPassword=function(password){
        this._password=password;
        this._hash=md5(password);
    }
    user.getHash=function(){
        return this._hash;
    }
    user.ifUserSet=function(){
        return this._userSet;
    };
    user.saveUserData=function(username,password){
        localStorage.setItem('username',username);
        localStorage.setItem('hash',md5(password));
        localStorage.setItem('password',password);
        this.setName(username);
        this.setPassword(password);
        this._userSet=true;
    };
    user.setUserData=function(userData) {
        for (prop in userData) {
            if (!this.hasOwnProperty(prop)) continue;
            this.prop = userData[prop];
        }
    }

    user.init=function(){
        var self=this;
        if(typeof arguments[0]=='object'){
            self._id=arguments[0].id || self._id;
            self._name=arguments[0].name || self._name;
            self._hash=arguments[0].password==undefined?self._hash:md5(arguments[0].password);
            self._password=arguments[0].password || self._password;
            if(self.getName() && self.getPassword()) self.saveUserData(self.getName(),self.getPassword());
            //_userSet=(_name!=undefined && _hash!=undefined);
        }
        if (!arguments.callee._singletonInstance) {
            arguments.callee._singletonInstance = self;
        }
        return arguments.callee._singletonInstance
    }
    window.User = user;

}());

window.currentUser=User.initFromStorage();
k=1;