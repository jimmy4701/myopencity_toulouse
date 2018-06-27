import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {Button, Modal, Icon} from 'semantic-ui-react'
import {withRouter} from 'react-router-dom'
import AccountValidationModal from '/imports/components/accounts/AccountValidationModal'

class ConsultPartVoteButton extends TrackerReact(Component){

  /*
    required props:
      - consult_part: Object
      - onNonConnected: Function (called if no user)
  */

  state = {
    open_modal: false,
    open_validation_modal: false
  }

  toggleState(attr, e){
    let state = this.state
    state[attr] = !state[attr]
    this.setState(state)
  }

  vote(value, index, e){
    e.preventDefault()
    Meteor.call('consult_parts.vote', {consult_part_id: this.props.consult_part._id, index: index} , (error, result) => {
      if(error){
        console.log(error)
        Bert.alert({
          title: "Erreur lors du vote",
          message: error.reason,
          type: 'danger',
          style: 'growl-bottom-left',
        })
      }else{
        Bert.alert({
          title: "A VOTÉ !",
          message: "Votre vote a bien été pris en compte",
          type: 'success',
          style: 'growl-bottom-left',
        })
      }
    });
  }

  toggleVoteModal(e){
    if(!Meteor.userId()){
      Session.set('return_route', this.props.history.location.pathname)
      this.props.history.push('/sign_in')
    }else{
      this.toggleState(Roles.userIsInRole(Meteor.userId(), 'verified') ? 'open_modal' : 'open_validation_modal', e)
    }
  }

  on_mouse_over(e){
    e.preventDefault()
    if(this.props.onMouseOver){
      this.props.onMouseOver()
    }
  }

  on_mouse_out(e){
    e.preventDefault()
    if(this.props.onMouseOut){
      this.props.onMouseOut()
    }
  }

  render(){
    const {open_modal, open_validation_modal} = this.state
    const {consult_part} = this.props
    const {buttons_validation_background_color, buttons_validation_text_color} = Meteor.isClient && Session.get('global_configuration')
    return(
      <div>
        <Button onMouseOver={(e) => {this.on_mouse_over(e)}} onMouseOut={(e) => {this.on_mouse_out(e)}} size="huge" style={{backgroundColor: buttons_validation_background_color, color: buttons_validation_text_color}} onClick={(e) => {this.toggleVoteModal(e)}}>{consult_part.vote_label}</Button>
          <Modal open={open_modal} onClose={(e) => {this.toggleState('open_modal', e)}}>
            <Icon name="close" onClick={(e) => {this.toggleState('open_modal', e)}}/>
            <Modal.Header>{consult_part.question}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                {consult_part.vote_values.map((vote_value, index) => {
                  return (
                    <div>
                      <Button fluid onClick={(e) => {this.vote(vote_value, index, e)}}>{vote_value.vote_value}</Button><br/>
                    </div>
                  )
                })}
              </Modal.Description>
            </Modal.Content>
          </Modal>
          <AccountValidationModal open={open_validation_modal} onClose={() => this.setState({open_validation_modal: false})} />
      </div>
    )
  }
}

export default withRouter(ConsultPartVoteButton)
