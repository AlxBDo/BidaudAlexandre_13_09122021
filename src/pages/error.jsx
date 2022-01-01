import { Link } from "react-router-dom"
import styled from 'styled-components'


const HomePageReturnLink = styled(Link)`
    color: red;
    @media (max-width: 899px){
        font-size: small;
        font-weight: 500;
    }
`

const StyledDiv = styled.div`
    @media (max-width: 899px){
        margin: 50% auto 40%;
		width: 80%;
    }
    @media (min-width: 900px){ margin: 6% auto 10%; }
`

const StyledFirstP = styled.p`
    margin: 2% auto;
    font-weight: 700;
    @media (max-width: 899px){
        font-size: 5em;
    }
    @media (min-width: 900px){
        font-size: 10em;
        margin: 2% auto;
    }
`

const StyledSecondP = styled.p`
    font-weight: 500;
    @media (max-width: 899px){
        font-size: large;
        line-height: 1.5;
    }
    @media (min-width: 900px){
        font-size: x-large;
    }
`

const StyledMain = styled.main`
    color: var(--first-color);
    text-align: center;
`

/**
 * Component displaying error page if route does not exist
 * @component
 * @returns {object} StyledMain - <main> styled component
 */
function Error() {
    return(
        <StyledMain className="error-msg">
            <StyledDiv>
                <StyledFirstP id="page-not-found">404</StyledFirstP>
                <StyledSecondP>Oups! The page you are looking for does not exist.</StyledSecondP>
            </StyledDiv>
            <StyledDiv>
                <HomePageReturnLink to="/">Return to home page</HomePageReturnLink>
            </StyledDiv>
        </StyledMain>
    )
}

export default Error