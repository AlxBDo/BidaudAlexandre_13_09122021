import { selectLogin } from "../utils/selectors";
import { createSlice } from '@reduxjs/toolkit'

import * as consultApiAction from '../features/consultApi'
import * as storageServiceAction from '../features/storageService'
import { userService } from "../services/userService";

export const authenticate = (email, password, token) => {
    if(userService.checkEmail(email) && userService.checkPassword(password)){
        return (dispatch) => {
            dispatch(actions.authenticated(email, password))
            // get user information from localStorage, if it exists
            if(localStorage.getItem('userEmail')){ return userMemory() }
            // otherwise save the information received as a parameter and recover the missing ones from the API
            dispatch(storageServiceAction.saveItem('userEmail', email))
            dispatch(storageServiceAction.saveItem('userPassword', password))
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
                        dispatch(storageServiceAction.saveItem("userFirstName", data.firstName))
                        dispatch(storageServiceAction.saveItem("userLastName", data.lastName))
                        dispatch(storageServiceAction.saveItem("userId", data.id))
                        dispatch(actions.identify(data.firstName, data.id, data.lastName))
                        return true
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

function userMemory(){
    return (dispatch) => {
        dispatch(actions.identify(
            dispatch(storageServiceAction.getItem('userFirstName')), 
            dispatch(storageServiceAction.getItem('userId')), 
            dispatch(storageServiceAction.getItem('userLastName'))
        ))
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

const {actions, reducer } = createSlice({
    name: 'user',
    initialState,
    reducers: {
        authenticated: {
            prepare: (email, password) => ({
                payload: { email, password }
            }),
            reducer: (draft, action) => {
                draft.email = action.payload.email
                draft.password = action.payload.password
                draft.status = 'authenticated' 
                return 
            }
        },
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
                payload: errorMessage
            }),
            reducer: (draft, action) => {
                draft.error = action.payload.errorMessage
                draft.status = 'error' 
                return 
            }
        },
        identify: {
            prepare: (firstname, id, lastname) => ({
                payload: { firstname, id, lastname }
            }),
            reducer: (draft, action) => {
                draft.firstname = action.payload.firstname 
                draft.id = action.payload.id 
                draft.lastname = action.payload.lastname 
                draft.status = 'identified' 
                return 
            }
        },
    },
})

export const { clear } = actions

export default reducer