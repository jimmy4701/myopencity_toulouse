import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {Grid, Header, Container} from 'semantic-ui-react'
import SigninForm from '/imports/components/accounts/SigninForm'
import {withRouter} from 'react-router-dom'

class SigninPage extends TrackerReact(Component){

  /*
    required params:
  */

  state = {
    
  }

  signed_in(){
    this.props.history.push('/')
  }

  render(){
    return(
       <Grid stackable centered className="wow fadeInUp">
           <Grid.Column width={16} className="center-align mobile-padding">
              <Container>
                  <Header as="h1">Connexion</Header>
                  <SigninForm onSignin={this.signed_in.bind(this)}/>
              </Container>
           </Grid.Column>
       </Grid>
    )
  }
}

export default withRouter(SigninPage)
