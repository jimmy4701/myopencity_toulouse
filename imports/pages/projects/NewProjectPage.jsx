import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { createContainer } from 'meteor/react-meteor-data'
import {Grid, Header, Container, Message, Button, Input, Breadcrumb, Icon, Form, Loader} from 'semantic-ui-react'
import TinyMCE from 'react-tinymce'
import ProjectForm from '/imports/components/projects/ProjectForm'
import ProjectPartial from '/imports/components/projects/ProjectPartial'
import {Projects} from '/imports/api/projects/projects'
import {Territories} from '/imports/api/territories/territories'
import {withRouter} from 'react-router-dom'

export class NewProjectPage extends TrackerReact(Component){

  /*
    required props:
      - none
    facultative props:
      - parent_id: String (id of parent project)
  */

  state = {
    step: "presentation", // presentation / anonymous / title / content / description / image
    new_project: {
      anonymous: Meteor.isClient && Session.get('global_configuration').projects_anonymous_default
    }
  }

  submit_form(e){
    e.preventDefault()
    const {new_project} = this.state
    if(this.props.parent_id){
      new_project.parent = this.props.parent_id
    }
    if(this.props.territory){
      new_project.territory = this.props.territory._id
    }
    Meteor.call('projects.insert', new_project, (error, result) => {
      if(error){
        console.log(error)
        Bert.alert({
          title: "Erreur lors de la création de votre projet",
          message: error.reason,
          type: 'danger',
          style: 'growl-bottom-left',
        })
      }else{
        const {project_validation_enabled} = Meteor.isClient && Session.get('global_configuration')
        const validation_message = project_validation_enabled ? "Votre projet sera visible dès qu'il aura été validé" : ''
        Bert.alert({
          title: "Votre projet a bien été créé",
          icon: 'thumbs up',
          message: validation_message,
          type: 'success',
          style: 'growl-bottom-left',
        })
        if(this.props.territory){
          this.props.history.push('/territory/' + this.props.territory.shorten_url + "/projects")
        }else{
          this.props.history.push('/projects')
        }
      }
    })
  }

  changeStep(step, e){
    e.preventDefault()
    this.setState({step})
  }

  handleProjectChange(attr, e){
    let {new_project} = this.state
    new_project[attr] = e.target.value
    this.setState({new_project})
  }

  toggleProject(attr, e){
    let {new_project} = this.state
    new_project[attr] = !new_project[attr]
    this.setState({new_project})
  }

  handleContentChange(e){
    let {new_project} = this.state
    new_project.content = e.target.getContent()
    this.setState({new_project})
  }

  copyParentContent(e){
    let {new_project} = this.state
    new_project.content = this.props.parent_project.content
    this.setState({new_project})
    tinymce.EditorManager.get("tinyMCEEditor").setContent(new_project.content)
  }

  render(){
    const {step, new_project} = this.state
    const {loading, parent_project, territory} = this.props
    const {projects_anonymous_choice, project_descriptive_term, project_term, buttons_validation_background_color, buttons_validation_text_color} = Meteor.isClient && Session.get('global_configuration')

    if(!loading){
      return(
        <Grid stackable>
          {step != 'presentation' ?
            <Grid.Column width={16} className="center-align animated fadeInDown">
              <Breadcrumb size="big">
                <Breadcrumb.Section link active={step == 'title'} onClick={(e) => {this.changeStep('title', e)}}>Titre</Breadcrumb.Section>
                <Breadcrumb.Divider icon='right angle' />
                <Breadcrumb.Section link active={step == 'description'} onClick={(e) => {this.changeStep('description', e)}}>Description</Breadcrumb.Section>
                <Breadcrumb.Divider icon='right angle' />
                <Breadcrumb.Section link active={step == 'content'} onClick={(e) => {this.changeStep('content', e)}}>Contenu</Breadcrumb.Section>
                <Breadcrumb.Divider icon='right angle' />
                <Breadcrumb.Section link active={step == 'image'} onClick={(e) => {this.changeStep('image', e)}}>Image du projet</Breadcrumb.Section>
                  {projects_anonymous_choice ?
                    <span>
                      <Breadcrumb.Divider icon='right angle' />
                      <Breadcrumb.Section link active={step == 'anonymous'} onClick={(e) => {this.changeStep('anonymous', e)}}>Anonymat</Breadcrumb.Section>
                    </span>
                  : ''}
                <Breadcrumb.Divider icon='right angle' />
                <Breadcrumb.Section link active={step == 'validation'} onClick={(e) => {this.changeStep('validation', e)}}>Validation</Breadcrumb.Section>
              </Breadcrumb>
            </Grid.Column>
            : ''}

            {step == 'presentation' ?
              <Grid.Column width={16} className="center-align new-project-presentation-container">
                <Grid stackable verticalAlign="middle" style={{height: 'inherit'}}>
                  <Grid.Column width={16} className="">
                    <Container>
                      <Header as="h1" className="wow fadeInUp">Vous êtes sur le point de proposer {project_descriptive_term}</Header>
                      {territory && <Header as="h3" className="wow fadeInDown territory-title">Pour le quartier {territory.name}</Header>}
                      {parent_project ?
                        <p><Icon name="sitemap" /> alternatif au projet "{parent_project.title}"</p>
                        : ''}
                        <Header as="h3" className="wow fadeInUp" data-wow-delay="1s">Voici quelques petits conseils</Header>
                        <Message
                          icon='unhide'
                          compact
                          header={'Donnez un titre expressif à votre ' + project_term}
                          content={"Plus votre titre collera au contenu de votre " + project_term + ", mieux les gens sauront dès le premier coup d'oeil si votre " + project_term + " les intéresse"}
                          className="wow fadeInUp"
                          data-wow-delay="2s"
                          />
                        <Message
                          icon='align justify'
                          compact
                          header='Donnez un max de détails'
                          content={"Être bien compris, c'est être plus facilement apprécié. Mais ne soyez pas non plus trop verbeux pour ne pas perdre les gens."}
                          className="wow fadeInUp"
                          data-wow-delay="2.5s"
                          />
                        <Message
                          icon='facebook'
                          compact
                          header='Parlez-en autour de vous !'
                          content={"Une bonne idée qui n'est pas partagée et débattue ne sert à rien. Parlez-en ! Et partagez votre" + project_term + " sur les réseaux sociaux !"}
                          className="wow fadeInUp"
                          data-wow-delay="3s"
                          />
                        <div className="wow fadeInUp" data-wow-delay="3.5s">
                          <Button style={{backgroundColor: buttons_validation_background_color, color: buttons_validation_text_color}} onClick={(e) => {this.changeStep('title', e)}}>Commencer</Button>
                        </div>
                      </Container>
                    </Grid.Column>
                  </Grid>
                </Grid.Column>
                : ''}
                {step == 'title' ?
                  <Grid.Column width={16} className="center-align new-project-presentation-container">
                    <Grid stackable verticalAlign="middle" style={{height: 'inherit'}}>
                      <Grid.Column width={16} className="">
                        <Container>
                          <Header as="h1" className="wow fadeInUp">Premièrement, donnez un titre à votre {project_term}</Header>
                          <Input
                            fluid
                            autoFocus
                            size="huge"
                            placeholder="ex: Refaire la place du centre-ville"
                            onBlur={(e) => {this.handleProjectChange('title', e)}}
                            defaultValue={new_project.title}
                            className="marged"
                            />
                          <Button style={{backgroundColor: buttons_validation_background_color, color: buttons_validation_text_color}} onClick={(e) => {this.changeStep('description', e)}}>Passer à la description</Button>
                        </Container>
                      </Grid.Column>
                    </Grid>
                  </Grid.Column>
                  : ''}
                  {step == 'description' ?
                    <Grid.Column width={16} className="center-align new-project-presentation-container">
                      <Grid stackable verticalAlign="middle" style={{height: 'inherit'}}>
                        <Grid.Column width={16} className="">
                          <Container>
                            <Header as="h1" className="wow fadeInUp">Rédigez une brève description de votre {project_term} (comme un tweet <Icon name="twitter" />)</Header>
                            <Input
                              fluid
                              size="huge"
                              autoFocus
                              placeholder="ex: Proposition d'aménagements culturels et sportifs pour le nouveau quartier qui sera construit dans le centre en 2020"
                              onBlur={(e) => {this.handleProjectChange('description', e)}}
                              defaultValue={new_project.description}
                              className="marged"
                              />
                            <Button size="tiny" onClick={(e) => {this.changeStep('title', e)}}>Précédent</Button>
                            <Button style={{backgroundColor: buttons_validation_background_color, color: buttons_validation_text_color}} onClick={(e) => {this.changeStep('content', e)}}>Passer au contenu</Button>
                          </Container>
                        </Grid.Column>
                      </Grid>
                    </Grid.Column>
                    : ''}
                    {step == 'content' ?
                      <Grid.Column width={16} className="center-align new-project-presentation-container">
                        <Grid stackable style={{height: 'inherit'}}>
                          <Grid.Column width={16} className="">
                            <Container>
                              <Header as="h1" className="wow fadeInUp">Expliquez maintenant en détails votre {project_term}</Header>
                              {parent_project ?
                                <Button onClick={(e) => {this.copyParentContent(e)}}>Copier le contenu initial</Button>
                              : ''}
                              <TinyMCE
                                id="tinyMCEEditor"
                                content={new_project.content}
                                autoFocus
                                config={{
                                  plugins: 'image autoresize media link imagetools',
                                  toolbar: "undo redo | bold italic | alignleft aligncenter alignright | formatselect | link | image ",
                                  menubar: false,
                                  branding: false,
                                  statusbar: false
                                }}
                                onChange={this.handleContentChange.bind(this)}
                                />
                              <Button size="tiny" onClick={(e) => {this.changeStep('content', e)}}>Précédent</Button>
                              <Button style={{backgroundColor: buttons_validation_background_color, color: buttons_validation_text_color}} onClick={(e) => {this.changeStep('image', e)}}>Passer à l'image</Button>
                            </Container>
                          </Grid.Column>
                        </Grid>
                      </Grid.Column>
                      : ''}
                      {step == 'image' ?
                        <Grid.Column width={16} className="center-align new-project-presentation-container">
                          <Grid stackable style={{height: 'inherit'}}>
                            <Grid.Column width={16} className="">
                              <Container>
                                <Header as="h1" className="wow fadeInUp">Ajoutez une image d'illustration à votre {project_term}</Header>
                                <p>Entrez l'URL d'une image pour illustrer votre projet et le rendre unique et visible</p>
                                <Input
                                  fluid
                                  autoFocus
                                  size="huge"
                                  placeholder="http://"
                                  onChange={(e) => {this.handleProjectChange('image_url', e)}}
                                  defaultValue={new_project.image_url}
                                  className="marged"
                                  />
                                <Button size="tiny" onClick={(e) => {this.changeStep('content', e)}}>Précédent</Button>
                                  {projects_anonymous_choice ?
                                    <Button style={{backgroundColor: buttons_validation_background_color, color: buttons_validation_text_color}} onClick={(e) => {this.changeStep('anonymous', e)}}>Passer à l'anonymat</Button>
                                  :
                                    <Button style={{backgroundColor: buttons_validation_background_color, color: buttons_validation_text_color}} onClick={(e) => {this.changeStep('validation', e)}}>Passer à la validation</Button>
                                  }
                              </Container>
                            </Grid.Column>
                            <Grid.Column width={16} className="center-align">
                              <p>Voilà à quoi ressemble votre {project_term} actuellement</p>
                              <ProjectPartial project={new_project} />
                            </Grid.Column>
                          </Grid>
                        </Grid.Column>
                        : ''}
                        {step == 'anonymous' ?
                          <Grid.Column width={16} className="center-align new-project-presentation-container">
                            <Grid stackable style={{height: 'inherit'}}>
                              <Grid.Column width={16} className="">
                                <Container>
                                  <Header as="h1" className="wow fadeInUp">Choisissez si votre {project_term} est anonyme ou non</Header>
                                  <p>En laissant anonyme, les autres utilisateurs ne pourront pas vous contacter</p>
                                  <Grid stackable className="marged">
                                    <Grid.Column width={16} className="center-align">
                                      <Button active={new_project.anonymous} size="huge"  onClick={(e) => {this.toggleProject('anonymous',e)}}>
                                        <Icon name="spy" size="big"/>
                                        Anonyme
                                      </Button>
                                      <Button active={!new_project.anonymous} size="huge"  onClick={(e) => {this.toggleProject('anonymous',e)}}>
                                        <Icon name="user" size="big"/>
                                        Publique
                                      </Button>
                                      {new_project.anonymous ?
                                        <p><strong>Votre {project_term} est actuellement anonyme</strong> : votre profil ne sera pas affiché</p>
                                        :
                                        <p><strong>Votre {project_term} est actuellement publique</strong> : vos lecteurs pourront consulter votre profil</p>
                                      }
                                    </Grid.Column>
                                  </Grid>
                                  <Button size="tiny" onClick={(e) => {this.changeStep('image', e)}}>Précédent</Button>
                                  <Button style={{backgroundColor: buttons_validation_background_color, color: buttons_validation_text_color}} onClick={(e) => {this.changeStep('validation', e)}}>Passer à la validation</Button>
                                </Container>
                              </Grid.Column>
                            </Grid>
                          </Grid.Column>
                          : ''}
                          {step == 'validation' ?
                            <Grid.Column width={16} className="center-align new-project-presentation-container">
                              <Grid stackable style={{height: 'inherit'}}>
                                <Grid.Column width={16} className="">
                                  <Container>
                                    <Header as="h1" className="wow fadeInUp">Lancez la validation de votre projet</Header>
                                    <Button size="tiny" onClick={(e) => {this.changeStep('anonymous', e)}}>Précédent</Button>
                                    <Button style={{backgroundColor: buttons_validation_background_color, color: buttons_validation_text_color}} onClick={(e) => {this.submit_form(e)}}>Créer le projet</Button>
                                  </Container>
                                </Grid.Column>
                              </Grid>
                            </Grid.Column>
                            : ''}
                          </Grid>
                        )
    }else{
      return <Loader className="inline-block">Chargement du formulaire de projet</Loader>
    }
  }
}

export default NewProjectPageContainer = createContainer(({match}) => {
  const {parent_id, shorten_url} = match.params
  const territoryPublication = Meteor.isClient && Meteor.subscribe('territories.by_shorten_url', shorten_url)
  const parentProjectPublication = Meteor.isClient && Meteor.subscribe('project.by_id', parent_id)
  const loading = Meteor.isClient && (!parentProjectPublication.ready() || !territoryPublication.ready())
  const parent_project = Projects.findOne({_id: parent_id, validated: true})
  const territory = Territories.findOne({shorten_url, active: true})

  return {
    loading,
    territory,
    parent_project
  }
}, withRouter(NewProjectPage))
