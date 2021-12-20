const voidUser = { status : 'void'}

export const selectUser = (userBearerJWT) => (state) => {
    return state.user[userBearerJWT] ?? voidUser
}


const voidLogin = { status : 'loggedout'}

export const selectLogin = () => (state) => {
    return state.login ?? voidLogin
}

export const selectLoginHeaderDisplay = () => (state) => {
    return state.login.status !== "loggedin" 
    ? { loginRoute: "/login", loginClassName: "user-circle", loginText: "In"} 
    : { loginRoute: "/", loginClassName: "sign-out", loginText: "Out"}  
}


const voidConsultApi = { status : 'void'}

export const selectConsultApi = () => (state) => {
    return state.consultApi ?? voidConsultApi
}

const voidStrorageService = { status : 'off' }

export const selectStorageService = () => (state) => {
    return state.storageService ?? voidStrorageService
}