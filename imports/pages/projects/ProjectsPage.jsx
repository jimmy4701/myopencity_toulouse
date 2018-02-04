import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { createContainer } from 'meteor/react-meteor-data'
import {Grid, Header, Button, Loader} from 'semantic-ui-react'
import {Projects} from '/imports/api/projects/projects'
import ProjectPartial from '/imports/components/projects/ProjectPartial'
import {Link} from 'react-router-dom'

export class ProjectsPage extends TrackerReact(Component){

  /*
    required props:
      - none
  */

  constructor(props){
    super(props);
    this.state = {

    }
  }

  render(){
    const {loading, projects} = this.props
    const {projects_page_header_title, navbar_color} = Meteor.isClient && Session.get('global_configuration')

    if(!loading){
      return(
        <Grid stackable>
        <Grid.Column width={16} className="territory-projects-header">
            <Header as="h1" className="wow fadeInUp territory-name" style={{ color: navbar_color }}>{projects_page_header_title}</Header>
            <Link to="/projects/new">
              <Button positive size="big">Proposer un projet</Button>
            </Link>
          </Grid.Column>
          {projects.map((project, index) => {
            return(
              <Grid.Column width={4} key={index} className="center-align wow fadeInUp">
                <ProjectPartial project={project} />
              </Grid.Column>
            )
          })}
        </Grid>
      )
    }else{
      return <Loader className="inline-block">Chargement des propositions</Loader>
    }
  }
}

export default ProjectsPageContainer = createContainer(() => {
  const projectsPublication = Meteor.isClient && Meteor.subscribe('projects.visible')
  const territoriesPublication = Meteor.isClient && Meteor.subscribe('territories.active')
  const loading = Meteor.isClient && (!projectsPublication.ready() || !territoriesPublication.ready())
  const projects = Projects.find({visible: true, validated: true}, {sort: {likes: -1}}).fetch()
  return {
    loading,
    projects
  }
}, ProjectsPage)
