import { selectLogin, selectUser } from "../utils/selectors";
import { createSlice } from '@reduxjs/toolkit'
import * as consultApiAction from '../features/consultApi'
import * as storageServiceAction from '../features/storageService'
import * as userAction from '../features/user'
import { userService } from "../services/userService";

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
    dispatch(actions.fetching())
    const token = await dispatch(fetchApiToken(userEmail, userPassword, rememberUser))
    if(token){
      return dispatch(
        userAction.authenticate(
          userEmail, 
          userPassword, 
          token
        )).then( (value) => {
        return value ? dispatch(actions.loggedin(token, rememberUser)) : dispatch(actions.loggedout())
      })
    }
  }
}

/**
 * stop the login service
 */
export function endLogin(){
  return async (dispatch) => {
    dispatch(storageServiceAction.close())
    dispatch(userAction.clear())
    dispatch(actions.loggedout())
  }
}

function fetchApiToken(userEmail, userPassword, rememberUser){
  return async (dispatch) => {
    const apiResponse = await dispatch(
      consultApiAction.fetchOrUpdateDataApi(
        userService.routes.loginApi, 
        userService.getAxiosMethod(), 
        userService.getAxiosParams('login', userEmail, userPassword)
      ))
      if(apiResponse.status === 200){ 
        const token = apiResponse.body.token
        if(token.length > 20){
          dispatch(storageServiceAction.save({name:'rememberUser', value: rememberUser}))
          dispatch(storageServiceAction.save({name: 'token', value: token, crypt: true, intoSession: true}))
          return token
        }
      } else { 
        dispatch(actions.loggedout())
        dispatch(actions.error(apiResponse.message)) 
      }
      return false
  }
}
 
/**
 * checks the presence of a token or remerberMe in localStorage to log the user 
 */
export function startLogin(){
    return async (dispatch, getState) => {
      dispatch(storageServiceAction.start())
      let token = storageServiceAction.getItem('token', true)
      let rememberUser = storageServiceAction.getItem('rememberUser', false)
      if(token){ 
        dispatch(userAction.userMemory())
        dispatch(actions.loggedin(token, rememberUser))
      } else if(rememberUser){
        const login = selectLogin()
        const status = login(getState()).status
        if (status === 'loggedin') { return }
        dispatch(userAction.userMemory())
        const user = selectUser()
        const token = dispatch(
          fetchApiToken(
            user(getState()).email, 
            user(getState()).password, 
            rememberUser
        ))
        dispatch(actions.loggedin(token, rememberUser))
      } else { dispatch(actions.loggedout()) }
      return
    }
}

const initialState = {
    status: 'start',
    error: null,
    token: null,
    rememberUser: false
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
    fetching: (draft) =>{
      draft.status = 'pending'
      return
    },
    loggedin: {
      prepare: (token, rememberUser) => ({
        payload: {token, rememberUser}
      }),
      reducer: (draft, action)=>{
        if(action.payload.token.length > 10) {
          draft.status = 'loggedin'
          draft.token =  action.payload.token
          draft.rememberUser =  action.payload.rememberUser
        } else {
          draft.status = "loggedout"
          draft.error = "Wrong Token !"
        }
        return 
      }
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

export const {error, loggedin, loggedout} = actions

export default reducer