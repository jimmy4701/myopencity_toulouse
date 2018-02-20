import React, {Component} from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import {Grid, Header, Button, Loader} from 'semantic-ui-react'
import {Projects} from '/imports/api/projects/projects'
import ProjectPartial from '/imports/components/projects/ProjectPartial'
import {withRouter} from 'react-router-dom'

export class ProjectsPage extends Component{

  /*
    required props:
      - none
  */

  constructor(props){
    super(props);
    this.state = {

    }
  }

  new_project = () => {
    if(!Meteor.userId()){
      Session.set('return_route', "/projects/new")
      this.props.history.push('/sign_up')
    }else{
      this.props.history.push('/projects/new')
    }
  }

  render(){
    const {loading, projects} = this.props
    const {projects_page_header_title, navbar_color, project_create_button_color, project_term, project_create_button_text} = Meteor.isClient && Session.get('global_configuration')

    if(!loading){
      return(
        <Grid stackable>
        <Grid.Column width={16} className="territory-projects-header">
            <Header as="h1" className="wow fadeInUp territory-name" style={{ color: navbar_color }}>{projects_page_header_title}</Header>
            <Button positive={!project_create_button_color} style={{backgroundColor: project_create_button_color}} size="big" onClick={this.new_project}>{project_create_button_text}</Button>
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
      return <Loader className="inline-block">Chargement des {project_term}s</Loader>
    }
  }
}

export default ProjectsPageContainer = withTracker(() => {
  const projectsPublication = Meteor.isClient && Meteor.subscribe('projects.visible')
  const territoriesPublication = Meteor.isClient && Meteor.subscribe('territories.active')
  const loading = Meteor.isClient && (!projectsPublication.ready() || !territoriesPublication.ready())
  const projects = Projects.find({visible: true, validated: true}, {sort: {likes: -1}}).fetch()
  return {
    loading,
    projects
  }
})(withRouter(ProjectsPage))
