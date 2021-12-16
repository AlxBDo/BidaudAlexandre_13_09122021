import { selectConsultApi } from "../utils/selectors";
import { createSlice } from '@reduxjs/toolkit'

const axios = require('axios').default;

axios.defaults.baseURL = 'http://localhost:3001/api/v1/'

const getAxiosPostRequest = (route, bodyParams, config = null) => {
    return typeof(config) === "object" 
    ? axios.post(route, bodyParams, config) 
    : axios.post(route, bodyParams)
}

const getAxiosPutRequest = (route, bodyParams, config = null) => {
    return typeof(config) === "object" 
    ? axios.put(route, bodyParams, config) 
    : axios.put(route, bodyParams)
}

const initialState = {
    status: 'void',
    data: null,
    error: null,
  }

export function fetchOrUpdateDataApi(route, method, requestParams, config = null) {
  return async (dispatch, getState) => {
    const consultApi = selectConsultApi()
    const status = consultApi(getState()).status
    if (status === 'pending' || status === 'updating') {
      return
    }
    dispatch(actions.fetching())
    try {
      const apiResponse = method === "POST" 
        ? await getAxiosPostRequest(route, requestParams, config) 
        : await getAxiosPutRequest(route, requestParams, config) 
      dispatch(actions.resolved(apiResponse.data))
    } catch (error) {
      dispatch(actions.rejected(error))
    }
    return
  }
}
  
const { actions, reducer } = createSlice({
  name: 'consultApi',
  initialState,
  reducers: {
    fetching: (draft) => {
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
          return
        }
        return
    },
    resolved: (draft, action) => {
      if (draft.status === 'pending' || draft.status === 'updating') {
        draft.data = action.payload
        draft.status = 'resolved'
        return
      }
      return
    },
    rejected: (draft, action) => {
      if (draft.status === 'pending' || draft.status === 'updating') {
        draft.status = 'rejected'
        draft.error = action.payload
        draft.data = null
        return
      }
      return
    },
    clear: (draft) => {
      if(draft.status !== 'void'){
        draft.status = 'void'
        draft.data = null
        draft.error = null
        return
      }
      return
    }
  },
})

export const {clear} = actions 

export default reducer