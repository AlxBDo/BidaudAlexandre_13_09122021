import { configureStore } from '@reduxjs/toolkit'

import consultApiReducer from '../features/consultApi'
import loginReducer from '../features/login'
import storageServiceReducer from '../features/storageService'

export default configureStore({
    reducer: {
        consultApi: consultApiReducer,
        login: loginReducer, 
        storageService: storageServiceReducer
    }
})