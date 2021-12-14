import { selectLogin } from "../utils/selectors";
import { createSlice } from '@reduxjs/toolkit'

const axios = require('axios').default;

const initialState = {
    status: 'void',
    token: null,
    error: null,
  }

export function fetchOrUpdateLogin(userEmail, userPassword) {
    return async (dispatch, getState) => {
      const login = selectLogin(userEmail, userPassword)
      const status = login(getState()).status
      if (status === 'pending' || status === 'updating') {
        return
      }
      dispatch(actions.fetching(userEmail, userPassword))
      try {
        axios.defaults.baseURL = 'http://localhost:3001/api/v1/'
        const token = await axios.post('user/login/', {
            'email': userEmail,
            'password': userPassword 
        })
        dispatch(actions.resolved(token.data.body.token))
      } catch (error) {
        dispatch(actions.rejected(error))
      }
    }
  }
  
  const { actions, reducer } = createSlice({
    name: 'login',
    initialState,
    reducers: {
      fetching: {
        prepare: (userEmail, userPassword) => ({
          payload: { userEmail, userPassword },
        }),
        reducer: (draft, action) => {
          if (draft.status === 'void') {
            draft.status = 'pending'
            return
          }
          if (draft.status === 'rejected') {
            draft.error = null
            draft.status = 'pending'
            return
          }
          if (draft.status === 'resolved') {
            draft.status = 'updating'
            draft.token = action.payload
            return
          }
          return
        },
      },
      resolved: {
        prepare: (data) => ({
          payload: data,
        }),
        reducer: (draft, action) => {
          if (draft.status === 'pending' || draft.status === 'updating') {
            draft.token = action.payload
            draft.status = 'resolved'
            return
          }
          return
        },
      },
      rejected: {
        prepare: (draft, error) => ({
          payload: error,
        }),
        reducer: (draft, action) => {
          if (draft.status === 'pending' || draft.status === 'updating') {
            draft.status = 'rejected'
            draft.error = action.payload
            draft.data = null
            return
          }
          return
        },
      },
    },
  })

  export const {fetching, resolved, rejected } = actions
  
  export default reducer