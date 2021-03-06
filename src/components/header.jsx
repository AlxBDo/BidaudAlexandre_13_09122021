import { useEffect } from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom"
import styled from "styled-components"
import { useDispatch, useSelector } from 'react-redux'
import { selectLogin, selectLoginHeaderDisplay, selectUser } from '../utils/selectors'
import * as loginAction from '../features/login'
import logoImg from "../assets/argentBankLogo.png"

const HeaderNav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 20px;
`

const LoginDiv = styled.div`
    display: flex; 
    flex-wrap: wrap; 
    justify-content: end;
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

/**
 * Display html header
 * @component
 */
function Header(){
    const dispatch = useDispatch()
    const login = useSelector(selectLogin())
    const user = useSelector(selectUser())
    const location = useLocation()
    const navigate = useNavigate()
    const { loginRoute, loginClassName, loginText } = useSelector(selectLoginHeaderDisplay())
    const userName = login.status === "loggedin" ? user.firstname : null
    const loginOnclick =  (e) => { 
        e.preventDefault()
        if(login.status !== "loggedout"){ dispatch(loginAction.endLogin()) }
        if(location.pathname !== loginRoute){ navigate(loginRoute)}
    }

    useEffect(()=>{
        if(login.status === "start" ){ dispatch(loginAction.startLogin()) } 
    }, [login, dispatch])

    return (
        <header>
            <HeaderNav className="main-nav">
                <LogoLink to="/">
                    <LogoImg src={logoImg} alt="Argent Bank Logo" />
                    <h1 className="sr-only">Argent Bank</h1>
                </LogoLink>
                <LoginDiv>
                    {login.status === "loggedin" && (
                        <Link to="/profil">
                            <i className="fa fa-user-circle"></i>
                            {userName} 
                        </Link> 
                    )}
                    <SignBtn onClick={loginOnclick}>
                        <i className={`fa fa-${loginClassName}`}> </i> 
                        {`Sign ${loginText}`}
                    </SignBtn>
                </LoginDiv>
            </HeaderNav>
        </header>
    )

}

export default Header