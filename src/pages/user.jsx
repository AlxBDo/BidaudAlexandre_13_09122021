import styled from "styled-components";

import {MainFlex, backgroundColorDark} from "../utils/style"

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

function User(){
    return(
        <MainFlex $bgColor={backgroundColorDark}>
            <HeaderMain>
                <h1>Welcome back<br />Tony Jarvis!</h1>
                <EditButton>Edit Name</EditButton>
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

export default User