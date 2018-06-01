import React, { Component } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Grid, Header, Loader, Button } from 'semantic-ui-react'
import ProjectPartial from '/imports/components/projects/ProjectPartial'
import { Projects } from '/imports/api/projects/projects'
import { Territories } from '/imports/api/territories/territories'
import { Link } from 'react-router-dom'

export class TerritoryProjectsPage extends Component {

    /*
      required props:
        - none
    */

    state = {
        show_ended_consults: false
    }

    toggleState(attr, e) {
        let state = this.state
        state[attr] = !state[attr]
        this.setState(state)
    }

    newProject = () => {
        const {territory} = this.props
        if(!Meteor.userId()){
            Session.set('return_route', "/projects/new/territory/" + territory.shorten_url)
            this.props.history.push('/sign_in')
          }else{
            this.props.history.push("/projects/new/territory/" + territory.shorten_url)
          }
    }

    render() {
        const { projects, territory, loading } = this.props
        const { ended_consults_title, consults_title, consults_no_consults, no_projects, navbar_color, project_term, project_create_button_color, projects_page_header_title, project_create_button_text} = Meteor.isClient && Session.get('global_configuration')

        if (!loading) {
            return (
                <Grid className="wow fadeInUp territory-projects-page" stackable>
                    <Grid.Column width={16} className="territory-consults-header">
                        <Header as="h1" className="wow fadeInUp territory-name" style={{ color: navbar_color, fontSize: "2.5em" }}>{territory.name}</Header>
                        <Header as="h3" className="wow fadeInDown territory-label" data-wow-delay="0.5s">{projects_page_header_title}</Header>
                        <div dangerouslySetInnerHTML={{__html: territory.description }} />
                        <Button onClick={this.newProject} positive={!project_create_button_color} style={{backgroundColor: project_create_button_color}} size="big">{project_create_button_text}</Button>
                    </Grid.Column>
                    {projects.length == 0 && <Header as="h3">{no_projects}</Header>}
                    {projects.map((project, index) => {
                        return (
                            <Grid.Column width={4} key={index} className="center-align wow fadeInUp">
                                <ProjectPartial project={project} />
                            </Grid.Column>
                        )
                    })}
                </Grid>
            )
        } else {
            return <Loader classNaeme="inline-block">Chargement des {project_term}s</Loader>
        }
    }
}

export default TerritoryProjectsPageContainer = createContainer(({ match }) => {
    const { shorten_url } = match.params
    const territoryPublication = Meteor.isClient && Meteor.subscribe('territories.by_shorten_url', shorten_url)
    const territory = Territories.findOne({ shorten_url, active: true })
    if (territory) {
        const projectsPublication = Meteor.isClient && Meteor.subscribe('projects.by_territory', territory._id)
        const loading = Meteor.isClient && (!territoryPublication.ready() || !projectsPublication.ready())
        const projects = Projects.find({ validated: true, blocked: false, territory: territory._id }).fetch()
        return {
            loading,
            projects,
            territory
        }
    } else {
        return { loading: true }
    }
}, TerritoryProjectsPage)
