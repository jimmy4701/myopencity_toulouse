import React, {Component} from 'react'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'
import { BudgetConsults } from '/imports/api/budget_consults/budget_consults'

class BudgetConsult extends Component {
    state = {
        
    }

    render(){
        const { loading, budget_consult } = this.props

        if(!loading){
            return(
                <MainContainer>
                    <h3>{budget_consult.title}</h3>
                </MainContainer>
            )
        }else{
            return <div></div>
        }
    }
}

export default BudgetConsultContainer = withTracker(({match}) => {
    const { url_shorten } = match.params
    const budgetConsultPublication = Meteor.isClient && Meteor.subscribe('budget_consults.by_url_shorten', url_shorten)
    const loading = Meteor.isClient && (!budgetConsultPublication.ready())
    const budget_consult = BudgetConsults.findOne({url_shorten})
    return {
        loading,
        budget_consult
    }
})(BudgetConsult)

const MainContainer = styled.div`
    
`