import { selectLogin } from "../utils/selectors";
import { createSlice } from '@reduxjs/toolkit'

import * as consultApiAction from '../features/consultApi'
import * as storageServiceAction from '../features/storageService'
import { userService } from "../services/userService";

const initialState = {
    status: 'start',
    error: null,
    token: null,
    rememberUser: false
  }

export function authenticate(userEmail, userPassword, rememberUser = false) {
  return async (dispatch, getState) => {
    const login = selectLogin()
    const status = login(getState()).status
    if (status === 'pending') {
      return
    }
    dispatch(actions.fetching(rememberUser))
    dispatch(storageServiceAction.saveItem('userEmail', userEmail))
    dispatch(storageServiceAction.saveItem('userPassword', userPassword))
    const apiResponse = dispatch(fetchApiToken(userEmail, userPassword))
    if(apiResponse){
      apiResponse.then( (value) => {
        if(value.status === 200){ return value.body.token
        } else { 
          dispatch(actions.loggedout())
          dispatch(actions.error(value.message)) 
        }
      }).then( (token) => {
        if(token.length > 20){
          dispatch(storageServiceAction.saveItem('token', token, true))
          dispatch(storageServiceAction.saveItem('rememberUser', rememberUser, false, false))
          dispatch(actions.authentication(token, rememberUser))
          const userInfos = dispatch(fetchApiUser(token))
          if(userInfos){
            userInfos.then( (value) => {
              if(value.status === 200){ return value.body
              } else { 
                dispatch(actions.loggedout())
                dispatch(actions.error(value.message)) 
              }
            }).then( (data) => {
              if(
                userService.checkEmail(data.email) 
                && userService.checkName(data.firstName) 
                && userService.checkName(data.lastName)
              ){
                dispatch(storageServiceAction.saveItem("userFirstName", data.firstName))
                dispatch(storageServiceAction.saveItem("userLastName", data.lastName))
                dispatch(storageServiceAction.saveItem("userId", data.id))
                dispatch(actions.loggedin())
              } else {
                dispatch(actions.error("Failed to retrieve user data !"))
                dispatch(actions.loggedout())
              }
            })
          }
        }
      })
    }
  }
}

export function endLogin(){
  return async (dispatch, getState) => {
    const login = selectLogin()
    dispatch(storageServiceAction.close(!login(getState()).rememberUser))
    dispatch(actions.loggedout())
  }
}

function fetchApiToken(userEmail, userPassword){
  return async (dispatch) => {
    return await dispatch(
      consultApiAction.fetchOrUpdateDataApi('user/login', "POST", {
        'email': userEmail,
        'password': userPassword 
    }))
  }
}

function fetchApiUser(token){
  return async (dispatch) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    return await dispatch( consultApiAction.fetchOrUpdateDataApi(
      'user/profile', 
      "POST", 
      { 'token': token }, config) 
    )
  }
}

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
        dispatch(authenticate(storageServiceAction.getItem('userEmail'), storageServiceAction.getItem('userPassword'), true))
      } else { dispatch(actions.loggedout()) }
      return
    }
}
  
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