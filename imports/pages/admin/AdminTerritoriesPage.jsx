import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {Grid, Header, Button, Loader, Container, Icon} from 'semantic-ui-react'
import TerritoryPartial from '/imports/components/territories/TerritoryPartial'
import TerritoryForm from '/imports/components/territories/TerritoryForm'
import {Territories} from '/imports/api/territories/territories'
import { withTracker } from 'meteor/react-meteor-data'
import {Link} from 'react-router-dom'

export class AdminTerritoriesPage extends Component{

  /*
    required props:
      - none
  */

  state = {
    display_form: false
  }

  toggleState = (e) => {
    this.setState({[e.target.name]: !this.state[e.target.name], editing_territory: null})
  }

  onSubmit = () => {
    this.setState({display_form: false, editing_territory: null})
  }

  editTerritory = (territory) => {
    this.setState({display_form: true, editing_territory: territory})
  }


  render(){
    const {territories, loading} = this.props
    const {display_form, editing_territory} = this.state

    if(!loading){
      return(
        <Grid stackable className="wow fadeInLeft">
          <Grid.Column width={16} className="center-align">
            <Header as="h1">Gestion des territoires / quartiers</Header>
          </Grid.Column>
          <Grid.Column width={16}>
            <Container>
                <Button color={!display_form && "green"} onClick={this.toggleState} name="display_form" >{display_form ? "Annuler" : "Créer un nouveau territoire"}</Button>
                {display_form ?
                  <TerritoryForm territory={editing_territory} onSubmitForm={this.onSubmit} />
              :
                <Grid stackable>
                  {territories.map((territory, index) => {
                    return (
                      <Grid.Column key={index} width={4} className="center-align">
                        <TerritoryPartial territory={territory} onEditClick={() => this.editTerritory(territory)} />
                      </Grid.Column>
                    )
                  })}
                </Grid>
              }
            </Container>
          </Grid.Column>
        </Grid>
      )
    }else{
      return <Loader className="inline-block">Chargement des consultations</Loader>
    }
  }
}

export default AdminTerritoriesPageContainer = withTracker(() => {
  const territoriesPublication = Meteor.isClient && Meteor.subscribe('territories.all')
  const loading = Meteor.isClient && !territoriesPublication.ready()
  const territories = Territories.find({}).fetch()
  return {
    loading,
    territories
  }
})(AdminTerritoriesPage)
