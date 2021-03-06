import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { createContainer } from 'meteor/react-meteor-data'
import {Grid, Header, Loader, Container, Card, Button, Icon} from 'semantic-ui-react'
import {Consults} from '/imports/api/consults/consults'
import {Territories} from '/imports/api/territories/territories'
import {ConsultParts} from '/imports/api/consult_parts/consult_parts'
import ConsultPart from '/imports/components/consult_parts/ConsultPart'
import { Link } from 'react-router-dom'
import {Helmet} from 'react-helmet'
import styled from 'styled-components'


export class ConsultPage extends TrackerReact(Component){

  /*
    required props:
      - consult
  */

  state = {
    show_files: false,
    allowed: true
  }

  componentDidMount(){
    Meteor.isClient && window.scrollTo({top: 0, behavior: "smooth"})
    Meteor.call('consults.allowed_to_see', this.props.match.params.urlShorten, (error, result) => {
      if(error){
        console.log('Erreur', error.message)
      }else{
        this.setState({allowed: result})
      }
    })
  }

  toggleState(attr, e){
    let state = this.state
    state[attr] = !state[attr]
    this.setState(state)
  }

  

  render(){
    const {consult, consult_parts, territories, loading} = this.props
    const {show_files, allowed} = this.state
    const {
      consult_header_height,
      consult_header_color,
      consult_description_background_color,
      consult_description_color,
      consult_description_font_size,
      consult_territory_prefix, 
      consult_territory_icon,
      buttons_validation_text_color,
      buttons_validation_background_color,
      consult_term
    } = Meteor.isClient && Session.get('global_configuration')

    if(!allowed){
      return(
        <NotAllowedContainer>
          <Icon name="minus circle" size="big" />
          <h4>Vous n'êtes pas autorisé(e) à accéder à ce contenu</h4>
          <p>Merci de vous connecter pour accéder à cette consultation</p>
        </NotAllowedContainer>
      )
    }else{
        if(!loading){
          return(
            <Grid stackable className="wow fadeInUp">
              <Helmet>
                <meta property="og:title" content={consult.title} />
                <meta property="og:type" content="article" />
                <meta property="og:description" content={consult.description} />
                <meta name="description" content={consult.description} />
                <meta property="og:image" content={consult.image_url} />
                <meta property="og:url" content={"https://jeparticipe.toulouse.fr" + this.props.location.pathname} />
              </Helmet>
              <Grid.Column
                width={16}
                className="center-align consult-header"
                style={{
                  backgroundImage: "url('" + consult.image_url + "')",
                  height: consult_header_height
                }}>
                <Grid verticalAlign="middle" className="consult-header-inner-grid">
                  <Grid.Column width={16} className="center-align">
                    <Header className="wow fadeInUp" data-wow-delay="1s" as="h1" style={{color: consult_header_color}}>{consult.title}</Header>
                    {consult.external_site_name ?
                      <Header as="h3" className="wow fadeInDown" data-wow-delay="1.25s" style={{color: consult_header_color, margin: "0"}}>{_.capitalize(consult_term)} provenant de <a href={consult.external_url} target="_blank">{consult.external_site_name}</a></Header>
                    : ''}
                  </Grid.Column>
                </Grid>
              </Grid.Column>
              {consult.description ?
                <Grid.Column width={16} style={{fontSize: consult_description_font_size, backgroundColor: consult_description_background_color, color: consult_description_color, marginBottom: consult.attached_files.length > 0 ? '0' : 'initial'}} className="consult-description-container center-align mobile-padding">
                  <Container>
                    <p>{consult.description}</p>
                  </Container>
                </Grid.Column>
              : ''}
              {consult.attached_files.length > 0 ?
                <Grid.Column width={16} className="center-align mobile-padding" style={{fontSize: consult_description_font_size, backgroundColor: consult_description_background_color, color: consult_description_color}}>
                  <Container>
                    {!show_files ?
                      <span>
                        <Header as="h4">Des documents sont disponibles avec cette {consult_term} <Button style={{backgroundColor: buttons_validation_background_color, color: buttons_validation_text_color}} onClick={(e) => {this.toggleState('show_files', e)}}>Voir les documents</Button></Header>
                      </span>
                      :
                      <Grid stackable>
                        <Grid.Column width={16} className="center-align">
                          <Button onClick={(e) => {this.toggleState('show_files', e)}}>Masquer les documents</Button>
                        </Grid.Column>
                        <Grid.Column width={16}>
                          <Card.Group>
                            {consult.attached_files.map((attached_file, index) => {
                              return (
                                <Card className="animated fadeIn">
                                  <Card.Content>
                                    <Card.Header><Icon name="file" />{attached_file.title}</Card.Header>
                                    <Card.Description><Button icon="download" content="Télécharger" size="mini" target="_blank" href={attached_file.url}/></Card.Description>
                                  </Card.Content>
                                </Card>
                              )
                            })}
                          </Card.Group>
                        </Grid.Column>
                      </Grid>
                    }
                  </Container>
                </Grid.Column>
              : ''}
              {!consult.hide_territories && territories.length > 0 ?
                <Grid.Column width={16} className="consult-territory-container center-align wow fadeInDown mobile-padding" data-wow-delay="0.5s">
                  <Container>
                  <p>
                    {consult_territory_prefix}
                    {territories.map(territory => {
                      return <Link to={"/territory/" + territory.shorten_url + "/consults"} key={territory._id}>
                        <Icon name={consult_territory_icon} size="big" />  {territory.name}
                      </Link>
                    })}
                  </p>
                    
                  </Container>
                </Grid.Column>
              : ''}
              
              <Grid.Column width={16} className="parts-container mobile-padding">
                <Container>
                    <div className="social-share" style={{marginBottom: "2em"}}>
                      <p style={{marginBottom: 0}}><strong>Partagez sur les réseaux sociaux</strong></p>
                      {Meteor.isClient && [
                        <Link to={"https://www.facebook.com/sharer/sharer.php?u=" + window.location.href } target="_blank">
                          <Button icon="facebook" color="blue" size="tiny" content="Facebook"/>
                        </Link>,
                        <Link to={"https://twitter.com/home?status=" + encodeURIComponent("#jeparticipe @toulouse " +  consult.title + " " +  window.location.href) } target="_blank">
                          <Button icon="twitter" color="blue" size="tiny" content="Twitter"/>
                        </Link>
                      ]}
                    </div>
                  {consult_parts.map((part, index) => {
                    return <ConsultPart consult_votable={consult.votable} consult_part={part} results_configuration={consult.display_votes_configuration} consult_ended={consult.ended} />
                  })}
                </Container>
              </Grid.Column>
            </Grid>
          )
        }else{
          return <Loader className="inline-block">Chargement de la {consult_term}</Loader>
        }
    }

  }
}

export default ConsultPageContainer = createContainer(({ match }) => {
  const {urlShorten} = match.params
  const consultPublication = Meteor.isClient && Meteor.subscribe('consult', urlShorten)
  let consult = null
  if(Roles.userIsInRole(Meteor.isClient ? Meteor.userId() : this.userId, ['admin', 'moderator'])){
    consult = Consults.findOne({url_shorten: urlShorten})
  }else{
    consult = Consults.findOne({url_shorten: urlShorten, visible: true})
  }
  if(consult){
    const consultPartsPublication = Meteor.isClient && Meteor.subscribe('consult_parts.by_consult_url_shorten', urlShorten)
    const territoriesPublication = Meteor.isClient && Meteor.subscribe('territories.by_ids', consult.territories)
    const loading = Meteor.isClient && (!territoriesPublication.ready() || !consultPublication.ready() || !consultPartsPublication.ready())
    const territories = Territories.find({_id: {$in: consult.territories}}).fetch()
    const consult_parts = ConsultParts.find({consult_url_shorten: urlShorten, active: true}, {sort: {priority: 1}}).fetch()
    return {
      loading,
      consult,
      consult_parts,
      territories
    }

  }else{
    return {loading: true}
  }
}, ConsultPage)


const NotAllowedContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  min-height: 95vh;
  align-items: center;
  justify-content: center;
`