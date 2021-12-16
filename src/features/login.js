import { selectLogin } from "../utils/selectors";
import { createSlice } from '@reduxjs/toolkit'

import * as consultApiAction from '../features/consultApi'

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
    localStorage.setItem('userEmail', userEmail)
    localStorage.setItem('userPassword', userPassword)
    dispatch(fetchApiToken(userEmail, userPassword))
  }
}

export function validAuthentication(data, rememberUser){
  return async (dispatch) => {
    dispatch(consultApiAction.clear())
    if(data.body.token.length > 10 && data.status === 200){
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
      localStorage.setItem("userFirstName", data.body.firstName)
      localStorage.setItem("userLastName", data.body.lastName)
      localStorage.setItem("userId", data.body.id)
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
      if(sessionStorage.getItem('token')){
        dispatch(actions.loggedin(sessionStorage.getItem('token'), localStorage.getItem('rememberUser')))
      } else if(localStorage.getItem('rememberUser')){
        const login = selectLogin()
        const status = login(getState()).status
        if (status === 'pending') {
          return
        }
        dispatch(actions.fetching(true))
        dispatch(fetchApiToken(localStorage.getItem('userEmail'), localStorage.getItem('userPassword')))
      } else { actions.loggedout() }
      return
    }
}
  
const { actions, reducer } = createSlice({
  name: 'login',
  initialState,
  reducers: {
    fetching: {
      prepare: (rememberUser) => ({
        payload: rememberUser,
      }),
      reducer: (draft, action) =>{
        draft.rememberUser = action.payload
        if (draft.status === 'loggedout') {
          draft.status = 'pending'
          return
        }
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
          sessionStorage.setItem('token', draft.token)
          localStorage.setItem('rememberUser', draft.rememberUser)
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
      localStorage.clear()
      sessionStorage.clear()
      return
    },
    start: (draft) => {
      if(!localStorage.getItem('rememberUser')){ draft.status = 'loggedout' }
      return
    },
  },
})

export const {authentication, loggedin, loggedout} = actions

export default reducer