import { selectLogin } from "../utils/selectors";
import { createSlice } from '@reduxjs/toolkit'

import * as consultApiAction from '../features/consultApi'
import * as storageServiceAction from '../features/storageService'

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
    dispatch(fetchApiToken(userEmail, userPassword))
  }
}

export function endLogin(){
  return async (dispatch, getState) => {
    const login = selectLogin()
    dispatch(storageServiceAction.close(!login(getState()).rememberUser))
    dispatch(actions.loggedout())
  }
}

export function validAuthentication(data, rememberUser){
  return async (dispatch) => {
    dispatch(consultApiAction.clear())
    if(data.body.token.length > 10 && data.status === 200){
      dispatch(storageServiceAction.saveItem('token', data.body.token, true))
      dispatch(storageServiceAction.saveItem('rememberUser', rememberUser, false, false))
      dispatch(actions.authentication(data.body.token, rememberUser))
      dispatch(fetchApiUser(data.body.token))
    } else {
      dispatch(actions.loggedout())
      console.error(`Wrong Token : ${data.body.token}`, data.message)
    }
  }
}

export function validUser(data){
  return async (dispatch) => {
    if(data.status === 200 && data.body.firstName && data.body.lastName && data.body.id){
      dispatch(storageServiceAction.saveItem("userFirstName", data.body.firstName))
      dispatch(storageServiceAction.saveItem("userLastName", data.body.lastName))
      dispatch(storageServiceAction.saveItem("userId", data.body.id))
      dispatch(actions.loggedin())
    } else {
      dispatch(actions.loggedout())
      console.error("Failed to retrieve user data !", data.message)
    }
    dispatch(consultApiAction.clear())
  }
}

function fetchApiToken(userEmail, userPassword){
  return async (dispatch) => {
    dispatch(
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
    dispatch( consultApiAction.fetchOrUpdateDataApi(
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
      if(token){ dispatch(actions.loggedin(token, rememberUser))
      } else if(rememberUser){
        const login = selectLogin()
        const status = login(getState()).status
        if (status === 'pending') {
          return
        }
        dispatch(actions.fetching(true))
        dispatch(fetchApiToken(storageServiceAction.getItem('userEmail'), storageServiceAction.getItem('userPassword')))
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