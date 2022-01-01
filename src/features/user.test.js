import userReducer from './user'
import * as userAction from './user' 

describe('User reducer and actions', () => {

    it("should return void status", () => {

        expect(userReducer(
            undefined, 
            {type: '@INIT'}
        )).toEqual({
            status: 'void',
            email: null,
            error: false,
            firstname: null,
            id: null,
            lastname: null,
            password: null
        })

        expect(userReducer({
            status: 'identify',
            email: "email@email.com",
            error: false,
            firstname: "firstname",
            id: 'userid',
            lastname: 'lastname',
            password: 'password'
            }, userAction.clear
        )).toEqual({
            status: 'void',
            email: null,
            error: false,
            firstname: null,
            id: null,
            lastname: null,
            password: null
        })

    })

    it("should return error status", () => {

        expect(userReducer({
            status: 'void',
            email: null,
            error: false,
            firstname: null,
            id: null,
            lastname: null,
            password: null
            }, userAction.error('An error message !')
        )).toEqual({
            status: 'error',
            email: null,
            error: 'An error message !',
            firstname: null,
            id: null,
            lastname: null,
            password: null
        })

    })

    it('should return identified status', () => {

        expect(userReducer({
            status: 'void',
            email: null,
            error: false,
            firstname: null,
            id: null,
            lastname: null,
            password: null
        }, userAction.identify(
            'useremail@email.com', 
            'userfirstname', 
            'userid', 
            'userlastname', 
            'userpassword'
        )
        )).toEqual({
            status: 'identified',
            email: 'useremail@email.com',
            error: false,
            firstname: 'userfirstname',
            id: 'userid',
            lastname: 'userlastname',
            password: 'userpassword'
        })

    })

}) 

describe('User actions', () => {

    it("should return updated firstname", () => {

        expect(userReducer({
            status: 'identify',
            email: "email@email.com",
            error: false,
            firstname: "firstname",
            id: 'userid',
            lastname: 'lastname',
            password: 'password'
            }, userAction.update('firstname', 'newfirstname')
        )).toEqual({
            status: 'identify',
            email: "email@email.com",
            error: false,
            firstname: "newfirstname",
            id: 'userid',
            lastname: 'lastname',
            password: 'password'
        })

    })

})