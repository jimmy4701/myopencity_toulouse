import React, {Component} from 'react'
import styled from 'styled-components'
import { BudgetPropositionPartial } from '/imports/components/budget_propositions'
import { toast } from 'react-toastify'
import { Message, Button } from 'semantic-ui-react'

export default class BudgetPropositionsDisplayer extends Component {
    state = {
        maximum_votes: this.props.maximum_votes,
        votes: {},
        total_votes: 0,
        budget_propositions: [],
        page: 0
    }

    componentDidMount(){
        const { budget_consult_id, page, votable } = this.props
        this.loadPropositions({ budget_consult_id, votable })
        if(votable){
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
        Meteor.call(`budget_propositions.get_${votable ? 'votable' : 'validated'}`, {budget_consult_id, page} , (error, budget_propositions) => {
            if(error){
                console.log('Erreur', error.message)
                toast.error(error.message)
            }else{
                this.setState({budget_propositions, page})
            }
        })
    }

    componentWillReceiveProps(props){
        if(parseFloat(props.page) != this.state.page){
            const { budget_consult_id, page, votable } = props
            this.loadPropositions({ budget_consult_id, votable, page })
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
        const { votable, loading} = this.props
        const { maximum_votes, total_votes, votes, budget_propositions, has_voted} = this.state

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
                    {budget_propositions.map(proposition => {
                        return <BudgetPropositionPartial votable={votable} has_voted={has_voted} onVote={this.handleVote} vote={votes[proposition._id]} key={proposition._id} budget_proposition={proposition} />
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