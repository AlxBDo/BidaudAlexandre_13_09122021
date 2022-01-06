import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components' 
import { useSelector, useDispatch } from 'react-redux'
import { selectLogin } from '../utils/selectors'
import { selectUser } from '../utils/selectors'
import {MainFlex, backgroundColorDark, InputValidationMessageBox } from "../utils/style"
import * as userAction from '../features/user'
import { userService } from "../services/userService"
import { FormValidationService } from '../services/formValidationService'

const AccountAmount = styled.p`
    margin: 0;
    font-size: 2.5rem;
    font-weight: bold;
`

const AccountAmountDescription = styled.p`
    margin: 0;
`

const AccountContentWrapper = styled.div`
    width: 100%;
    flex: 1;
`

const AccountsSection = styled.section`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid black;
    background-color: #fff;
    width: 80%;
    margin: 0 auto;
    flex-direction: column;
    padding: 1.5rem;
    box-sizing: border-box;
    text-align: left;
    margin-bottom: 2rem;
    @media (min-width: 720px){
        flex-direction: row;
    }
`

const AccountTitle = styled.h3`
    margin: 0;
    padding: 0;
    font-size: 1rem;
    font-weight: normal;
`

const EditButton = styled.button`
    border-color: #00bc77;
    background-color: #00bc77;
    color: #fff;
    font-weight: bold;
    padding: 10px;
`

const EditFormButton = styled.button`
    border-color: #00bc77;
    background-color: #fff;
    color: #00bc77;
    font-weight: bold;
    padding: 10px;
`

const HeaderMain = styled.div`
    color: #fff;
    margin-bottom: 2rem;
`

const TransactionButton = styled.button`
    display: block;
    width: 100%;
    padding: 8px;
    font-size: 1.1rem;
    font-weight: bold;
    margin-top: 1rem;
    border-color: #00bc77;
    background-color: #00bc77;
    color: #fff;
    @media (min-width: 720px){
        width: 200px;
    }
`

const EditUserNameForm = styled.form`
    display: none;
    margin: 10px auto
`

const EditUserNameInput = styled.input`
    border: none;
    padding: 10px;
    margin: 10px
`

/**
 * Display profile page
 * @component
 * @returns {object} MainFlex - <main> styled component
 */
function Profil(){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const login = useSelector(selectLogin())
    const user = useSelector(selectUser())
 
    /**
     * Controls the inputs of profil form and display their format errors
    */
    const editUserFormService = {
    
        editUserForm: null,
        firstNameH1: null,
        firstNameInput: null,
        lastNameInput: null,
    
        init: function(){
            editUserFormService.editUserForm = document.getElementById("edit-username-form")
            editUserFormService.firstNameH1 = document.getElementById("firstname")
            editUserFormService.firstNameInput = document.getElementById("firstname-ipt")
            editUserFormService.lastNameInput = document.getElementById("lastname-ipt")
        },
    
        display: function(e){
            e.preventDefault()
            if(editUserFormService.editUserForm === null){ editUserFormService.init() }
            editUserFormService.displayForm()
        },

        displayForm: function(display = true){
            let displayItem = display ? { form: 'block', h1 : 'none'} : { form: 'none', h1 : 'block'} 
            editUserFormService.editUserForm.style.display = displayItem.form
            editUserFormService.firstNameH1.style.display = displayItem.h1
        },

        onChange: (e) => editUserFormService.checkInput(
            e.target.getAttribute('id') === 'firstname-ipt' ? 'first name' : 'last name', e.target
        ),
    
        submit: function(e, buttonId){
            e.preventDefault()
            let validForm = false
            if(buttonId === "save-edit"){
                if( editUserFormService.checkInput('first name', editUserFormService.firstNameInput) 
                || editUserFormService.checkInput('last name', editUserFormService.firstNameInput) ) {
                    const newFirstName = editUserFormService.firstNameInput.value
                    dispatch(userAction.updateUserInformation(
                        newFirstName, 
                        editUserFormService.lastNameInput.value,
                        login.token
                    ))
                    editUserFormService.firstNameH1.textContent = newFirstName
                    validForm = true
                }
            } else if(buttonId === "cancel-edit"){
                editUserFormService.firstNameInput.value = user.firstname
                editUserFormService.lastNameInput.value = user.lastname
                validForm = true
            }
            editUserFormService.displayForm(!validForm)
        },

        checkInput: function(inputName, input){
            if( input.value === (inputName === 'first name' ? user.firstname : user.lastname) ){ return false }
            return FormValidationService.checkInput(input, 'name', inputName)
        }
        
    }

    /**
     * Provides the cancel and save buttons
     * @param {string} text : "cancel" or "save" 
     * @returns {object} EditFormButton
     */
    const getEditFormButton = (text) => {
        const id = text.toLowerCase() + "-edit"
        return(
            <EditFormButton 
                id={id} 
                onClick={ (e) => { editUserFormService.submit(e, id) } }
            >{text}</EditFormButton>
        )
    }

    useEffect(() => {
        if(login.status !== "loggedin"){ navigate(userService.routes.loginPage) }
    }, [login.status, navigate])

    return(
        <MainFlex $bgColor={backgroundColorDark}>
            <HeaderMain>
                <h1>Welcome back<br /><span id="firstname">{user.firstname}</span></h1>
                <EditUserNameForm id="edit-username-form" onSubmit={(e) => { e.preventDefault() }}>
                    <EditUserNameInput 
                        type="text"
                        id="firstname-ipt" 
                        defaultValue={user.firstname} 
                        onChange={ editUserFormService.onChange }
                    /> 
                    <EditUserNameInput 
                        type="text"
                        id="lastname-ipt" 
                        defaultValue={user.lastname}
                        onChange={ editUserFormService.onChange }
                    />
                    <div>
                        {getEditFormButton("Save")} {getEditFormButton("Cancel")}
                    </div>
                    <InputValidationMessageBox id="firstname-ipt-validation"></InputValidationMessageBox>
                    <InputValidationMessageBox id="lastname-ipt-validation"></InputValidationMessageBox>
                </EditUserNameForm>
                <EditButton onClick={editUserFormService.display}>Edit Name</EditButton>
            </HeaderMain>
            <h2 className="sr-only">Accounts</h2>
            <AccountsSection>
                <AccountContentWrapper>
                    <AccountTitle>Argent Bank Checking (x8349)</AccountTitle>
                    <AccountAmount>$2,082.79</AccountAmount>
                    <AccountAmountDescription>Available Balance</AccountAmountDescription>
                </AccountContentWrapper>
                <AccountContentWrapper className="cta">
                    <TransactionButton>View transactions</TransactionButton>
                </AccountContentWrapper>
            </AccountsSection>
            <AccountsSection>
                <AccountContentWrapper>
                    <AccountTitle>Argent Bank Savings (x6712)</AccountTitle>
                    <AccountAmount>$10,928.42</AccountAmount>
                    <AccountAmountDescription>Available Balance</AccountAmountDescription>
                </AccountContentWrapper>
                <AccountContentWrapper className="cta">
                    <TransactionButton>View transactions</TransactionButton>
                </AccountContentWrapper>
            </AccountsSection>
            <AccountsSection>
                <AccountContentWrapper>
                    <AccountTitle>Argent Bank Credit Card (x8349)</AccountTitle>
                    <AccountAmount>$184.30</AccountAmount>
                    <AccountAmountDescription>Current Balance</AccountAmountDescription>
                </AccountContentWrapper>
                    <AccountContentWrapper className="cta">
                    <TransactionButton>View transactions</TransactionButton>
                </AccountContentWrapper>
            </AccountsSection>
        </MainFlex>
    )
}

export default Profil