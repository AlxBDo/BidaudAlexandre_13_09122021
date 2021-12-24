/**
 * provides the routes, control functions and resources for retrieving data from the API required by the user
 * @class
 */
class UserService {

    /**
     * Provides routes to site pages and API
     */
    routes = { 
        loginApi: 'user/login',
        loginPage: '/login', 
        profilApi: 'user/profile', 
        profilPage: '/profil', 
    };
 
    /**
     * Checks the email format
     * @param {string} email 
     * @returns {boolean} true = email format is correct
     */
    checkEmail(email){ return /([\w-.]+@[\w.]+\.{1}[\w]+)/.test(email) ? true : false } ;

    /**
     * Checks the length of the element passed as the first parameter
     * @param {string} item 
     * @param {number} minLength 
     * @param {number} maxLength 
     * @returns {boolean} true if the element meets the control criteria
     */
    checkLength(item, minLength, maxLength){ 
        const itemLength = item.length
        return itemLength >= minLength ? maxLength >= itemLength : false 
    };

    /**
     * Checks the name format (first and last name)
     * @param {string} name 
     * @returns {boolean} true if the element meets the control criteria
     */
    checkName(name){ 
        return typeof name === "string" && this.checkLength(name, 2, 20) && !/[0-9]/.test(name)
        ? this.checkSpecialCharacters(name) : false 
    };

    /**
     * Checks the password format
     * @param {string} password 
     * @returns {boolean} true if the element meets the control criteria
     */
    checkPassword(password){ 
        return typeof password === "string" && this.checkLength(password, 6, 12) ? this.checkSpecialCharacters(password) : false 
    };

    /**
     * Checks the presence of special characters
     * @param {string} string 
     * @returns {boolean} true if presence is confirmed
     */
    checkSpecialCharacters(string) { return /[@:./\\_{}[\]()|%*$£?!&~#`µ]/.test(string) ? false : true };


    /**
     * Provides the Axios configuration parameter with the header request
     * @param {string} token 
     * @returns {object} header for Axios request
     */
    getAxiosConfig(token) { return token ? { headers: { Authorization: `Bearer ${token}` } } : null  }

    /**
     * Provides Axios method to connect to the Api
     * @param {string} task 
     * @returns {string} PUT or POST
     */
    getAxiosMethod(task = false) { return task === 'update' ? 'PUT' : 'POST' }

    /**
     * Provides body params for Axios request
     * @param {string} task : "login", "get" or "update"
     * @param {string} param1_value 
     * @param {string} param2_value 
     * @returns {object}
     */
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

}


export const userService = new UserService()