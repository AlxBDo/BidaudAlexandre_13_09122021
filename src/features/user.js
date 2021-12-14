import { selectUser } from "../utils/selectors";

const axios = require('axios').default;

const initialState = {}

export function fetchOrUpdateUser(userBearerJWT) {

    return async (dispatch, getState) => {

      const user = selectUser(userBearerJWT)
      const status = user(getState()).status
      
      if (status === 'pending' || status === 'updating') {
        return
      }
      dispatch(actions.fetching(userBearerJWT))
      try {
        const response = await axios.post('http://localhost:3001/api/v1/user/profil', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userBearerJWT
            }
        })
        console.log("fetchUser = ", response)
        dispatch(actions.resolved(userBearerJWT, data))
      } catch (error) {
        dispatch(actions.rejected(userBearerJWT, error))
      }
    }
  }
  
  function setVoidIfUndefined(draft, userBearerJWT) {
    if (draft[userBearerJWT] === undefined) {
      draft[userBearerJWT] = { status: 'void' }
    }
  }
  
  const { actions, reducer } = createSlice({
    name: 'user',
    initialState,
    reducers: {
      fetching: {
        prepare: (userBearerJWT) => ({
          payload: { userBearerJWT },
        }),
        reducer: (draft, action) => {
          setVoidIfUndefined(draft, action.payload.userBearerJWT)
          if (draft[action.payload.userBearerJWT].status === 'void') {
            draft[action.payload.userBearerJWT].status = 'pending'
            return
          }
          if (draft[action.payload.userBearerJWT].status === 'rejected') {
            draft[action.payload.userBearerJWT].error = null
            draft[action.payload.userBearerJWT].status = 'pending'
            return
          }
          if (draft[action.payload.userBearerJWT].status === 'resolved') {
            draft[action.payload.userBearerJWT].status = 'updating'
            return
          }
        },
      },
      resolved: {
        prepare: (userBearerJWT, data) => ({
          payload: { userBearerJWT, data },
        }),
        reducer: (draft, action) => {
          setVoidIfUndefined(draft, action.payload.userBearerJWT)
          if (
            draft[action.payload.userBearerJWT].status === 'pending' ||
            draft[action.payload.userBearerJWT].status === 'updating'
          ) {
            draft[action.payload.userBearerJWT].data = action.payload.data
            draft[action.payload.userBearerJWT].status = 'resolved'
            return
          }
          return
        },
      },
      rejected: {
        prepare: (userBearerJWT, error) => ({
          payload: { userBearerJWT, error },
        }),
        reducer: (draft, action) => {
          setVoidIfUndefined(draft, action.payload.userBearerJWT)
          if (
            draft[action.payload.userBearerJWT].status === 'pending' ||
            draft[action.payload.userBearerJWT].status === 'updating'
          ) {
            draft[action.payload.userBearerJWT].error = action.payload.error
            draft[action.payload.userBearerJWT].data = null
            draft[action.payload.userBearerJWT].status = 'rejected'
            return
          }
          return
        },
      },
    },
  })
  
  export default reducer