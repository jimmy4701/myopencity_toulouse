import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { createContainer } from 'meteor/react-meteor-data'
import {Projects} from '/imports/api/projects/projects'
import {Grid, Header, Loader, Container, Image, Icon, Button} from 'semantic-ui-react'
import {ProjectLikes} from '/imports/api/project_likes/project_likes'
import {Link} from 'react-router-dom'

export class ProjectPage extends TrackerReact(Component){

  /*
    required props:
      - shorten_url: String
  */

  constructor(props){
    super(props);
    this.state = {

    }
  }

  toggle_like(e){
    e.preventDefault()
    Meteor.call('project.toggle_like', this.props.project._id, (error, result) => {
      if(error){
        console.log(error)
        Bert.alert({
          title: "Erreur lors du soutien au projet",
          message: error.reason,
          type: 'danger',
          style: 'growl-bottom-left',
        })
      }
    })
  }

  render(){
    const {project, author, loading, project_like, parent_project} = this.props
    const {
      project_header_height,
      project_header_color,
      project_description_background_color,
      project_description_color,
      project_description_font_size,
      alternative_like_icon_color
    } = Meteor.isClient && Session.get('global_configuration')

    if(!loading){
      return(
        <Grid stackable className="wow fadeInUp">
          <Grid.Column
            width={16}
            className="center-align project-header"
            style={{
              backgroundImage: "url('" + project.image_url + "')",
              height: project_header_height
            }}>
            <Grid verticalAlign="middle" className="project-header-inner-grid">
              <Grid.Column width={16} className="center-align">
                <Header className="wow fadeInUp" data-wow-delay="1s" as="h1" style={{color: project_header_color}}>{project.title}</Header>
              </Grid.Column>
            </Grid>
          </Grid.Column>
          {project.description ?
            <Grid.Column width={16} style={{fontSize: project_description_font_size, backgroundColor: project_description_background_color, color: project_description_color}} className="project-description-container center-align not-marged">
              <Container>
                <p>{project.description}</p>
              </Container>
            </Grid.Column>
            : ''}
            <Grid.Column width={16} className="center-align project-author-container">
              {project.anonymous ?
                <p>Ce projet est proposé par <Icon name="spy" size="big"/> un citoyen anonyme</p>
                :
                <p>Ce projet est proposé par <Link to={"/profile/" + author._id} style={{cursor: "pointer"}}><Image src={author.profile.avatar_url} avatar /> {author.username}</Link></p>
              }
            </Grid.Column>
            {parent_project ?
              <Grid.Column width={16} className="center-align project-author-container">
                <p><Icon name="sitemap"/> Ce projet est alternatif au projet <Link to={"/projects/" + parent_project.shorten_url} style={{cursor: 'pointer'}}>"{parent_project.title}"</Link></p>
              </Grid.Column>
            : ''}
            <Grid.Column width={16} className="center-align">
              <Button size="big" onClick={(e) => {this.toggle_like(e)}} icon={<Icon name="thumbs up" style={{color: project_like ? alternative_like_icon_color : null }} />} content={project.likes + ' soutiens'} />
              <Link to={"/projects/new/" + project._id}>
                <Button size="big" icon={<Icon name="sitemap"/>} content="Créer un projet alternatif" />
              </Link>
            </Grid.Column>
              <Grid.Column width={16} className="project-content-container marged">
                <Container>
                  <div dangerouslySetInnerHTML={{__html: project.content }} style={{fontFamily: 'Roboto'}} className="project-content"></div>
                </Container>
              </Grid.Column>
          </Grid>
        )
    }else{
      return <Loader className="inline-block">Chargement du projet</Loader>
    }
  }
}

export default ProjectPageContainer = createContainer(({ match }) => {
  const {shorten_url} = match.params
  const user_id = Meteor.isClient ? Meteor.userId() : this.userId
  const ProjectsPublication = Meteor.isClient && Meteor.subscribe('project', shorten_url)
  const project = Projects.findOne({shorten_url: shorten_url})
  let ProjectLikesPublication = Meteor.isClient && Meteor.subscribe('project_likes.by_project', null)
  let project_like = null
  let parent_project = null
  if(project){
    ProjectLikesPublication = Meteor.isClient && Meteor.subscribe('project_likes.by_project', project._id)
    ParentProjectPublication = Meteor.isClient && Meteor.subscribe('project.by_id', project.parent)
    project_like = ProjectLikes.findOne({user: user_id, project: project._id })
    parent_project = Projects.findOne({_id: project.parent})
    const AuthorPublication = Meteor.isClient && Meteor.subscribe('project.author', project.author)
    const loading = Meteor.isClient && (!ProjectsPublication.ready() || !AuthorPublication.ready() || !ProjectLikesPublication.ready())
    const author = Meteor.users.findOne({_id: project.author})
    return {
      loading,
      project,
      author,
      project_like,
      parent_project
    }
  }else{
    return {
      loading: true
    }
  }
}, ProjectPage)
