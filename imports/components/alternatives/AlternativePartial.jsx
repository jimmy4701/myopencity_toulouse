import React, {Component} from 'react'
import {Icon, Image, Segment, Grid, Button, Dropdown} from 'semantic-ui-react'
import { withTracker } from 'meteor/react-meteor-data'
import moment from 'moment'
import {Link, withRouter} from 'react-router-dom'
import 'moment/locale/fr'
import Truncate from 'react-truncate-html'

export class AlternativePartial extends Component{

  /*
    required props:
      - alternative: Object

    facultative props:
      - onTitleClick: Function
  */

  state = {
    actived_alternative: false,
    consult: null,
    removing: false
  }

  toggleState = (e) => this.setState({[e.target.name]: !this.state[e.target.name]})

  componentDidMount(){
    if(this.props.display_consult){
      Meteor.call('consults.get_by_id', this.props.alternative.consult , (error, result) => {
        if(error){
          console.log('Erreur', error.message)
        }else{
          this.setState({consult: result})
        }
      })
    }
  }

  toggle_like = (e) => {
    e.preventDefault()
    if(!Meteor.userId()){
      Session.set('return_route', this.props.history.location.pathname)
      this.props.history.push('/sign_in')
    }else{
      Meteor.call('alternatives.toggle_like', this.props.alternative._id , (error, result) => {
        if(error){
          console.log(error)
          Bert.alert({
            title: "Erreur lors de l'ajout de votre soutien",
            message: error.reason,
            type: 'danger',
            style: 'growl-bottom-left',
          })
        }
      });
    }
  }


  toggle_validated = (e) => {
    Meteor.call('alternatives.toggle_validity', this.props.alternative._id, (error, result) => {
      if(error){
        console.log(error)
        Bert.alert({
          title: "Erreur lors de la modification de validité de l'alternative",
          message: error.reason,
          type: 'danger',
          style: 'growl-bottom-left',
        })
      }else{
        Bert.alert({
          title: "Validité de l'alternative modifiée",
          type: 'success',
          style: 'growl-bottom-left',
        })
      }
    });
  }

  onTitleClick(e){
    e.preventDefault()
    this.props.onTitleClick(this.props.alternative)
  }

  toggle_verified = (e) => {
    Meteor.call('alternatives.toggle_verified', this.props.alternative._id, (error, result) => {
      if(error){
        console.log('Erreur', error.message)
      }else{
        Bert.alert({
          title: 'Déclaré comme vérifié',
          style: 'growl-bottom-left',
          type: 'success'
        })
      }
    })
  }

  signal = () => {
    Meteor.call('alternatives_alerts.insert', this.props.alternative._id, (error, result) => {
      if(error){
        console.log('Erreur', error.message)
        Bert.alert({
              title: 'Erreur lors du signalement',
              message: error.message,
              style: 'growl-bottom-left',
              type: 'danger'
            })
      }else{
        Bert.alert({
              title: "Votre signalement a bien été pris en compte",
              message: "Nous le traiterons dans les plus brefs délais",
              style: 'growl-bottom-left',
              type: 'success'
            })
      }
    })
  }

  remove = () => {
    Meteor.call('alternatives.remove', this.props.alternative._id, (error, result) => {
      if(error){
        console.log('Erreur', error.message)
      }else{
        Bert.alert({
          title: 'Alternative supprimée',
          style: 'growl-bottom-left',
          type: 'success'
        })
      }
    })
  }


  render(){
    const {user, loading, alternative, display_consult, removable} = this.props
    const {actived_alternative, consult, removing, open_dropdown} = this.state 
    moment.locale('fr')
    const {alternative_descriptive_term, alternatives_anonymous_profile_term} = Meteor.isClient && Session.get('global_configuration')

    if(!loading){
      console.log("user", user);
      return(
        <Grid.Column width={actived_alternative ? 16 :8} className="wow fadeInUp">
          <Segment>
          <div onClick={this.toggleState} name="open_dropdown" className="alternative-partial-dropdown">
            <Dropdown open={open_dropdown}>
              <Dropdown.Menu className="alternative-partial-menu">
                <Dropdown.Item text='Signaler' onClick={this.signal} />
              </Dropdown.Menu>
            </Dropdown>
          </div>
            <Grid stackable>
              <Grid.Column width={16} style={{paddingBottom: "0"}}>
                <span className="alternative-partial-title">{alternative.title}<br/></span>
                {!alternative.anonymous ?
                  <Image avatar src={user.profile.avatar_url} />
                : ''}
                {alternative.anonymous ?
                  <span>{alternatives_anonymous_profile_term} </span>
                :
                <Link to={"/profile/" + user._id}>
                  <span>{user.username} </span>
                </Link>}
                <span style={{paddingTop: "0", color: "#b7b7b7"}} className="alternative-partial-date">le {moment(alternative.created_at).format('DD.MM.YYYY à HH:mm')}</span>
              </Grid.Column>
              {display_consult && 
                <Grid.Column width={16}>
                  <Link to={"/consults/" + consult.urlShorten}>{consult.title}</Link>
                </Grid.Column>
              }
              <Grid.Column width={16}>
              {actived_alternative ? 
                <div dangerouslySetInnerHTML={{__html: alternative.content }} />
              :
              <Truncate
                lines={3}
                dangerouslySetInnerHTML={{
                __html: alternative.content
                }}
              />
              }
              </Grid.Column>
              <Grid.Column width={16}>
              {alternative.content.length > 300 &&
                <Button onClick={this.toggleState} name="actived_alternative" icon="eye" size="tiny">{actived_alternative ? "Cacher le contenu" : "Voir tout"}</Button>
              }
                <Button onClick={this.toggle_like} icon="thumbs up" size="tiny">
                  <Icon name="thumbs up"/>
                  {alternative.likes}
                </Button>
                {Meteor.isClient && Roles.userIsInRole(Meteor.userId(), ['admin', 'moderator']) &&
                  [
                    <Button onClick={(e) => {this.toggle_validated(e)}}>{alternative.validated ? "Invalider " : "Valider "} {alternative_descriptive_term}</Button>
                  ]
                }
                {removing &&
                  <Button onClick={this.remove} color="red">Supprimer définitivement</Button>
                }
                {Meteor.isClient && Roles.userIsInRole(Meteor.userId(), ['admin', 'moderator']) && removable &&
                  <Button color={!removing && "red"} onClick={this.toggleState} name="removing">{removing ? "Annuler" : "Supprimer"}</Button>
                }
                {Meteor.isClient && Roles.userIsInRole(Meteor.userId(), ['admin', 'moderator']) && !alternative.verified &&
                  <Button onClick={(e) => {this.toggle_verified(e)}}>Déclarer comme vérifié</Button>
                }
              </Grid.Column>
            </Grid>
          </Segment>
        </Grid.Column>
      )
    }else{
      return(
        <Segment loading></Segment>
      )
    }
  }
}

export default AlternativePartialContainer = withTracker(({ alternative }) => {
  const userPublication = Meteor.subscribe('alternatives.user', alternative._id)
  const loading = !userPublication.ready()
  const user = Meteor.users.findOne({_id: alternative.user})
  return {
    loading,
    user,
    alternative
  }
})(withRouter(AlternativePartial))
