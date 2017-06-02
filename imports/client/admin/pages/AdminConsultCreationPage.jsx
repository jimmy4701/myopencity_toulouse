import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import ConsultForm from '/imports/client/consults/ui/ConsultForm'
import {Grid, Header, Input, Button, Container} from 'semantic-ui-react'

export default class AdminConsultCreationPage extends TrackerReact(Component){

  /*
    required props:
      - none
  */

  constructor(props){
    super(props);
    this.state = {
      consult: {}
    }
  }

  go(route, e){
    e.preventDefault()
    FlowRouter.go(route)
  }

  render(){
    return(
       <Grid stackable className="wow fadeInLeft">
         <Grid.Column width={16} className="center-align">
           <Header as="h1">Création d'une consultation</Header>
         </Grid.Column>
         <Grid.Column width={16}>
           <Container>
             <ConsultForm onFormSubmit={(e) => {this.go('AdminConsults', e)}} />
           </Container>
         </Grid.Column>
       </Grid>
    )
  }
}
