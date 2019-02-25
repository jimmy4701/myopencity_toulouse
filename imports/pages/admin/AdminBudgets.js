import React, {Component} from 'react'
import styled from 'styled-components'
import { Button, Grid, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class AdminBudgets extends Component {
    state = {
        
    }

    render(){
        return(
            <MainContainer>
                <Container>
                    <Grid stackable>
                        <Grid.Column width={16}>
                            <Link to="/admin/budgets/new">
                                <Button positive>Création d'un budget participatif</Button>
                            </Link>
                        </Grid.Column>
                    </Grid>
                </Container>
            </MainContainer>
        )
    }
}

const MainContainer = styled.div`
    background-color: red;
    height: 100vh;
`