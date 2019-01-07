import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {Grid, Header, Button, Loader, Container, Icon, Form} from 'semantic-ui-react'
import ConsultPartial from '/imports/components/consults/ConsultPartial'
import {Consults} from '/imports/api/consults/consults'
import { createContainer } from 'meteor/react-meteor-data'
import {Link} from 'react-router-dom'

export class AdminConsultsPage extends TrackerReact(Component){

  /*
    required props:
      - none
  */

  state = {

  }

  handleChange = (e, {name, value}) => this.setState({[name]: value})

  render(){
    const {consults, loading} = this.props
    const {filter_text} = this.state
    if(!loading){

      const filtered_consults = filter_text ? consults.filter(o => o.title.match(new RegExp(filter_text, 'ig'))) : consults

      return(
        <Grid stackable className="wow fadeInLeft">
          <Grid.Column width={16} className="center-align">
            <Header as="h1">Gestion des consultations</Header>
          </Grid.Column>
          <Grid.Column width={16}>
            <Container>
              <div style={{marginBottom: "1em"}}>
                <Link to="/admin/consults/new">
                  <Button positive>Créer une nouvelle consultation</Button>
                </Link>
                {consults.length > 0 &&
                  <Link to="/admin/consults_summary" target="_blank">
                    <Button><Icon name="print"/> Compte rendu imprimable</Button>
                  </Link>
                }
              </div>
              {consults.length > 0 &&
                <div style={{margin: "1em 0"}}>
                  <Form>
                    <Form.Input
                      label='Rechercher une consultation par titre'
                      onChange={this.handleChange}
                      value={filter_text}
                      name='filter_text'
                    />
                  </Form>
                </div>
              }
              <Grid stackable>
                {filtered_consults.map((consult, index) => {
                  return (
                    <Grid.Column key={index} width={4} className="center-align">
                      <ConsultPartial consult={consult} display_dates />
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

export default AdminConsultsPageContainer = createContainer(() => {
  const consultsPublication = Meteor.isClient && Meteor.subscribe('consults.all')
  const loading = Meteor.isClient && !consultsPublication.ready()
  const consults = Consults.find({}).fetch()
  return {
    loading,
    consults
  }
}, AdminConsultsPage)
