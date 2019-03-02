import React, {Component} from 'react'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'
import { BudgetConsults } from '/imports/api/budget_consults/budget_consults'
import { Container, Button } from 'semantic-ui-react'
import { ActionsContainer } from '/imports/components/general'
import { BudgetPropositionsNotVerified } from '/imports/components/admin/budget'
import Helmet from 'react-helmet'

class AdminBudgetPropositions extends Component {
    state = {
        step: "not-verified"
    }

    changeStep = (e, {name}) => this.setState({step: name})

    render(){
        const { budget_consult, loading } = this.props
        const { step } = this.state

        if(!loading){
            return(
                <MainContainer>
                    <Helmet>
                        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCziAxTCEOc9etrIjh77P86s_LA9plQdG4&libraries=geometry,places"/>
                    </Helmet>
                    <CustomContainer>
                        <h1>{budget_consult.title}</h1>
                        <h2>Gestion des propositions de budget participatif</h2>
                        <ActionsContainer>
                            <Button onClick={this.changeStep} active={step == 'not-verified'} name="not-verified">Proposées non validées</Button>
                            <Button onClick={this.changeStep} active={step == 'validated'} name="validated">Proposées non validées</Button>
                            <Button onClick={this.changeStep} active={step == 'selected'} name="selected">Proposées non validées</Button>
                        </ActionsContainer>
                        {step == 'not-verified' &&
                            <BudgetPropositionsNotVerified budget_consult_id={budget_consult._id}/>
                        }
                    </CustomContainer>
                </MainContainer>
            )
        }else{
            return <div>Chargement du budget participatif</div>
        }
    }
}

export default AdminBudgetPropositionsContainer = withTracker(({match}) => {
    const { budget_consult_id } = match.params
    const budgetConsultPublication = Meteor.subscribe('budget_consults.by_id', budget_consult_id)
    const loading = !budgetConsultPublication.ready()
    const budget_consult = BudgetConsults.findOne({_id: budget_consult_id})
    return {
        loading,
        budget_consult
    }
})(AdminBudgetPropositions)

const MainContainer = styled.div`
    
`

const CustomContainer = styled(Container)`
    
`