import styled from "styled-components";

export const backgroundColorDark = "#12002b"

export const InputValidationMessageBox = styled.p`
    color: red;
    font-weight: bold
`

export const MainFlex = styled.main`
    flex: 1;
    ${(props) => (
        `background-color: ${props.$bgColor};`
    )}
`