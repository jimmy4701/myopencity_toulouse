import React, {Component, Fragment} from 'react'
import styled from 'styled-components'
import { Container, Button, Card, Form } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { SubTerritoryForm, SubTerritoryPartial } from '/imports/components/sub_territories'
import { withTracker } from 'meteor/react-meteor-data'
import { SubTerritories } from '/imports/api/sub_territories/sub_territories'
import { Territories } from '/imports/api/territories/territories'

class AdminSubTerritories extends Component {
    state = {
        
    }

    handleTerritoryFilter = (event, {value}) => this.setState({territory_filter: value})

    selectTerritory = (active_sub_territory) => this.setState({active_sub_territory, display_form: true})

    toggleForm = () => this.setState({display_form: !this.state.display_form, active_sub_territory: null})

    render(){
        const { display_form, active_sub_territory, territory_filter } = this.state
        const { loading, sub_territories, territories } = this.props

        if(!loading){
            const territories_options = territories.map(territory => {
                return {key: territory._id, value: territory._id, text: territory.name}
            })
            territories_options.push({key: null, value: null, text: "Tous les territoires"})

            const filtered_sub_territories = territory_filter ? sub_territories.filter(o => o.parent_territory == territory_filter) : sub_territories

            return(
                <MainContainer className="animated fadeInLeft">
                    <Container>
                        <h1>Gestion des sous-territoires</h1>
                        <Button onClick={this.toggleForm} name="display_form">{display_form ? "Annuler" : "Créer un sous-territoire"}</Button>
                        {!display_form &&
                            <Link to="/admin/territories">
                                <Button icon="map" content="Gérer les territoires" />
                            </Link>
                        }
                        {!display_form ?
                                <div>
                                    <Form>
                                        <Form.Select
                                            options={territories_options}
                                            label="Filtrer par quartier"
                                            onChange={this.handleTerritoryFilter}
                                            value={territory_filter}
                                        />
                                    </Form>
                                    <TerritoriesContainer>
                                        {sub_territories.length > 0 ?
                                            filtered_sub_territories.map(sub_territory => <SubTerritoryPartial key={sub_territory._id} onEditClick={() => this.selectTerritory(sub_territory)} sub_territory={sub_territory} />)
                                        :
                                            <h3>Aucun sous-territoire pour le moment</h3>
                                        }
                                    </TerritoriesContainer>
                                </div>
                        :
                            <SubTerritoryForm sub_territory={active_sub_territory} onFormSubmit={() => this.setState({display_form: false})} />
                        }
                    </Container>
                </MainContainer>
            )
        }else{
            return <div>Chargement des sous-territoires</div>
        }
    }
}

export default AdminSubTerritoriesContainer = withTracker(() => {
    const subTerritoriesPublication = Meteor.subscribe('sub_territories.all')
    const territoriesPublication = Meteor.subscribe('territories.all')
    const loading = !subTerritoriesPublication.ready() || !territoriesPublication.ready()
    const sub_territories = SubTerritories.find({}).fetch()
    const territories = Territories.find({}).fetch()
    return {
        loading,
        sub_territories,
        territories
    }
})(AdminSubTerritories)

const MainContainer = styled.div`
    
`

const TerritoriesContainer = styled(Card.Group)`
    margin-top: 2em !important;
`