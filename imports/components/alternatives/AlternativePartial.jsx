import React, {Component} from 'react'
import {Icon, Image, Segment, Grid, Button} from 'semantic-ui-react'
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
    actived_alternative: false
  }

  toggleState = (e) => this.setState({[e.target.name]: !this.state[e.target.name]})

  toggle_like = (e) => {
    e.preventDefault()
    if(!Meteor.userId()){
      Session.set('return_route', this.props.history.location.pathname)
      this.props.history.push('/sign_up')
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


  render(){
    const {user, loading, alternative} = this.props
    const {actived_alternative} = this.state 
    moment.locale('fr')
    const {alternative_descriptive_term, alternatives_anonymous_profile_term} = Meteor.isClient && Session.get('global_configuration')

    if(!loading){
      console.log("user", user);
      return(
        <Grid.Column width={actived_alternative ? 16 :8} className="wow fadeInUp">
          <Segment>
            <Grid stackable>
              <Grid.Column width={16} style={{paddingBottom: "0"}}>
                {!alternative.anonymous ?
                  <Image avatar src={user.profile.avatar_url} />
                : ''}
                {alternative.anonymous ?
                  <span>{alternatives_anonymous_profile_term} </span>
                :
                <Link to={"/profile/" + user._id}>
                  <span>{user.username} </span>
                </Link>}
                <span> a proposé {alternative_descriptive_term}</span> <a onClick={(e) => {this.onTitleClick(e)}}>{alternative.title}</a>
              </Grid.Column>
              <Grid.Column width={16} style={{paddingTop: "0", color: "#b7b7b7"}}>
              {moment().to(moment(alternative.created_at))}
              </Grid.Column>
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
