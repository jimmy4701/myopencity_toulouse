import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { Grid, Header, Container, Loader, Image, Button } from 'semantic-ui-react'
import { createContainer } from 'meteor/react-meteor-data'
import { Consults } from '/imports/api/consults/consults'
import { Projects } from '/imports/api/projects/projects'
import { Configuration } from '/imports/api/configuration/configuration'
import { Territories } from '/imports/api/territories/territories'
import { Link } from 'react-router-dom'
import TerritoriesMap from '/imports/components/territories/TerritoriesMap'
import ConsultPartial from '/imports/components/consults/ConsultPartial'
import ProjectPartial from '/imports/components/projects/ProjectPartial'
import _ from 'lodash'

export class Landing extends Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {

    const { consults, projects, global_configuration, territories, loading } = this.props
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
      consult_term
    } = global_configuration

    if (!loading) {
      return (
        <Grid stackable centered className="landing-page">
          <Grid.Column width={16}>
            <Grid className="landing-header" style={{ backgroundImage: "url(" + landing_header_background_url + ")", height: landing_header_height, minHeight: landing_header_min_height }} verticalAlign="middle">
              <Grid.Column width={16}>
                <Header className="wow fadeInUp main-title" style={{ color: landing_main_title_color }} as="h1">{landing_main_title}</Header>
                <Header className="wow fadeInUp" style={{ color: landing_header_description_color }} data-wow-delay="1s" as="h2">{landing_header_description}</Header>
              </Grid.Column>
            </Grid>
          </Grid.Column>
          <Grid.Column width={16} className="center-align landing-explain-part" verticalAlign="middle">
              <Grid verticalAlign="middle" stackable>
                {landing_explain_title &&
                  <Grid.Column width={16} className="center-align landing-title-container">
                    <Header as="h2">{landing_explain_title}</Header>
                  </Grid.Column>
                }
                <Grid.Column width={16}>
                  <Container>
                    <div dangerouslySetInnerHTML={{ __html: landing_explain_text }}></div>
                  </Container>
                </Grid.Column>
              </Grid>
            </Grid.Column>  
            {consults.length > 0 ?
              <Grid.Column width={16} className="center-align landing-title-container" style={{backgroundColor: landing_consults_background_color}}>
                <Header as="h2">Les {consult_term}s du moment</Header>
                {consults.length > 0 ?
                <Grid stackable centered>
                  {consults.map((consult, index) => {
                    return (
                      <Grid.Column width={5} className="center-align wow fadeInUp" key={consult._id}>
                        <ConsultPartial consult={consult} />
                      </Grid.Column>
                    )
                  })}
                </Grid>
                  : ''}
              </Grid.Column>
              : ''}
            {projects.length > 0 ?
              <Grid.Column width={16} className="center-align landing-title-container" style={{backgroundColor: landing_projects_background_color}}>
                <Header as="h2">Les {project_term}s proposés du moment</Header>
                <Grid stackable centered>
                    {projects.map((project, index) => {
                      return (
                        <Grid.Column width={5} className="center-align wow fadeInUp" key={project._id}>
                          <ProjectPartial project={project}/>
                        </Grid.Column>
                      )
                    })}
                </Grid>
              </Grid.Column>
              : ''}
              <Grid.Column width={16} className="not-padded">
                <Grid className="landing-header" style={{ backgroundImage: "url(" + landing_header_background_url + ")" }} verticalAlign="middle">
                  <Grid.Column width={16} className="not-padded">
                    <TerritoriesMap 
                      territories={territories}
                      googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry"
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={<div style={{ height: `100vh` }} />}
                      mapElement={<div style={{ height: `100%` }} />}
                    
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

export default LandingContainer = createContainer(() => {
  const landingConsultsPublication = Meteor.isClient && Meteor.subscribe('consults.landing')
  const landingProjectsPublication = Meteor.isClient && Meteor.subscribe('projects.landing')
  const territoriesPublication = Meteor.isClient && Meteor.subscribe('territories.active')
  const globalConfigurationPublication = Meteor.isClient && Meteor.subscribe('global_configuration')
  const loading = Meteor.isClient && (!landingConsultsPublication.ready() || !territoriesPublication.ready() || !landingProjectsPublication.ready() || !globalConfigurationPublication.ready())
  const consults = Consults.find({landing_display: true}).fetch()
  const projects = Projects.find({landing_display: true}).fetch()
  const territories = Territories.find({active: true}).fetch()
  const global_configuration = Configuration.findOne()
  return {
            loading,
          consults,
    projects,
    territories,
    global_configuration
  }
},Landing)
