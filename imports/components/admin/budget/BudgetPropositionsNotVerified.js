import React, {Component} from 'react'
import styled from 'styled-components'
import { BudgetPropositions } from '/imports/api/budget_propositions/budget_propositions'
import { Pagination } from '/imports/components/general'
import { withTracker } from 'meteor/react-meteor-data'
import { AdminBudgetProposition } from '/imports/components/admin/budget'

class BudgetPropositionsNotVerified extends Component {
    state = {
        page: 0,
        total_pages: 2
    }

    render(){
        const { page, total_pages } = this.state
        const { loading, budget_propositions} = this.props
        
        if(!loading){
            return(
                <MainContainer>
                    <p>NOT VERIFIED</p>
                    {budget_propositions.map(proposition => {
                        return <AdminBudgetProposition budget_proposition={proposition} />
                    })}
                    <Pagination total_pages={total_pages} onPageClick={this.changePage} />                
                </MainContainer>
            )
        }else{
            return <div>Chargement des propositions</div>
        }
    }
}

export default BudgetPropositionsNotVerifiedContainer = withTracker((props) => {
    const { budget_consult_id } = props
    const budgetPropositionsPublication = Meteor.subscribe('budget_propositions.by_status', {budget_consult_id, status: "not_verified"})
    const loading = !budgetPropositionsPublication.ready()
    const budget_propositions = BudgetPropositions.find({budget_consult: budget_consult_id, status: "not_verified"}, {sort: {created_at: -1}}).fetch()
    return {
        loading,
        budget_propositions
    }
})(BudgetPropositionsNotVerified)

const MainContainer = styled.div`
    
`