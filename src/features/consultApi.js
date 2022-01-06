import { selectConsultApi } from "../utils/selectors";
import { createSlice } from '@reduxjs/toolkit'
 
const axios = require('axios').default;
axios.defaults.baseURL = 'http://localhost:3001/api/v1/'

/**
 * Provides Axios Post request params 
 * @param {string} route 
 * @param {object} bodyParams : { firstname = "Peter" } 
 * @param {object} config : header params
 * @returns {object} axios.post()
 */
const getAxiosPostRequest = (route, bodyParams, config = null) => {
    return typeof(config) === "object" 
    ? axios.post(route, bodyParams, config) 
    : axios.post(route, bodyParams)
}

/**
 * Provides Axios Put request params 
 * @param {string} route 
 * @param {object} bodyParams : { firstname = "Peter" } 
 * @param {object} config : header params
 * @returns {object} axios.put()
 */
const getAxiosPutRequest = (route, bodyParams, config = null) => {
    return typeof(config) === "object" 
    ? axios.put(route, bodyParams, config) 
    : axios.put(route, bodyParams)
}

/**
 * Fetch API data
 * @param {string} route 
 * @param {string} method : POST or PUT or GET 
 * @param {object} requestParams : { lastname : Paul }
 * @param {object} config : header params 
 * @returns {object} API response
 */
export function fetchOrUpdateDataApi(route, method, requestParams, config = null) {
  return async (dispatch, getState) => {
    const consultApi = selectConsultApi()
    const status = consultApi(getState()).status
    if (status === 'pending') {
      return
    }
    dispatch(actions.fetching())
    try {
      const apiResponse = method === "POST" 
        ? await getAxiosPostRequest(route, requestParams, config) 
        : await getAxiosPutRequest(route, requestParams, config) 
      dispatch(actions.resolved(apiResponse.data))
      return Promise.resolve(apiResponse.data)
    } catch (error) {
      dispatch(actions.rejected(error.message))
      return Promise.resolve(error)
    }
  }
}

const initialState = {
  status: 'void',
  data: null,
  error: null,
}

/**
 * Component making API requests
 * @component
 */
const { actions, reducer } = createSlice({
  name: 'consultApi',
  initialState,
  reducers: {
    fetching: (draft) => {
        if (draft.status === 'rejected') {
          draft.error = null
        }
        draft.status = 'pending'
        return
    },
    resolved: {
      prepare: (data) => ({
        payload: data
      }), 
      reducer: (draft, action) => {
        if (draft.status === 'pending') {
          draft.data = action.payload
          draft.status = 'resolved'
        }
        return
      }
    },
    rejected: {
      prepare: (errorMessage) => ({
        payload: errorMessage
      }),
      reducer: (draft, action) => {
        if (draft.status === 'pending') {
          draft.status = 'rejected'
          draft.error = action.payload
          draft.data = null
          console.error("consultApi - Request is rejected : ", action.payload)
          return
        }
        return
      }
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

export const { clear, fetching, rejected, resolved } = actions 

export default reducer