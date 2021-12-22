//import * as strorageServiceAction from '../features/storageService'

class UserService {

    email = null ;

    firstName = null;

    lastName = null;

    password = null;

    routes = { 
        loginApi: 'user/login',
        loginPage: '/login', 
        profilApi: 'user/profile', 
        profilPage: '/profil', 
    };
 

    checkEmail(email){ return /([\w-.]+@[\w.]+\.{1}[\w]+)/.test(email) ? true : false } ;

    checkLength(item, minLength, maxLength){ return item.length >= minLength && item.length <= maxLength ? true : false };

    checkName(name){ return typeof name === "string" && this.checkLength(name, 2, 20) ? this.checkSpecialCharacters(name) : false };

    checkSpecialCharacters(string) { return /[@:./\\_{}[\]()|%*$£?!&~#`µ0-9]/.test(string) ? false : true };


    getAxiosConfig(token) { return token ? { headers: { Authorization: `Bearer ${token}` } } : null  }

    getAxiosMethod(task) { return task === 'update' ? 'PUT' : 'POST' }

    getAxiosParams(task, param1_value = false, param2_value = false){
        if(task === 'login' && param1_value && param2_value){
            return { 
                "email": param1_value, 
                "password": param2_value 
            }
        } else if(task === 'get' && param1_value) { return { "token": param1_value }
        } else if(task === 'update' && param1_value && param2_value){
            return { 
                "firstName": param1_value, 
                "lastName": param2_value 
            }
        } else {
            console.error('userService.getAxiosParams ERROR : impossible to determine the task to be performed !')
        }
    }


    setEmail(email){ if(this.checkEmail(email)){ this.email = email } };

    setFirstName(firstname){ if(this.checkName(firstname)){ this.firstName = firstname } };

    setLastName(lastname){ if(this.checkName(lastname)){ this.lastName = lastname } }

    setPassword(password){ if(this.checkLength(password, 6, 12)){ this.password = password } }

}


export const userService = new UserService()