import React, {Component} from 'react'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'
import { SubTerritories } from '/imports/api/sub_territories/sub_territories'
import { Segment, Label, Button} from 'semantic-ui-react'
import { ActionsContainer } from '/imports/components/general'
import moment from 'moment'
import { AdminBudgetPropositionForm } from '/imports/components/admin/budget'
import { toast } from 'react-toastify'

class AdminBudgetProposition extends Component {
    state = {
    }

    toggleState = (e, {name}) => this.setState({[name]: !this.state[name]})

    handleSubmitForm = (budget_proposition) => {
        Meteor.call('budget_propositions.update', budget_proposition, (error, result) => {
            if(error){
                console.log('Erreur', error.message)
                toast.error(error.message)
            }else{
                this.setState({editing: false})
                toast.success("La proposition a bien été modifiée")
            }
        })
    }

    render(){
        const {budget_proposition, sub_territories, all_sub_territories, loading} = this.props
        const { editing } = this.state

        if(!loading){
            return(
                <MainContainer>
                    <Title>{budget_proposition.title} - Proposé le {moment(budget_proposition.created_at).format('DD/MM/YYYY à HH:mm')}</Title>
                    <Address>{budget_proposition.address}</Address>
                    <TerritoriesContainer>{sub_territories.map(territory => <Label size="mini">{territory.name}</Label>)}</TerritoriesContainer>
                    <Content>
                        <div dangerouslySetInnerHTML={{__html: budget_proposition.content }} />
                    </Content>
                    <ActionsContainer>
                        <Button onClick={this.toggleState} name="editing">{editing ? "Annuler" : "Modifier"}</Button>
                    </ActionsContainer>
                    {editing &&
                        <FormContainer>
                            <AdminBudgetPropositionForm onFormSubmit={this.handleSubmitForm} budget_proposition={budget_proposition} sub_territories={all_sub_territories} />
                        </FormContainer>
                    }
                </MainContainer>
            )
        }else{
            return <div></div>
        }
    }
}

export default AdminBudgetPropositionContainer = withTracker((props) => {
    const { budget_proposition } = props
    const subTerritoriesPublication = Meteor.subscribe('sub_territories.all')
    const loading = !subTerritoriesPublication.ready()
    const sub_territories = SubTerritories.find({_id: {$in: budget_proposition.sub_territories}}).fetch()
    const all_sub_territories = SubTerritories.find({}).fetch()
    return {
        loading,
        sub_territories,
        all_sub_territories,
        budget_proposition
    }
})(AdminBudgetProposition)

const MainContainer = styled(Segment)`
`

const Title = styled.div`
    font-weight: bold;
`

const Address = styled.div`
    
`

const TerritoriesContainer = styled.div`
    display: flex;
    flex-direction: row;
`

const Content = styled.div`
    margin-top: 1em;
`

const FormContainer = styled.div`
    margin-top: 1em;
`