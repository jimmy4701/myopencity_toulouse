import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { createContainer } from 'meteor/react-meteor-data'
import { Grid, Header, Loader, Button, Container } from 'semantic-ui-react'
import ConsultPartial from '/imports/components/consults/ConsultPartial'
import { Consults } from '/imports/api/consults/consults'

export class ConsultsPage extends TrackerReact(Component) {

  /*
    required props:
      - none
  */

  constructor(props) {
    super(props);
    this.state = {
      show_ended_consults: false
    }
  }

  toggleState(attr, e) {
    let state = this.state
    state[attr] = !state[attr]
    this.setState(state)
  }

  render() {
    const { consults, ended_consults, loading } = this.props
    const { show_ended_consults } = this.state
    const { ended_consults_title, consults_title, consults_no_consults, navbar_color, consults_all_territories, consults_display_explain, consults_explain } = Meteor.isClient && Session.get('global_configuration')

    if (!loading) {
      return (
        <Container>
          <Grid className="wow fadeInUp" stackable>
            <Grid.Column width={16} className="territory-consults-header mobile-padding">
              <Header as="h1" className="wow fadeInUp territory-name" style={{ color: navbar_color, fontSize: "2.5em" }}>{consults_all_territories}</Header>
              <Header as="h3" className="wow fadeInDown territory-label" data-wow-delay="0.5s">{!show_ended_consults ? consults_title : ended_consults_title}</Header>
              {ended_consults.length > 0 ?
                <Button size="mini" onClick={(e) => { this.toggleState('show_ended_consults', e) }}>Voir les consultations {!show_ended_consults ? "terminées" : "en cours"}</Button>
                : ''}
              {consults_display_explain &&
                <div className="dangerous" dangerouslySetInnerHTML={{__html: consults_explain }} />
              }
            </Grid.Column>
            {!show_ended_consults ?
              <Grid.Column width={16} className="mobile-padding">
                {consults.length == 0 ?
                  <Header className="center-align" as="h3">{consults_no_consults}</Header>
                  :
                  <Grid stackable>
                    {consults.map((consult, index) => {
                      return (
                        <Grid.Column width={4} className="center-align" key={consult._id}>
                          <ConsultPartial className="wow fadeInUp" consult={consult} />
                        </Grid.Column>
                      )
                    })}
                  </Grid>
                }
              </Grid.Column>
              :
              <Grid.Column width={16}>
                {ended_consults.length == 0 ?
                  <Header className="center-align" as="h3">Aucune consultation terminée actuellement</Header>
                  :
                  <Grid stackable>
                    {ended_consults.map((consult, index) => {
                      return (
                        <Grid.Column width={4} className="center-align">
                          <ConsultPartial className="wow fadeInUp" consult={consult} />
                        </Grid.Column>
                      )
                    })}
                  </Grid>
                }
              </Grid.Column>
            }
          </Grid>
        </Container>
      )
    } else {
      return <Loader className="inline-block">Chargement des consultations</Loader>
    }
  }
}

export default ConsultsPageContainer = createContainer(() => {
  const consultsPublication = Meteor.isClient && Meteor.subscribe('consults.visible')
  const territoriesPublication = Meteor.isClient && Meteor.subscribe('territories.active')
  const loading = Meteor.isClient && (!territoriesPublication.ready() || !consultsPublication.ready())
  const consults = Consults.find({ visible: true, ended: false }, {sort: {title: 1}}).fetch()
  const ended_consults = Consults.find({ visible: true, ended: true },  {sort: {title: 1}}).fetch()
  return {
    loading,
    consults,
    ended_consults
  }
}, ConsultsPage)
