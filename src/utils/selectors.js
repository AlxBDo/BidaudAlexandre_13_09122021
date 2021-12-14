const voidUser = { status : 'void'}

export const selectUser = (userBearerJWT) => (state) => {
    return state.user[userBearerJWT] ?? voidUser
}

const voidLogin = { status : 'void'}

export const selectLogin = () => (state) => {
    return state.login ?? voidLogin
}