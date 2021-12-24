import { selectLogin } from "../utils/selectors";
import { createSlice } from '@reduxjs/toolkit'

import * as consultApiAction from '../features/consultApi'
import * as storageServiceAction from '../features/storageService'
import * as userAction from '../features/user'
import { userService } from "../services/userService";

const initialState = {
    status: 'start',
    error: null,
    token: null,
    rememberUser: false
}

/**
 * provides the user credentials to the API in order to logged him
 * @param {string} userEmail 
 * @param {string} userPassword 
 * @param {boolean} rememberUser 
 */
export function authenticate(userEmail, userPassword, rememberUser = false) {
  return async (dispatch, getState) => {
    const login = selectLogin()
    const status = login(getState()).status
    if (status === 'pending') {
      return
    }
    dispatch(actions.fetching(rememberUser))
    const apiResponse = dispatch(fetchApiToken(userEmail, userPassword))
    return apiResponse.then( (value) => {
      if(value.status === 200){ return value.body.token
      } else { 
        dispatch(actions.loggedout())
        dispatch(actions.error(value.message)) 
        return false
      }
    }).then( (token) => {
      if(token.length > 20){
        dispatch(storageServiceAction.saveItem('token', token, true))
        dispatch(storageServiceAction.saveItem('rememberUser', rememberUser, false, false))
        dispatch(actions.authentication(token, rememberUser))
        dispatch(userAction.authenticate(userEmail, userPassword, token)).then( (value) => {
          return value ? dispatch(actions.loggedin()) : dispatch(actions.loggedout())
        })
      }
    })
  }
}

/**
 * stop the login service
 */
export function endLogin(){
  return async (dispatch, getState) => {
    const login = selectLogin()
    dispatch(storageServiceAction.close(!login(getState()).rememberUser))
    dispatch(userAction.clear())
    dispatch(actions.loggedout())
  }
}

function fetchApiToken(userEmail, userPassword){
  return async (dispatch) => {
    return await dispatch(
      consultApiAction.fetchOrUpdateDataApi(
        userService.routes.loginApi, 
        userService.getAxiosMethod(), 
        userService.getAxiosParams('login', userEmail, userPassword)
      ))
  }
}

/**
 * checks the presence of a token or remerberMe in localStorage to log the user 
 */
export function startLogin(){
    return async (dispatch, getState) => {
      let token = storageServiceAction.getItem('token', true)
      let rememberUser = storageServiceAction.getItem('rememberUser', false)
      if(token){ 
        dispatch(actions.authentication(dispatch(token), dispatch(rememberUser)))
        dispatch(actions.loggedin())
      } else if(rememberUser){
        const login = selectLogin()
        const status = login(getState()).status
        if (status === 'pending') {
          return
        }
        dispatch(
          authenticate(
            dispatch(storageServiceAction.getItem('userEmail')), 
            dispatch(storageServiceAction.getItem('userPassword')), 
            true
        ))
      } else { dispatch(actions.loggedout()) }
      return
    }
}

/**
 * @name login
 * @description redux component providing the login service to the user
 */
const { actions, reducer } = createSlice({
  name: 'login',
  initialState,
  reducers: {
    error: {
      prepare: (errorMessage) => ({
        payload: errorMessage,
      }),
      reducer: (draft, action) =>{
        draft.error = action.payload !== "Network Error" ? "Username or Password are wrong." : 'Server is offline'
        draft.status = 'error'
        return
      }
    },
    fetching: {
      prepare: (rememberUser) => ({
        payload: rememberUser,
      }),
      reducer: (draft, action) =>{
        draft.rememberUser = action.payload
        draft.status = 'pending'
        return
      }
    },
    authentication: {
      prepare: (token, rememberUser) => ({
        payload: {token, rememberUser}
      }),
      reducer: (draft, action)=>{
        if(action.payload.token.length > 10) {
          draft.token =  action.payload.token
          draft.rememberUser =  action.payload.rememberUser
        } else {
          draft.status = "loggedout"
          draft.error = "Wrong Token !"
        }
        return 
      }
    },
    loggedin: (draft) => {
      draft.status = 'loggedin'
      return 
    },
    loggedout: (draft) => {
      draft.status = 'loggedout'
      draft.token = null
      draft.error = null 
      draft.rememberUser = false
      return
    },
    start: (draft) => {
      if(!localStorage.getItem('rememberUser')){ draft.status = 'loggedout' }
      return
    },
  },
})

export const {authentication, error, loggedin, loggedout} = actions

export default reducer