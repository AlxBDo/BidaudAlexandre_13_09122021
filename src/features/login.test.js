import * as loginAction from './login'
import loginReducer from './login'
 
describe('Login actions and reducer', () => {

    it('should return start status', () => {
        expect(loginReducer(
            undefined, 
            {type: '@INIT'}
        )).toEqual({
            status: 'start', 
            error: null, 
            token: null, 
            rememberUser: false
        })
    })

    it('should return loggedout status', () => {

        expect(loginReducer({
            status: 'start', 
            error: null, 
            token: null, 
            rememberUser: false
            }, loginAction.loggedin(false, false))).toEqual({
                status: 'loggedout', 
                error: "Wrong Token !", 
                token: null, 
                rememberUser: false
        })
        
        expect(loginReducer({
            status: 'loggedin', 
            error: null, 
            token: 'aValidTokenHere', 
            rememberUser: false
            }, loginAction.loggedout)).toEqual({
                status: 'loggedout', 
                error: null, 
                token: null, 
                rememberUser: false
        })
        
        expect(loginReducer({
            status: 'start', 
            error: null, 
            token: null, 
            rememberUser: false
            }, loginAction.start)).toEqual({
                status: 'loggedout', 
                error: null, 
                token: null, 
                rememberUser: false
        })

    })

    it('should return pending status', () => {
        expect(loginReducer({
            status: 'start', 
            error: null, 
            token: null, 
            rememberUser: false
        }, loginAction.fetching
        )).toEqual({
            status: 'pending', 
            error: null, 
            token: null, 
            rememberUser: false
        })
    })

    it('should return loggedin status', () => {
        expect(loginReducer({
            status: 'start', 
            error: null, 
            token: null, 
            rememberUser: false
        }, loginAction.loggedin('hereavalidtokengeneratefromuserapi', false)
        )).toEqual({
            status: 'loggedin', 
            error: null, 
            token: 'hereavalidtokengeneratefromuserapi', 
            rememberUser: false
        })
    })

})