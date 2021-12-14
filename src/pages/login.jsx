import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

import { selectLogin } from '../utils/selectors'
import * as loginAction from '../features/login'
import {MainFlex, backgroundColorDark} from "../utils/style"

const InputRemember = styled.div`
    display: flex;
`

const InputRememberLabel = styled.label`
    margin-left: 0.25rem;
`

const InputValidationMessageBox = styled.p`
    color: red;
    font-weight: bold
`

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-bottom: 1rem;
`

const InputWrapperInput = styled.input`
    padding: 5px;
    font-size: 1.2rem;
`

const InputWrapperLabel = styled.label`
    font-weight: bold;
`

const SignInButton = styled.button`
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

const SignInContent = styled.section`
    box-sizing: border-box;
    background-color: white;
    width: 300px;
    margin: 0 auto;
    margin-top: 3rem;
    padding: 2rem;
`

function Login(){

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const login = useSelector(selectLogin())
    
    useEffect(() =>{
        if(login.status === "resolved"){
            console.log(login)
            window.setTimeout(() => {
                navigate('/profil')
            }, 2000)
        }
    }, [login, navigate])

    function submitLoginForm(e){
        e.preventDefault()
        const username = document.getElementById("username")
        if(!username.value){
            username.focus()
            document.getElementById('validation-username').innerHTML = "USERNAME IS REQUIRIED !"
            return false
        }
        const password = document.getElementById("password")
        if(!password.value){
            password.focus()
            document.getElementById('validation-password').innerHTML = "PASSWORD IS REQUIRIED !"
            return false
        }
        dispatch(loginAction.fetchOrUpdateLogin(document.getElementById("username").value, document.getElementById("password").value))
        return true
    }

    return(
        <MainFlex className="main bg-dark" $bgColor={backgroundColorDark}>
            <SignInContent>
                <i className="fa fa-user-circle sign-in-icon"></i>
                <h1>Sign In</h1>
                {login.status !== "resolved" ? (
                    <form onSubmit={submitLoginForm}>
                        <InputWrapper>
                            <InputWrapperLabel htmlFor="username">Username</InputWrapperLabel>
                            <InputWrapperInput type="text" id="username" />
                            <InputValidationMessageBox id="validation-username"></InputValidationMessageBox>
                        </InputWrapper>
                        <InputWrapper>
                            <InputWrapperLabel htmlFor="password">Password</InputWrapperLabel>
                            <InputWrapperInput type="password" id="password" />
                            <InputValidationMessageBox id="validation-password"></InputValidationMessageBox>
                        </InputWrapper>
                        <InputRemember>
                            <input type="checkbox" id="remember-me" />
                            <InputRememberLabel htmlFor="remember-me">Remember me</InputRememberLabel>
                        </InputRemember>
                        <SignInButton>Sign In</SignInButton>
                    </form>
                ) : (
                    <div>
                        Connexion réussie ! 
                        <p>Vous allez être redirigé vers la page profil dans 2 minutes.</p>
                    </div>
                )}
            </SignInContent>
        </MainFlex>
    )
}

export default Login