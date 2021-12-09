import { Link } from "react-router-dom"
import styled from "styled-components"

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
const SignInLink = styled(Link)`
    text-decoration: none;
    margin-right: 0.5rem;
    &:hover {
        text-decoration: underline;
    }
`

function Header(){

    return (
        <header>
            <HeaderNav className="main-nav">
                <LogoLink to="/">
                    <LogoImg src={logoImg} alt="Argent Bank Logo" />
                    <h1 className="sr-only">Argent Bank</h1>
                </LogoLink>
                <div>
                    <SignInLink to="/sign-in">
                        <i className="fa fa-user-circle"></i>
                        Sign In
                    </SignInLink>
                </div>
            </HeaderNav>
        </header>
    )

}

export default Header