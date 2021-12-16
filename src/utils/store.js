import { configureStore } from '@reduxjs/toolkit'

import consultApiReducer from '../features/consultApi'
import loginReducer from '../features/login'

export default configureStore({
    reducer: {
        consultApi: consultApiReducer,
        login: loginReducer
    }
})