import { createSlice } from '@reduxjs/toolkit'
 
const crypto = require('crypto-js');

/**
 * Provides key or iv for encrypt and decrypt functions
 * @param {string} keyOrIv : "key" or "iv" 
 * @returns {string} key or iv
 */
function getKeyOrIv(keyOrIv){
    let key = localStorage.getItem(keyOrIv)
    if(!key){
        key = generateKeyOrIv(keyOrIv)
        localStorage.setItem(keyOrIv, key)
    }
    return crypto.enc.Utf8.parse(key)
}

/**
 * Create key or iv for encrypt and decrypt functions
 * @param {string} keyOrIv : "key" or "iv" 
 * @returns {string} key or iv
 */
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

/**
 * Clear local and session storage
 * @param {boolean} clearLocalStrorage  : true = clear localStorage
 */
function clearStorage(clearLocalStrorage){
    sessionStorage.clear()
    if(clearLocalStrorage){ localStorage.clear() }
}

/**
 * Decrypt string passed in parameter
 * @param {string} item - encrypted string
 * @returns {string} decrypted item
 */
function decryptItem(item){ 
    let cipherParams = crypto.lib.CipherParams.create({ ciphertext: crypto.enc.Base64.parse(item) });
    let decryptedFromText = crypto.AES.decrypt(cipherParams, getKeyOrIv('key'), { iv: getKeyOrIv('iv')});
    return decryptedFromText.toString(crypto.enc.Utf8)
}

/**
 * Encrypt string passed in parameter
 * @param {string} item
 * @returns {string} encrypted item
 */
function encryptItem(item){ 
    let encryptedCP = crypto.AES.encrypt(item, getKeyOrIv('key'), { iv: getKeyOrIv('iv') });
    let cryptText = encryptedCP.toString();
    return cryptText
}

/**
 * Provides the stored item corresponding to the name passed in parameter
 * @param {string} itemName 
 * @param {boolean} fromSessionStorage 
 * @param {boolean} decrypt 
 * @returns {string || boolean} false if no stored items match the name passed in parameter
 */
export function getItem(itemName, fromSessionStorage = false, decrypt = true){
    const item = fromSessionStorage ? sessionStorage.getItem(itemName) : localStorage.getItem(itemName)
    if(item){ return decrypt ? decryptItem(item) : item }
    return false
}

/**
 * Save to localStorage or SessionStorage (call saveToStorage function)
 * @param  {...any object} objectToSave 
 * the object must have attributes: "name" and "item". The attributes "crypt" and "saveToSession" can be added
 * @example {name: string, item: string, saveToSession: boolean, crypt: boolean}
 * @see saveToStorage()
 */
export function save(...objectToSave){
    return async (dispatch) => { 
        objectToSave.forEach(
            ots => dispatch(saveToStorage(ots.name, ots.crypt ? encryptItem(ots.value) : ots.value, !ots.intoSession ? false : true))
        )
    }
}

/**
 * Save to localStorage or SessionStorage
 * @param {string} name 
 * @param {string} item 
 * @param {boolean} saveToSession : false save to localStorage
 * @returns {boolean}
 */
function saveToStorage(name, item, saveToSession){
    return (dispatch) => {
        if(['number', 'string', 'boolean', 'bigint', 'symbol'].includes(typeof item)){
            saveToSession ? sessionStorage.setItem(name, item) : localStorage.setItem(name, item)
            return true
        }  
        dispatch(
            actions.error('the element could not be saved because its type is not accepted : '+ typeof item)
         )
        return false
    }
}

const initialState = {
    status: 'off',
    error: false
}

/**
 * @name: storageService
 * @description: store and retrieve items in localStorage and sessionStorage 
 * react-redux component 
 */
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

export const { close, start } = actions

export default reducer