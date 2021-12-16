import { useEffect } from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom"
import styled from "styled-components"
import { useDispatch, useSelector } from 'react-redux'

import { selectLogin, selectLoginHeaderDisplay, selectConsultApi } from '../utils/selectors'
import * as loginAction from '../features/login'

import logoImg from "../assets/argentBankLogo.png"


const HeaderNav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 20px;
`

const LogoImg = styled.img`
    max-width: 100%;
    width: 200px;
`

const LogoLink = styled(Link)`
    display: flex;
    align-items: center;
`
const SignBtn = styled.a`
    text-decoration: none;
    margin-right: 0.5rem;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`


function Header(){
    const dispatch = useDispatch()
    const login = useSelector(selectLogin())
    const consultApi = useSelector(selectConsultApi())
    const location = useLocation()
    const navigate = useNavigate()
    const { loginRoute, loginClassName, loginText } = useSelector(selectLoginHeaderDisplay())
    const userName = login.status === "loggedin" ? localStorage.getItem("userFirstName") : null
    const loginOnclick =  (e)=>{ 
        e.preventDefault()
        if(login.status !== "loggedout"){ dispatch(loginAction.loggedout()) }
        if(location.pathname !== loginRoute){ navigate(loginRoute)}
    }

    useEffect(()=>{
        if(login.status === "start" ){ dispatch(loginAction.startLogin()) }
        if(consultApi.status === 'resolved'){
            if(consultApi.data.body.token){
                dispatch(
                    loginAction.validAuthentication(
                        consultApi.data, 
                        login.rememberUser
                    )
                )
            } else { dispatch(loginAction.validUser(consultApi.data)) }
        }
    }, [login, dispatch, consultApi])

    return (
        <header>
            <HeaderNav className="main-nav">
                <LogoLink to="/">
                    <LogoImg src={logoImg} alt="Argent Bank Logo" />
                    <h1 className="sr-only">Argent Bank</h1>
                </LogoLink>
                <div>
                    {login.status === "loggedin" && (
                        <Link to="/profil">
                            <i className="fa fa-user-circle"></i>
                            {userName}
                        </Link>
                    )}
                    <SignBtn onClick={loginOnclick}>
                        <i className={`fa fa-${loginClassName}`}></i>
                        {`Sign ${loginText}`}
                    </SignBtn>
                </div>
            </HeaderNav>
        </header>
    )

}

export default Header