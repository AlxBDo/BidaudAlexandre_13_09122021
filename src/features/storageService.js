import { createSlice } from '@reduxjs/toolkit'


const crypto = require('crypto-js');

const initialState = {
    status: 'off',
    error: false
}

function getKeyOrIv(keyOrIv){
    let key = localStorage.getItem(keyOrIv)
    if(!key){
        key = generateKeyOrIv(keyOrIv)
        localStorage.setItem(keyOrIv, key)
    }
    return crypto.enc.Utf8.parse(key)
}

function generateKeyOrIv(keyOrIv){
    let keyLength = keyOrIv === 'key' ? 32 : 16 
    let key = ""
    const letters = ["a", "b", "c", "d", "e", "f", "i", "j", "k", "l", "m", "n"]
    for(let i = 1; i <= keyLength; i++){
        if(Math.floor(Math.random() * 2) === 1){
            let letterNumber = Math.floor(Math.random() * letters.length)
            if(letterNumber > 0) { letterNumber-- }
            key += letters[letterNumber]
        } else { key += Math.floor(Math.random() * 9) }
    }
    return key
}

function clearStorage(clearLocalStrorage){
    sessionStorage.clear()
    if(clearLocalStrorage){ localStorage.clear() }
}

function decryptItem(item){ 
    let cipherParams = crypto.lib.CipherParams.create({ ciphertext: crypto.enc.Base64.parse(item) });
    let decryptedFromText = crypto.AES.decrypt(cipherParams, getKeyOrIv('key'), { iv: getKeyOrIv('iv')});
    return decryptedFromText.toString(crypto.enc.Utf8)
}

function encryptItem(item){ 
    let encryptedCP = crypto.AES.encrypt(item, getKeyOrIv('key'), { iv: getKeyOrIv('iv') });
    let cryptText = encryptedCP.toString();
    return cryptText
}


export function getItem(itemName, fromSessionStorage = false, decrypt = true){
    const item = fromSessionStorage ? sessionStorage.getItem(itemName) : localStorage.getItem(itemName)
    if(item){
        return (dispatch) => {
            dispatch(actions.start())
            return decrypt ? decryptItem(item) : item
        }
    }
    return false
}

export function saveItem(name, item, saveToSession = false, crypt = true){
    return async (dispatch) => {
        if(['number', 'string', 'boolean', 'bigint', 'symbol'].includes(typeof item)){
            saveToStorage(
                name, 
                crypt ? encryptItem(item) : item, 
                saveToSession
            )
            dispatch(actions.start())
            return true
        } else { 
            dispatch(
                actions.error('the element could not be saved because its type is not accepted : '+ typeof item)
             )
        }
        return false
    }
}

function saveToStorage(name, item, saveToSession){
    saveToSession ? sessionStorage.setItem(name, item) : localStorage.setItem(name, item)
}

const { actions, reducer } = createSlice({
    name: 'storageService',
    initialState,
    reducers: {
        close: {
            prepare: (clearLocalStrorage = true) => ({
                payload: clearLocalStrorage,
            }),
            reducer: (draft, action) => {
                clearStorage(action.payload)
                draft.status = 'off'
                return
            }
        },
        error: {
            prepare: (errorMessage) => ({
                payload: errorMessage
            }),
            reducer: (draft, action) => { 
                draft.error = action.payload 
                return
            }
        },
        start: (draft) => {
            draft.status = "on" 
            return
        },
    }
})

export const { close } = actions
export default reducer