import styled from "styled-components";

import {MainFlex, backgroundColorDark} from "../utils/style"

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

function SignIn(){
    return(
        <MainFlex className="main bg-dark" $bgColor={backgroundColorDark}>
            <SignInContent>
                <i className="fa fa-user-circle sign-in-icon"></i>
                <h1>Sign In</h1>
                <form>
                    <InputWrapper>
                        <InputWrapperLabel htmlFor="username">Username</InputWrapperLabel>
                        <InputWrapperInput type="text" id="username" />
                    </InputWrapper>
                    <InputWrapper>
                        <InputWrapperLabel htmlFor="password">Password</InputWrapperLabel>
                        <InputWrapperInput type="password" id="password" />
                    </InputWrapper>
                    <InputRemember>
                        <input type="checkbox" id="remember-me" />
                        <InputRememberLabel htmlFor="remember-me">Remember me</InputRememberLabel>
                    </InputRemember>
                    <SignInButton>Sign In</SignInButton>
                </form>
            </SignInContent>
        </MainFlex>
    )
}

export default SignIn