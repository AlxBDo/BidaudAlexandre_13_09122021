import consultApiReducer from './consultApi' 
import * as consultApiAction from './consultApi' 

describe('ConsultApi reducer and actions', () => {

    it('Should return void status', () => {

        expect(consultApiReducer(
            undefined, 
            { type: '@INIT' }
        )).toEqual({
            status: 'void',
            data: null,
            error: null
          })

          expect(consultApiReducer({
            status: 'resolved',
            data: null,
            error: null,
          }, consultApiAction.clear)).toEqual({
            status: 'void',
            data: null,
            error: null,
          })

    })

    it('Should return pending status', () => {

        expect(consultApiReducer({
            status: 'void',
            data: null,
            error: null
          }, consultApiAction.fetching)).toEqual({
            status: 'pending',
            data: null,
            error: null
          })

    })

    it('Should return rejected status', () => {

        expect(consultApiReducer({
            status: 'pending',
            data: null,
            error: null,
          }, consultApiAction.rejected('Error message !'))).toEqual({
            status: 'rejected',
            data: null,
            error: 'Error message !',
          })

    })

    it('Should return resolved status', () => {

        expect(consultApiReducer({
            status: 'pending',
            data: null,
            error: null,
          }, consultApiAction.resolved({}))).toEqual({
            status: 'resolved',
            data: {},
            error: null,
          })

    })

})