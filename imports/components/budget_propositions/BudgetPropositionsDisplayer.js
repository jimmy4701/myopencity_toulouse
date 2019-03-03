import React, {Component} from 'react'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'
import { BudgetPropositions } from '/imports/api/budget_propositions/budget_propositions'
import { BudgetPropositionPartial } from '/imports/components/budget_propositions'

class BudgetPropositionsDisplayer extends Component {
    state = {
        
    }

    render(){
        const {budget_propositions, loading} = this.props

        if(!loading){
            return(
                <MainContainer>
                    {budget_propositions.map(proposition => <BudgetPropositionPartial key={proposition._id} budget_proposition={proposition} />)}
                </MainContainer>
            )
        }else{
            return <div>Chargement des propositions</div>
        }
    }
}

export default BudgetPropositionsDisplayerContainer = withTracker((props) => {
    const {budget_consult_id, page, status} = props
    const budgetPropositionsPublication = Meteor.isClient && Meteor.subscribe('budget_propositions.by_budget_consult', {budget_consult_id, page, status})
    const loading = Meteor.isClient && !budgetPropositionsPublication.ready()
    const budget_propositions = BudgetPropositions.find({budget_consult: budget_consult_id, $and: [{status: 'validated'}, {status}] }, {limit: 10, skip: 10 * page}).fetch()
    return {
        loading,
        budget_propositions
    }
})(BudgetPropositionsDisplayer)

const MainContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: 1em;
`