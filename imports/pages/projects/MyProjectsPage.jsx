import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { withTracker } from 'meteor/react-meteor-data'
import { Grid, Header, Loader, Container, Button } from 'semantic-ui-react'
import { Projects } from '/imports/api/projects/projects'
import ProjectPartial from '/imports/components/projects/ProjectPartial'
import { Link } from 'react-router-dom'

export class MyProjectsPage extends Component {

  /*
    required props:
      - none
  */

  render() {
    const { projects, loading } = this.props
    const {project_term, project_create_button_text, no_projects} = Meteor.isClient && Session.get('global_configuration')

    if (!loading) {
      return (
        <Grid stackable>
          <Grid.Column width={16} className="center-align">
            <Header as="h1" className="wow fadeInUp">Vos {project_term}s</Header>
          </Grid.Column>

          {projects.length ?
            <Grid.Column width={16}>
              <Grid stackable>
                {projects.map((project, index) => {
                  return (
                    <Grid.Column width={5} className="center-align wow fadeInUp">
                      <ProjectPartial project={project} />
                    </Grid.Column>
                  )
                })}
              </Grid>
            </Grid.Column>
            :
            <Grid.Column width={16} className="center-align wow fadeInDown" data-wow-delay="0.3s">
              <Header as='h3'>{no_projects}</Header>
              <Link to="/projects/new">
                <Button content={project_create_button_text} color="blue" />
              </Link>
            </Grid.Column>
          }
        </Grid>
      )
    } else {
      return <Loader className="inline-block">Chargement de vos {project_term}s</Loader>
    }
  }
}

export default MyProjectsPageContainer = withTracker(() => {
  const user_id = Meteor.isClient ? Meteor.userId() : this.userId
  const ProjectsPublication = Meteor.isClient && Meteor.subscribe('projects.me')
  const loading = Meteor.isClient && !ProjectsPublication.ready()
  const projects = Projects.find({ author: user_id }).fetch()
  return {
    loading,
    projects
  }
})(MyProjectsPage)
