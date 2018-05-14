import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { createContainer } from 'meteor/react-meteor-data'
import {Grid, Header, Menu, Container, Icon} from 'semantic-ui-react'
import AlternativePartial from '/imports/components/alternatives/AlternativePartial'
import AdminUnverifiedAlternatives from '/imports/components/admin/AdminUnverifiedAlternatives'
import AdminUnvalidatedAlternatives from '/imports/components/admin/AdminUnvalidatedAlternatives'
import AdminSignaledAlternatives from '/imports/components/admin/AdminSignaledAlternatives'

export default class AdminAlternativesValidationPage extends TrackerReact(Component){

  /*
    required props:
      - none
  */

  state = {
    part: "unverified"
  }

  changePart = (part) => this.setState({part})

  render(){
    const {part} = this.state

      return(
        <Container>
          <Grid stackable>
            <Grid.Column width={16}>
              <Menu pointing secondary stackable>
                  <Menu.Item active={part === 'unverified'} onClick={() => this.changePart('unverified')} >
                      <Icon name="find" />
                      Non vérifiées
                  </Menu.Item>
                  <Menu.Item active={part === 'unvalidated'} onClick={() => this.changePart('unvalidated')} >
                    <Icon name="ban" />
                    Invalidées
                  </Menu.Item>
                  <Menu.Item active={part === 'signaled'} onClick={() => this.changePart('signaled')} >
                    <Icon name="ban" />
                    Signalées
                  </Menu.Item>
              </Menu>
            </Grid.Column>
            {part == "unverified" &&
              <AdminUnverifiedAlternatives />
            }
            {part == 'unvalidated' &&
              <AdminUnvalidatedAlternatives />
            }
            {part == 'signaled' && 
              <AdminSignaledAlternatives />
            }
          </Grid>
        </Container>
      )
  }
}


