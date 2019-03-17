import React from 'react'
import styled from 'styled-components'

export const ActionsContainer = styled.div`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: ${props => props.center ? "center" : ""};

    > .ui.button, a {
        flex-grow: ${props => props.no_grow ? 0 : 1};
        margin: 0.2em;
    }

    > a .ui.button {
      width: 100%;
    }
`