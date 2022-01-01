import storageServiceReducer from './storageService' 
import * as storageServiceAction from './storageService'
 
describe('StorageService reducer and actions', () => {

    it('Should return off status', () => {

        expect(storageServiceReducer(
            undefined, 
            { type: '@INIT'}
        )).toEqual({
            status: 'off',
            error: false
        })

        expect(storageServiceReducer({
            status: 'on', 
            error: false
        }, storageServiceAction.close())
        ).toEqual({
            status: 'off', 
            error: false
        })

    })

    it('Should return on status', () => {

        expect(storageServiceReducer({ status: 'off', error: false }, storageServiceAction.start))
        .toEqual({ status: 'on', error: false })

    })

})