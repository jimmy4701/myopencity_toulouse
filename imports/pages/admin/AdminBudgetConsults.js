import React, {Component} from 'react'
import styled from 'styled-components'
import { Button, Grid, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import { BudgetConsults } from '/imports/api/budget_consults/budget_consults'
import { BudgetConsultPartial } from '/imports/components/budget_consults'

class AdminBudgetConsults extends Component {
    state = {
        
    }

    render(){
        const { loading, budget_consults} = this.props

        if(!loading){
            return(
                <MainContainer>
                    <Container>
                        <Grid stackable>
                            <Grid.Column width={16}>
                                <Link to="/admin/budgets/new">
                                    <Button positive>Créer un budget participatif</Button>
                                </Link>
                            </Grid.Column>
                            <Grid.Column width={16}>
                                {budget_consults.length > 0 ? 
                                    budget_consults.map(budget_consult => {
                                        return <BudgetConsultPartial budget_consult={budget_consult} />
                                    })
                                :
                                    <h3>Aucun budget participatif pour le moment</h3>
                                }
                            </Grid.Column>
                        </Grid>
                    </Container>
                </MainContainer>
            )
        }else{
            return <div>Chargement des budgets participatifs</div>
        }
    }
}

export default AdminBudgetConsultsContainer = withTracker(() => {
    const budgetConsultsPublication = Meteor.subscribe('budget_consults.all')
    const loading = !budgetConsultsPublication.ready()
    const budget_consults = BudgetConsults.find({}).fetch()
    return {
       loading,
        budget_consults
      }
})(AdminBudgetConsults)

const MainContainer = styled.div`
    height: 100vh;
`