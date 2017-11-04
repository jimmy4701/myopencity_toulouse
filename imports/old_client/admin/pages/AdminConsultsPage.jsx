import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {Grid, Header, Button, Loader, Container} from 'semantic-ui-react'
import ConsultPartial from '/imports/client/consults/ui/ConsultPartial'
import {Consults} from '/imports/api/consults/consults'
import { createContainer } from 'meteor/react-meteor-data';

export class AdminConsultsPage extends TrackerReact(Component){

  /*
    required props:
      - none
  */

  constructor(props){
    super(props)
    this.state = {

    }
    console.log(this.props.consults)

  }

  go(route){
    FlowRouter.go(route)
  }

  render(){
    const consults = this.props.consults
    if(!this.props.loading){
      return(
        <Grid stackable className="wow fadeInLeft">
          <Grid.Column width={16} className="center-align">
            <Header as="h1">Gestion des consultations</Header>
          </Grid.Column>
          <Grid.Column width={16}>
            <Container>
              <Button positive onClick={(e) => {this.go('AdminConsultCreation')}}>Créer une nouvelle consultation</Button>
              <Grid stackable>
                {consults.map((consult, index) => {
                  return (
                    <Grid.Column key={index} width={4} className="center-align">
                      <ConsultPartial consult={consult} />
                    </Grid.Column>
                  )
                })}
              </Grid>
            </Container>
          </Grid.Column>
        </Grid>
      )
    }else{
      return <Loader className="inline-block">Chargement des consultations</Loader>
    }
  }
}

export default AdminConsultsPageContainer = createContainer(({ id }) => {
  const consultsPublication = Meteor.subscribe('consults.all')
  const loading = !consultsPublication.ready()
  const consults = Consults.find({}).fetch()
  return {
    loading,
    consults
  }
}, AdminConsultsPage)
