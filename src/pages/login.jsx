import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { selectLogin } from '../utils/selectors'
import * as loginAction from '../features/login'
import {MainFlex, backgroundColorDark} from "../utils/style"
import { userService } from '../services/userService'
import { FormValidationService } from '../services/formValidationService'
import { InputValidationMessageBox } from '../utils/style'

const ErrorMessageContainer = styled.div`
    color: white;
    background-color: red;
    margin: 20px auto 0;
    padding: 5px 10px 10px
`

const InputRemember = styled.div`
    display: flex;
`

const InputRememberLabel = styled.label`
    margin-left: 0.25rem;
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

const LoadingMessage = styled.div`
    color: #00bc77;
    font-size: x-large;
    font-weight: 500;
    text-align: center;
    margin: 20% auto 12%;
`

const LoadingIcon = styled.p`
    border: 10px solid #00bc77;
	height: 50px;
	width: 50px;
	border-radius: 100px;
	border-bottom-color: transparent;
	animation: loading 700ms linear infinite;
    margin: 15% auto;
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

    /**
     * Controls the inputs of login form and display their format errors
    */
    const loginFormValidation = {
    
        username: null, 
    
        password: null, 
    
        rememberMe: false,
    
        checkUserName: () => FormValidationService.checkInput(loginFormValidation.username, 'email', 'Your username'),
    
        checkUserPassword: () => FormValidationService.checkInput(loginFormValidation.password, 'password', 'Your password'),
    
        init: () => {
            loginFormValidation.username = document.getElementById("username")
            loginFormValidation.password = document.getElementById("password")
            loginFormValidation.rememberMe = document.getElementById("remember-me")
        },
    
        onChange: (e) => e.target.getAttribute('id') === 'username' 
        ? loginFormValidation.checkUserName() : loginFormValidation.checkUserPassword() ,
    
        submit: (e) => {
            e.preventDefault()
            if(!loginFormValidation.checkUserName() || !loginFormValidation.checkUserPassword()
            ){ return false }
            dispatch(
                loginAction.authenticate(
                    document.getElementById("username").value, 
                    document.getElementById("password").value,
                    document.getElementById("remember-me").checked
                )
            )
            return true
        }
    }
 
    useEffect(() =>{
        if(login.status === "loggedin"){ navigate(userService.routes.profilPage) }
        loginFormValidation.init() 
    })

    return(
        <MainFlex className="main bg-dark" $bgColor={backgroundColorDark}>
            <SignInContent>
                <i className="fa fa-user-circle sign-in-icon"></i>
                <h1>Sign In</h1>
                {login.status === "pending" ? (
                <LoadingMessage className="loading-data">
                    Loading your profile...
                    <LoadingIcon> </LoadingIcon>
                </LoadingMessage>
                ) : login.status === "loggedin" ? (
                    <div>
                        Connexion réussie ! 
                        <p>Vous allez être redirigé vers la page profil dans quelques instants.</p>
                    </div>
                ) : (
                    <form onSubmit={loginFormValidation.submit}>
                        <InputWrapper>
                            <InputWrapperLabel htmlFor="username">Username</InputWrapperLabel>
                            <InputWrapperInput 
                                type="text" 
                                id="username" 
                                onChange={loginFormValidation.onChange} 
                                required
                            />
                            <InputValidationMessageBox id="username-validation"></InputValidationMessageBox>
                        </InputWrapper>
                        <InputWrapper>
                            <InputWrapperLabel htmlFor="password">Password</InputWrapperLabel>
                            <InputWrapperInput 
                                type="password" 
                                id="password" 
                                onChange={loginFormValidation.onChange} 
                                required 
                            />
                            <InputValidationMessageBox id="password-validation"></InputValidationMessageBox>
                        </InputWrapper>
                        <InputRemember>
                            <input type="checkbox" id="remember-me" />
                            <InputRememberLabel htmlFor="remember-me">Remember me</InputRememberLabel>
                        </InputRemember>
                        <SignInButton>Sign In</SignInButton>
                        {login.error !== null && (
                            <ErrorMessageContainer>
                                <p>Login Failled !</p>
                                Error message : {login.error}
                            </ErrorMessageContainer>
                        )}
                    </form>
                )}
            </SignInContent>
        </MainFlex>
    )
}

export default Login