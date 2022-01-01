import { createSlice } from '@reduxjs/toolkit'
import * as consultApiAction from '../features/consultApi'
import * as storageServiceAction from '../features/storageService'
import { userService } from "../services/userService";
 
/**
 * Authenticate user and try to fetch other user datas
 * @function
 * @param {string} email 
 * @param {string} password 
 * @param {string} token 
 */
export const authenticate = (email, password, token) => {
    if(userService.checkEmail(email) && userService.checkPassword(password)){
        return async (dispatch) => {
            const personalInfos = dispatch(fetchPersonalInformations(token))
            if(personalInfos){
                return personalInfos.then( (value) => {
                  if(value.status === 200){ return value.body
                  } else { 
                    dispatch(actions.clear())
                    dispatch(actions.error(value.message)) 
                  }
                }).then( (data) => {
                    if( userService.checkName(data.firstName) && userService.checkName(data.lastName) ){
                        return dispatch(saveUser(email, data.firstName, data.id, data.lastName, password, true))
                    } else {
                        dispatch(actions.clear())
                        dispatch(actions.error("Failed to retrieve user data !"))
                    }
                })
            }
            return false
        }
    }
}

/**
 * Retrieves user data from API (use consultApi component)
 * @param {string} token 
 * @returns {object} API response
 * @see consultApi
 */
function fetchPersonalInformations(token){
    return async (dispatch) => {
        return await dispatch( consultApiAction.fetchOrUpdateDataApi(
            userService.routes.profilApi, 
            userService.getAxiosMethod(),
            userService.getAxiosParams('get', token), 
            userService.getAxiosConfig(token)
        ))
    }
}

/**
 * Update user first name and last name
 * @function
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} token
 */
export const updateUserInformation = (firstName, lastName, token) => {
    return (dispatch) => {
        dispatch(consultApiAction.fetchOrUpdateDataApi(
            userService.routes.profilApi, 
            userService.getAxiosMethod('update'),
            userService.getAxiosParams('update', firstName, lastName),
            userService.getAxiosConfig(token)
        ))
        dispatch(storageServiceAction.save(
            {name: 'userFirstName', value: firstName, crypt: true}, 
            {name: 'userLastName', value: lastName, crypt: true}
        ))
        dispatch(actions.update('firstname', firstName))
        dispatch(actions.update('lastname', lastName))
    }
}

/**
 * retrieves the user information from localStorage (use storageService component)
 * @returns {boolean}
 * @see storageService
 */
export function userMemory(){
    return (dispatch) => {
        dispatch( saveUser(
            storageServiceAction.getItem('userEmail'),
            storageServiceAction.getItem('userFirstName'), 
            storageServiceAction.getItem('userId'), 
            storageServiceAction.getItem('userLastName'), 
            storageServiceAction.getItem('userPassword')
        ))
        return true
    }
}

/**
 * Save user information to the state and to localStorage if last parameter is true
 * @param {string} email 
 * @param {string} firstName 
 * @param {string} id 
 * @param {string} lastName 
 * @param {string} password 
 * @param {boolean} saveToStorage 
 * @returns {boolean} true
 */
function saveUser(email, firstName, id, lastName, password, saveToStorage = false){
    return async (dispatch) => {
        if(saveToStorage){
            const baseObject = {intoSession: false, crypt: true}
            dispatch(storageServiceAction.save(
                {name: "userEmail", value: email, ...baseObject},
                {name: "userFirstName", value: firstName, ...baseObject},
                {name: "userId", value: id, ...baseObject},
                {name: "userLastName", value: lastName,  ...baseObject},
                {name: "userPassword", value: password,  ...baseObject},
            ))
        }
        dispatch(actions.identify(email, firstName, id, lastName, password))
        return true 
    }
}


const initialState = {
    status: 'void',
    email: null,
    error: false,
    firstname: null,
    id: null,
    lastname: null,
    password: null
}

/**
 * @name user 
 * @description store user information 
 */
const {actions, reducer } = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clear: (draft) => {
            draft.status = 'void' 
            draft.email = null 
            draft.firstname = null 
            draft.error = false 
            draft.id = null 
            draft.lastname = null 
            draft.password = null 
            return 
        },
        error: {
            prepare: (errorMessage) => ({
                payload: {errorMessage}
            }),
            reducer: (draft, action) => {
                draft.error = action.payload.errorMessage
                draft.status = 'error' 
                return 
            }
        },
        identify: {
            prepare: (email, firstname, id, lastname, password) => ({
                payload: { email, firstname, id, lastname, password }
            }),
            reducer: (draft, action) => {
                draft.email = action.payload.email
                draft.firstname = action.payload.firstname 
                draft.id = action.payload.id 
                draft.lastname = action.payload.lastname 
                draft.password = action.payload.password
                draft.status = 'identified' 
                return 
            }
        },
        update: {
            prepare: (itemName, item) => ({
                payload: { itemName, item }
            }),
            reducer: (draft, action) => {
                draft[action.payload.itemName] = action.payload.item
                return
            }
        }
    },
})

export const { clear, error, identify, update } = actions

export default reducer