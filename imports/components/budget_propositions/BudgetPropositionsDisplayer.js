import React, {Component} from 'react'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'
import { BudgetPropositions } from '/imports/api/budget_propositions/budget_propositions'
import { BudgetPropositionPartial } from '/imports/components/budget_propositions'
import { toast } from 'react-toastify'
import { Message, Button } from 'semantic-ui-react'

class BudgetPropositionsDisplayer extends Component {
    state = {
        maximum_votes: this.props.maximum_votes,
        votes: {},
        total_votes: 0
    }

    handleVote = ({proposition_id, vote}) => {
        let {votes} = this.state
        votes[proposition_id] = parseFloat(vote)

        const total_votes = 0
        Object.entries(votes).forEach(entry => total_votes += entry[1])
        this.setState({votes, total_votes})
    }

    submitVotes = () => {
        const { votes } = this.state
        toast.success(JSON.stringify(votes))
    }

    render(){
        const {budget_propositions, votable, loading} = this.props
        const { maximum_votes, total_votes, votes} = this.state

        const { buttons_validation_background_color, buttons_validation_text_color } = Meteor.isClient && Session.get('global_configuration')

        
        const remaining_votes = maximum_votes - total_votes

        if(!loading){
            return(
                <MainContainer {...this.props}>
                    {votable && maximum_votes &&
                        <TotalVotesContainer>
                            <h2>Vous disposez de {maximum_votes} coeurs à donner à vos idées préférées</h2>
                            
                            {remaining_votes > 0 ?
                                <Message
                                    icon='heart'
                                    header='Placez des coeurs sur vos idées préférées'
                                    content={`Il vous reste ${remaining_votes} coeur${remaining_votes > 1 ? 's' : ''}`}
                                    color="green"
                                />
                            : remaining_votes === 0 ?
                                <Message
                                    icon='heart'
                                    header='Vous avez utilisé tous vos coeurs'
                                    color="green"
                                />                                
                            :
                                <Message
                                    icon='heart'
                                    header='Merci de retirer des coeurs'
                                    content={`Vous avez utilisé ${-remaining_votes} coeur${-remaining_votes > 1 ? 's' : ''} en plus de ceux disponibles. Merci d'en retirer.`}
                                    color="red"
                                />                                                         
                            }
                        </TotalVotesContainer>
                    }
                    {votable &&
                        <ValidationContainer>
                            <CustomButton disabled={(remaining_votes < 0) || (total_votes == 0)} background_color={buttons_validation_background_color} color={buttons_validation_text_color} size="huge" onClick={this.submitVotes}>
                                {remaining_votes >= 0 ? "Valider mes choix" : "Merci de retirer des coeurs"}
                            </CustomButton>
                        </ValidationContainer>
                    }
                    {budget_propositions.map(proposition => {
                        return <BudgetPropositionPartial votable={votable} onVote={this.handleVote} vote={votes[proposition._id]} key={proposition._id} budget_proposition={proposition} />
                    })}
                    
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
    ${props => props.votable && "flex-direction: column;"}
`

const TotalVotesContainer = styled.div`
    margin: 2em 0;
    width: 100%;
`

const CustomButton = styled(Button)`
    ${props => !props.disabled ? `
        background-color: ${props.background_color} !important;
        color: ${props.color} !important;
    `: `
        background-color: #aeaeae !important;
        color: black !important;
    `}
`
const ValidationContainer = styled.div`
    margin: 2em 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`