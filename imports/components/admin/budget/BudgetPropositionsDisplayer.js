import React, {Component} from 'react'
import styled from 'styled-components'
import { BudgetPropositions } from '/imports/api/budget_propositions/budget_propositions'
import { Pagination } from '/imports/components/general'
import { withTracker } from 'meteor/react-meteor-data'
import { AdminBudgetProposition } from '/imports/components/admin/budget'

class BudgetPropositionsDisplayer extends Component {
    state = {
    }

    render(){
        const { loading, budget_propositions, title} = this.props
        
        if(!loading){
            return(
                <MainContainer>
                    {budget_propositions.length == 0 ?
                        <h4>Aucune proposition pour l'instant</h4>
                    :
                        <h2>{title}</h2>
                    }
                    {budget_propositions.map(proposition => {
                        return <AdminBudgetProposition budget_proposition={proposition} />
                    })}           
                </MainContainer>
            )
        }else{
            return <div>Chargement des propositions</div>
        }
    }
}

export default BudgetPropositionsDisplayerContainer = withTracker((props) => {
    const { budget_consult_id, status, title } = props
    const budgetPropositionsPublication = Meteor.subscribe('budget_propositions.by_status', {budget_consult_id, status})
    const loading = !budgetPropositionsPublication.ready()
    const budget_propositions = BudgetPropositions.find({budget_consult: budget_consult_id, status}, {sort: {created_at: -1}}).fetch()
    return {
        loading,
        budget_propositions,
        title
    }
})(BudgetPropositionsDisplayer)

const MainContainer = styled.div`
    
`