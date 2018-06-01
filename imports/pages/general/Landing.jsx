import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { Grid, Header, Container, Loader, Image, Button, Card } from 'semantic-ui-react'
import { withTracker } from 'meteor/react-meteor-data'
import { Consults } from '/imports/api/consults/consults'
import { Projects } from '/imports/api/projects/projects'
import { Configuration } from '/imports/api/configuration/configuration'
import { Territories } from '/imports/api/territories/territories'
import { Link } from 'react-router-dom'
import TerritoriesMap from '/imports/components/territories/TerritoriesMap'
import ConsultPartial from '/imports/components/consults/ConsultPartial'
import ProjectPartial from '/imports/components/projects/ProjectPartial'
import _ from 'lodash'
import styled from 'styled-components'

export class Landing extends Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {

    const { consults, geolocated_consults, projects, global_configuration, territories, loading, className } = this.props
    const {
      landing_header_background_url,
      main_title,
      landing_main_title_color,
      landing_header_description_color,
      landing_main_title,
      landing_header_description,
      landing_consults_background_color,
      landing_projects_background_color,
      landing_explain_text,
      landing_header_height,
      landing_header_min_height,
      landing_explain_title,
      landing_explain_backtext,
      project_term,
      consult_term,
      landing_map_explain
    } = global_configuration

    if (!loading) {
      return (
        <Grid stackable centered className={className + " landing-page"}>
          <Grid.Column width={16}>
            <Grid className="landing-header" style={{ backgroundImage: "url(" + landing_header_background_url + ")", height: landing_header_height, minHeight: landing_header_min_height }} verticalAlign="middle">
              <Grid.Column width={16}>
                <Header className="wow fadeInUp main-title" style={{ color: landing_main_title_color }} as="h1">{landing_main_title}</Header>
                <Header className="wow fadeInUp main-subtitle" style={{ color: landing_header_description_color }} data-wow-delay="1s" as="h2">{landing_header_description}</Header>
              </Grid.Column>
            </Grid>
          </Grid.Column>
          <Grid.Column width={16} className="center-align landing-explain-part mobile-padding" verticalAlign="middle">
              <Grid verticalAlign="middle" stackable>
                {landing_explain_title &&
                  <Grid.Column width={16} className="center-align landing-title-container">
                    <Header as="h2">{landing_explain_title}</Header>
                  </Grid.Column>
                }
                <Grid.Column width={16}>
                  <Container>
                    <div className="dangerous" dangerouslySetInnerHTML={{ __html: landing_explain_text }}></div>
                  </Container>
                </Grid.Column>
              </Grid>
            </Grid.Column>  
            {consults.length > 0 ?
              <Grid.Column width={16} className="center-align landing-title-container mobile-padding" style={{backgroundColor: landing_consults_background_color}}>
                <Header as="h2">Les {consult_term}s du moment</Header>
                {consults.length > 0 &&
                  <Container>
                    <Card.Group itemsPerRow={4} className="centered" stackable>
                      {consults.map((consult, index) => {
                        return (
                            <ConsultPartial consult={consult} key={consult._id} />
                        )
                      })}
                    </Card.Group>
                  </Container>
                }
              </Grid.Column>
              : ''}
            {projects.length > 0 ?
              <Grid.Column width={16} className="center-align landing-title-container mobile-padding" style={{backgroundColor: landing_projects_background_color}}>
                <Header as="h2">Les {project_term}s proposés du moment</Header>
                <Container stackable centered>
                  <Card.Group itemsPerRow={4} className="centered" stackable>
                    {projects.map((project, index) => {
                      return (
                          <ProjectPartial project={project}/>
                      )
                    })}
                  </Card.Group>
                </Container>
              </Grid.Column>
              : ''}
              {landing_map_explain &&
                <Grid.Column width={16} textAlign="center" style={{padding: "4em"}}>
                  <div className="dangerous" dangerouslySetInnerHTML={{__html: landing_map_explain }} />
                </Grid.Column>
              }
              <Grid.Column width={16} className="not-padded">
                <Grid className="landing-header" verticalAlign="middle">
                  <Grid.Column width={16}>
                    <TerritoriesMap 
                      territories={territories}
                      consults={geolocated_consults}
                      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCziAxTCEOc9etrIjh77P86s_LA9plQdG4&v=3.exp&libraries=geometry,drawing,places"
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={<div style={{ height: `100vh`, width: '100vw', paddingLeft: '1em' }} />}
                      mapElement={<div style={{ height: `100%`, width: '100%' }} />}
                    
                    />
                  </Grid.Column>
                </Grid>
              </Grid.Column>
          </Grid>
          )
    }else{
      return <Loader className="inline-block">Chargement de la page</Loader>
          }
  }
}

export default LandingContainer = withTracker(() => {
  const landingConsultsPublication = Meteor.isClient && Meteor.subscribe('consults.landing')
  const landingProjectsPublication = Meteor.isClient && Meteor.subscribe('projects.landing')
  const territoriesPublication = Meteor.isClient && Meteor.subscribe('territories.active')
  const globalConfigurationPublication = Meteor.isClient && Meteor.subscribe('global_configuration')
  const loading = Meteor.isClient && (!landingConsultsPublication.ready() || !territoriesPublication.ready() || !landingProjectsPublication.ready() || !globalConfigurationPublication.ready())
  const geolocated_consults = Consults.find({coordinates: {$exists: true}, map_display: true}).fetch()
  const consults = Consults.find({landing_display: true}).fetch()
  const projects = Projects.find({landing_display: true}).fetch()
  const territories = Territories.find({active: true}).fetch()
  const global_configuration = Configuration.findOne()
  return {
    loading,
    consults,
    projects,
    territories,
    geolocated_consults,
    global_configuration
  }
})(styled(Landing)`
  > div .landing-header{
    ::after{
      content: "";
      position: absolute;
      background: -moz-linear-gradient(top, rgba(30,87,153,0) 0%, rgba(196,203,211,0) 88%, rgba(255,255,255,1) 100%); /* FF3.6-15 */
      background: -webkit-linear-gradient(top, rgba(30,87,153,0) 0%,rgba(196,203,211,0) 88%,rgba(255,255,255,1) 100%); /* Chrome10-25,Safari5.1-6 */
      background: linear-gradient(to bottom, rgba(30,87,153,0) 0%,rgba(196,203,211,0) 88%,rgba(255,255,255,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#001e5799', endColorstr='#dbdbdb',GradientType=0 ); /* IE6-9 */
      width: 100%;
      height: 100%;
    }

    > div h1, div h2 {

      @media screen and (max-width: 768px) {
        font-size: 3em !important;
      }
    }
  }
`)
