import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import ConsultForm from '/imports/components/consults/ConsultForm'
import {Grid, Header, Input, Button, Container, Loader} from 'semantic-ui-react'
import { createContainer } from 'meteor/react-meteor-data'
import {Consults} from '/imports/api/consults/consults'
import {ConsultParts} from '/imports/api/consult_parts/consult_parts'
import {withRouter} from 'react-router-dom'

export class AdminConsultEditPage extends TrackerReact(Component){

  /*
    required props:
      - consult_shorten_url: String
  */

  constructor(props){
    super(props);
    this.state = {
      consult: {},
      consult_parts: []
    }
  }

  componentWillMount(){
    const {consult, consult_parts} = this.props
    this.setState({consult, consult_parts})
  }

  go_consults_page(){
    this.props.history.push('/admin/consults')
  }

  render(){
    const {loading, consult, consult_parts} = this.props

    if(!loading){
      return(
        <Grid stackable className="wow fadeInLeft">
          <Grid.Column width={16} className="center-align">
            <Header as="h1">Édition d'une consultation</Header>
          </Grid.Column>
          <Grid.Column width={16}>
            <Container>
              <ConsultForm consult={consult} consult_parts={consult_parts} onFormSubmit={this.go_consults_page.bind(this)}/>
            </Container>
          </Grid.Column>
        </Grid>
      )
    }else{
      return <Loader className="inline-block">Chargement de la consultation</Loader>
    }
  }
}

export default AdminConsultEditPageContainer = createContainer(({ match }) => {
  const {consult_shorten_url} = match.params
  const consultPublication = Meteor.isClient && Meteor.subscribe('consult.admin_by_shorten_url', consult_shorten_url)
  const consultPartsPublication = Meteor.isClient && Meteor.subscribe('consult_parts.admin_by_consult_url_shorten', consult_shorten_url)
  const loading = Meteor.isClient && !consultPublication.ready() || !consultPartsPublication.ready()
  const consult = Consults.findOne({url_shorten: consult_shorten_url})
  const consult_parts = ConsultParts.find({}).fetch()
  return {
    loading,
    consult,
    consult_parts
  }
}, withRouter(AdminConsultEditPage))
