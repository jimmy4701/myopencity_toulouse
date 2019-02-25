import React, {Component} from 'react'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'
import { Territories } from '/imports/api/territories/territories'
import { SubTerritories } from '/imports/api/sub_territories/sub_territories'
import { Form } from 'semantic-ui-react'

class BudgetConsultTerritoriesForm extends Component {
    state = {
        budget_consult: {}
    }

    componentWillMount(){
        const {budget_consult} = this.props
        this.setState({budget_consult})
    }

    componentWillUnmount(){
        const {budget_consult} = this.state
        this.props.onFormSubmit(budget_consult)
    }

    handleTerritoriesSelect = (event, {value}) => {
        let { budget_consult } = this.state
        budget_consult.territories = value
        this.setState({budget_consult})
    }

    toggleSubTerritory = (sub_territory_id) => {
        let {budget_consult} = this.state
        const index = budget_consult.sub_territories.indexOf(sub_territory_id)
        if(index == -1){
            budget_consult.sub_territories.push(sub_territory_id)
        }else{
            budget_consult.sub_territories = budget_consult.sub_territories.filter(o => o != sub_territory_id)
        }
        this.setState({budget_consult})
    }

    render(){
        const {loading, territories, sub_territories} = this.props
        const { budget_consult } = this.state

        if(!loading){

            const territories_options = territories.map(territory => {
                return {key: territory._id, value: territory._id, text: territory.name}
            })

            return(
                <MainContainer>
                    <Form>
                        <Form.Select
                            options={territories_options}
                            value={budget_consult.territories}
                            onChange={this.handleTerritoriesSelect}
                            label="Quartiers concernés"
                            multiple
                        />
                    </Form>
                    <SubTerritoriesContainer>
                        {sub_territories.map(sub_territory => {
                            const is_active = budget_consult.sub_territories.indexOf(sub_territory._id) >= 0
                            return <SubTerritoryPartial onClick={() => this.toggleSubTerritory(sub_territory._id)} active={is_active}>{sub_territory.name}</SubTerritoryPartial>
                        })}
                    </SubTerritoriesContainer>
                </MainContainer>
            )
        }else{
            return <div>Chargement des territoires</div>
        }
    }
}

export default BudgetConsultTerritoriesFormContainer = withTracker(() => {
    const territoriesPublication = Meteor.subscribe('territories.all')
    const subTerritoriesPublication = Meteor.subscribe('sub_territories.all')
    const loading = !territoriesPublication.ready() || !subTerritoriesPublication.ready()
    const territories = Territories.find({}).fetch()
    const sub_territories = SubTerritories.find({}).fetch()
    return {
        loading,
        territories,
        sub_territories
    }
})(BudgetConsultTerritoriesForm)

const MainContainer = styled.div`
    
`

const SubTerritoriesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`

const SubTerritoryPartial = styled.div`
    cursor: pointer;
    background-color: ${props => props.active ? "#c20012" : "white"};
    border: 1px solid #c20012;
    padding: 1em;
    margin: 1em;
    border-radius: 0.3em;
    color: ${props => props.active ? "white" : "black"};
`