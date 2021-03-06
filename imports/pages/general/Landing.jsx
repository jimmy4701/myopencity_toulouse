import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { Grid, Header, Container, Loader, Image, Button, Card } from 'semantic-ui-react'
import { withTracker } from 'meteor/react-meteor-data'
import { Consults } from '/imports/api/consults/consults'
import { Projects } from '/imports/api/projects/projects'
import { Configuration } from '/imports/api/configuration/configuration'
import { Territories } from '/imports/api/territories/territories'
import { BudgetConsults } from '/imports/api/budget_consults/budget_consults'
import { Link } from 'react-router-dom'
import TerritoriesMap from '/imports/components/territories/TerritoriesMap'
import ConsultPartial from '/imports/components/consults/ConsultPartial'
import ProjectPartial from '/imports/components/projects/ProjectPartial'
import _ from 'lodash'
import BudgetConsultPartial from '/imports/components/budget_consults/BudgetConsultPartial'
import styled from 'styled-components'

export class Landing extends Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {

    const { consults, geolocated_consults, projects, global_configuration, territories, loading, className, budget_consult } = this.props
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

    const budget_steps_labels = {
      'propositions': "Proposez vos idées",
      'agora': "Voir les idées proposées",
      'analysis': "Voir les idées proposées",
      'votes': "Votez pour vos idées préférées",
      'results': "Voir les résultats"
    }

    if (!loading) {
      return (
        <Grid stackable centered className={className + " landing-page"}>
          <Grid.Column width={16}>
            <Grid className="first-landing-header landing-header" style={{ backgroundImage: "url(" + landing_header_background_url + ")", height: landing_header_height, minHeight: landing_header_min_height }} verticalAlign="middle">
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
            {budget_consult &&
              <BudgetConsultContainer width={16}>
                <BudgetSubTitle>Budget participatif</BudgetSubTitle>
                <BudgetTitle>Participez dès maintenant</BudgetTitle>
                
                <Link to={`/budgets/${budget_consult.url_shorten}`}>
                  <Button size="big">
                    {budget_steps_labels[budget_consult.step]}
                  </Button>
                </Link>
              </BudgetConsultContainer>
            }
            {(consults.length > 0 || budget_consult)?
              <Grid.Column width={16} className="center-align landing-title-container mobile-padding" style={{backgroundColor: landing_consults_background_color}}>
                <Header as="h2">Les {consult_term}s du moment</Header>
                  <ConsultsContainer>
                    <Grid stackable centered>
                      {budget_consult && 
                        <ConsultColumn width={4} textAlign="center">
                           <BudgetConsultPartial budget_consult={budget_consult} />
                        </ConsultColumn>
                      }
                      {consults.map((consult, index) => {
                        return (
                          <ConsultColumn width={4} textAlign="center">
                            <ConsultPartial consult={consult} key={consult._id} />
                          </ConsultColumn>
                        )
                      })}
                    </Grid>
                  </ConsultsContainer>
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
  const budgetConsultPublication = Meteor.isClient && Meteor.subscribe('budget_consults.landing')
  const globalConfigurationPublication = Meteor.isClient && Meteor.subscribe('global_configuration')
  const loading = Meteor.isClient && (!landingConsultsPublication.ready() || !territoriesPublication.ready() || !landingProjectsPublication.ready() || !budgetConsultPublication.ready() || !globalConfigurationPublication.ready())
  const geolocated_consults = Consults.find({coordinates: {$exists: true}, map_display: true}).fetch()
  const consults = Consults.find({landing_display: true}).fetch()
  const projects = Projects.find({landing_display: true}).fetch()
  const territories = Territories.find({active: true}).fetch()
  const budget_consult = BudgetConsults.findOne({landing_display: true, active: true})
  const global_configuration = Configuration.findOne()
  return {
    loading,
    consults,
    projects,
    territories,
    geolocated_consults,
    global_configuration,
    budget_consult
  }
})(styled(Landing)`
  > div .first-landing-header{
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

    @media screen and (max-width: 425px) {
      padding-top: 4em !important;
    }

    > div h1, div h2 {

      @media screen and (max-width: 768px) {
        font-size: 3em !important;
      }
    }
  }
`)

const BudgetConsultContainer = styled(Grid.Column)`
  display: flex !important;
  flex-direction: column;
  align-items: center !important;
  justify-content: center !important;
  min-height: 21em;
  margin-bottom: 10em;
`

const BudgetTitle = styled.h1`
  font-size: 3.5em !important;
  margin-top: 0;
`

const BudgetSubTitle = styled.h1`
  margin-bottom: 0;
`

const ConsultsContainer = styled(Container)`

`

const ConsultColumn = styled(Grid.Column)`
  @media screen and (max-width: 769px) {
    display: flex !important;
    justify-content: center;
  }
`