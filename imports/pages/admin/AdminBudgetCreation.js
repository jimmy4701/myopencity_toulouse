import React, {Component} from 'react'
import styled from 'styled-components'
import { Container } from 'semantic-ui-react'

export default class AdminBudgetCreation extends Component {
    state = {
        
    }

    render(){
        return(
            <MainContainer>
                <Container>
                    <h1>Création d'un budget participatif</h1>
                </Container>
            </MainContainer>
        )
    }
}

const MainContainer = styled.div`
    
`