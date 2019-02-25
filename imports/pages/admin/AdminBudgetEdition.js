import React, {Component} from 'react'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'
import { Container } from 'semantic-ui-react'

class AdminBudgetEdition extends Component {
    state = {
        
    }

    render(){
        const {id} = this.props

        return(
            <MainContainer>
                <Container>
                    <h1>Edition de budget participatif</h1>
                    <h2>Budget {id}</h2>
                </Container>
            </MainContainer>
        )
    }
}

export default AdminBudgetEditionionContainer = withTracker(({match}) => {
    const {id} = match.params
    return {
       id
      }
})(AdminBudgetEdition)

const MainContainer = styled.div`
    
`