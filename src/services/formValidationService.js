import { userService } from './userService'

/**
 * Controls the inputs of "user" forms and displays their format errors
 * @class
 */
class FormValidation {

    /**
     * Contains format error messages
     */
    errorMessages = {
        email: " is invalid.",
        name: " must not contain any special characters and its length must be between 2 and 20 characters.",
        password: " must not contain any special characters and its length must be between 6 and 12 characters.",
    }

    /**
     * Controls the input passed as a parameter
     * @param {object} input 
     * @param {string} type : "email", "name" or "password"
     * @param {string} name : the input name to display to users 
     * @returns {boolean} true if the element meets the control criteria
     */
    checkInput(input, type, name){
        const complementMethodName = type.substring(0,1).toUpperCase()+type.substring(1)
        const id = input.getAttribute('id')
        document.getElementById(`${id}-validation`).innerHTML = "" 
        return userService[`check${complementMethodName}`](input.value) 
        ? true : this.error(input, type, name)
    };

    /**
     * Manages the display of the error and puts the focus on the input concerned
     * @param {object} input 
     * @param {string} type : "email", "name" or "password"
     * @param {string} name : the input name to display to users 
     * @returns {boolean} false 
     */
    error(input, type, name){
        input.focus()
        document.getElementById(`${input.getAttribute('id')}-validation`).innerHTML = name + this.errorMessages[type]
        return false
    };

}

export const FormValidationService = new FormValidation()