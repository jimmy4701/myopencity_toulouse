import React, {Component} from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import ConsultForm from '/imports/components/consults/ConsultForm'
import {Grid, Header, Input, Button, Container, Loader} from 'semantic-ui-react'
import {withRouter} from 'react-router-dom'
import { Territories } from '/imports/api/territories/territories'

class AdminConsultCreationPage extends Component{

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

  go_consults_page = () => {
    this.props.history.push('/admin/consults')
  }

  render(){
    const {loading, territories, moderators} = this.props

    if(!loading){
      return(
         <Grid stackable className="wow fadeInLeft">
           <Grid.Column width={16} className="center-align">
             <Header as="h1">Création d'une consultation</Header>
           </Grid.Column>
           <Grid.Column width={16}>
             <Container>
               <ConsultForm territories={territories} onFormSubmit={this.go_consults_page} moderators={moderators} />
             </Container>
           </Grid.Column>
         </Grid>
      )
    }else{
      return <Loader className="inline-block">Chargement des données</Loader>
    }
  }
}

export default AdminConsultCreationPageContainer = createContainer(() => {
  const territoriesPublication = Meteor.isClient && Meteor.subscribe('territories.authorized_for_me')
  const moderatorsPublication = Meteor.isClient && Meteor.subscribe('admin.moderators')
  const loading = Meteor.isClient && (!territoriesPublication.ready() || !moderatorsPublication.ready())
  const moderators = Meteor.users.find({roles: {$in: ['moderator', 'admin']}}).fetch()
  const territories = Territories.find({}).fetch()
  return {
    loading,
    territories,
    moderators
  }
}, withRouter(AdminConsultCreationPage))
