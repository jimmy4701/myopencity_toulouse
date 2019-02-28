import React, {Component} from 'react'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'
import { Container } from 'semantic-ui-react'
import { BudgetConsults } from '/imports/api/budget_consults/budget_consults'
import { BudgetConsultForm } from '/imports/components/budget_consults'
import { withRouter } from 'react-router-dom'

class AdminBudgetEdition extends Component {
    state = {
        
    }

    render(){
        const {loading, budget_consult} = this.props

        if(!loading){
            return(
                <MainContainer>
                    <Container>
                        <h1>Edition de budget participatif</h1>
                        <BudgetConsultForm budget_consult={budget_consult} onFormSubmit={() => this.props.history.push('/admin/budgets')}/>
                    </Container>
                </MainContainer>
            )
        }else{
           return <div>Chargement de la consultation</div>
        }
    }
}

export default AdminBudgetEditionionContainer = withTracker(({match}) => {
    const {id} = match.params
    const budgetPublication = Meteor.subscribe('budget_consults.by_id', id)
    const loading = !budgetPublication.ready()
    const budget_consult = BudgetConsults.findOne({_id: id})
    return {
       loading,
       budget_consult
    }
})(withRouter(AdminBudgetEdition))

const MainContainer = styled.div`
    
`