import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'

import { selectLogin } from '../utils/selectors'
import {MainFlex, backgroundColorDark} from "../utils/style"
import * as storageServiceAction from '../features/storageService'

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

function Profil(){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const login = useSelector(selectLogin())
    const firstName = dispatch(storageServiceAction.getItem('userFirstName'))
    const lastName = dispatch(storageServiceAction.getItem("userLastName"))

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
    
        display : function(e){
            e.preventDefault()
            if(editUserFormService.editUserForm === null){editUserFormService.init()}
            editUserFormService.editUserForm.style.display = "block"
            editUserFormService.firstNameH1.style.display = "none"
        },
    
        submit : function(e, buttonId){
            e.preventDefault()
            if(buttonId === "save-edit"){
                console.log("Save modification to db !")
                editUserFormService.firstNameH1.textContent = editUserFormService.firstNameInput.value
            } else if(buttonId === "cancel-edit"){
                editUserFormService.firstNameInput.value = firstName
                editUserFormService.lastNameInput.value = lastName
            }
            editUserFormService.editUserForm.style.display = "none"
            editUserFormService.firstNameH1.style.display = "block"
        }
        
    }

    const getEditFormButton = (text) => {
        const id = text.toLowerCase() + "-edit"
        return(
            <EditFormButton id={id} onClick={ (e) => { editUserFormService.submit(e, id) } }>{text}</EditFormButton>
        )
    }

    if(login.status !== "loggedin"){ navigate("/login") }

    return(
        <MainFlex $bgColor={backgroundColorDark}>
            <HeaderMain>
                <h1>Welcome back<br /><span id="firstname">{firstName}</span></h1>
                <EditUserNameForm id="edit-username-form" onSubmit={(e) => { e.preventDefault() }}>
                    <EditUserNameInput 
                        type="text"
                        id="firstname-ipt" 
                        defaultValue={firstName}
                    /> 
                    <EditUserNameInput 
                        type="text"
                        id="lastname-ipt" 
                        defaultValue={lastName}
                    />
                    <div>
                        {getEditFormButton("Save")} {getEditFormButton("Cancel")}
                    </div>
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