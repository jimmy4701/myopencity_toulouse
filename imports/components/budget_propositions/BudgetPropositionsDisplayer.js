import React, {Component, Fragment} from 'react'
import styled from 'styled-components'
import { BudgetPropositionPartial } from '/imports/components/budget_propositions'
import { toast } from 'react-toastify'
import { Message, Button, Divider, Icon } from 'semantic-ui-react'

export default class BudgetPropositionsDisplayer extends Component {
    state = {
        maximum_votes: this.props.maximum_votes,
        votes: {},
        total_votes: 0,
        budget_propositions: [],
        page: 0
    }

    componentDidMount(){
        const { budget_consult_id, display_votes } = this.props
        this.loadPropositions({ budget_consult_id, votable: display_votes })
        if(display_votes){
            Meteor.call('budget_consults.has_voted', budget_consult_id , (error, has_voted) => {
                if(error){
                    console.log('Erreur', error.message)
                    toast.error(error.message)
                }else{
                    this.setState({has_voted})
                }
            })
        }
    }

    loadPropositions = ({votable, budget_consult_id, page = 0}) => {
        Meteor.call(`budget_propositions.get_${votable ? 'votable' : 'validated'}`, {budget_consult_id, page} , (error, {budget_propositions, budget_index}) => {
            if(error){
                console.log('Erreur', error.message)
                toast.error(error.message)
            }else{
                this.setState({budget_propositions, budget_index, page})
            }
        })
    }

    componentWillReceiveProps(props){
        if(parseFloat(props.page) != this.state.page){
            const { budget_consult_id, page, display_votes} = props
            this.loadPropositions({ budget_consult_id, votable: display_votes, page })
        }
    }

    handleVote = ({proposition_id, vote}) => {
        let {votes} = this.state
        votes[proposition_id] = parseFloat(vote)

        const total_votes = 0
        Object.entries(votes).forEach(entry => total_votes += entry[1])
        this.setState({votes, total_votes})
    }

    submitVotes = () => {
        const { budget_consult_id } = this.props
        const { votes } = this.state
        Meteor.call('budget_consults.vote_propositions', {budget_consult_id, votes} , (error, result) => {
            if(error){
                console.log('Erreur', error.message)
                toast.error(error.message)
            }else{
                toast.success("Vos choix ont bien été pris en compte")
                this.setState({has_voted: true})
                this.loadPropositions({budget_consult_id, votable: true})
            }
        })
    }

    render(){
        const { votable, loading, total_budget, display_votes} = this.props
        const { maximum_votes, total_votes, votes, budget_propositions, has_voted, budget_index} = this.state

        const { buttons_validation_background_color, buttons_validation_text_color } = Meteor.isClient && Session.get('global_configuration')

        
        const remaining_votes = maximum_votes - total_votes

        if(!loading){
            return(
                <MainContainer {...this.props}>
                    {votable && maximum_votes && !has_voted &&
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
                    {votable && has_voted &&
                        <Message
                            icon='check circle'
                            header='Vous avez déjà choisi vos idées préférées'
                            color="green"
                        />
                    }
                    {votable && !has_voted &&
                        <ValidationContainer>
                            <CustomButton disabled={(remaining_votes < 0) || (total_votes == 0)} background_color={buttons_validation_background_color} color={buttons_validation_text_color} size="huge" onClick={this.submitVotes}>
                                {remaining_votes >= 0 ? "Valider mes choix" : "Merci de retirer des coeurs"}
                            </CustomButton>
                        </ValidationContainer>
                    }
                    {budget_propositions.map((proposition, index) => {
                        return(
                            <Fragment>
                                <BudgetPropositionPartial display_votes={display_votes} votable={votable} has_voted={has_voted} onVote={this.handleVote} vote={votes[proposition._id]} key={proposition._id} budget_proposition={proposition} />
                                {(index == parseFloat(budget_index)) && <BudgetDivider horizontal><Icon name="caret up"/> Limite du budget ({total_budget.toLocaleString('fr')} €) <Icon name="caret up"/></BudgetDivider>}
                            </Fragment>
                        )
                    })}
                    
                </MainContainer>
            )
        }else{
            return <div>Chargement des propositions</div>
        }
    }
}

const MainContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: 1em;
    ${props => props.display_votes && "flex-direction: column;"}
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

const BudgetDivider = styled(Divider)`
    color: #a8a8a8 !important;
`