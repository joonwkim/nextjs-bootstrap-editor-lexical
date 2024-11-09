import React from 'react'
import styled from 'styled-components';



const StyleComponent = () => {
    const Box = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.color};
  height: 100px;
  width:100px;
`;

    const theme = {
        backgroundColor: 'maroon',
        color: 'darkblue',
    };
    return (
        <Box theme={theme} />
    )
}

export default StyleComponent