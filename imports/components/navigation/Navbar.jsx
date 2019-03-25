import React, {Component} from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {Menu, Container, Sidebar, Icon, Image} from 'semantic-ui-react'
import NavbarAccountItem from '/imports/components/navigation/NavbarAccountItem'
import {Link} from 'react-router-dom'

export default class Navbar extends TrackerReact(Component){

  state = {
    open_sidebar: false
  }

  componentDidMount(){
    this.setState({screen_size: window.innerWidth})

    Meteor.call('budget_consults.get_navbar_url_shorten', (error, result) => {
      if(error){
        console.log('Erreur', error.message)
        toast.error(error.message)
      }else{
        this.setState({budget_url_shorten: result})
      }
    })
  }

  toggleSidebar(e){
    e.preventDefault()
    Session.set('open_sidebar', !Session.get('open_sidebar'))
  }

  render(){
    const {
      navbar_color, 
      main_title, 
      navbar_consults, 
      navbar_projects, 
      navbar_territories, 
      global_image_url,
      navbar_consults_term,
      navbar_projects_term,
      navbar_territories_term,
      navbar_participation,
      navbar_participation_term,
      navbar_home_term,
      navbar_lexical,
      navbar_lexical_term,
      navbar_budget,
      navbar_budget_term
    } = Session.get('global_configuration')

    const {budget_url_shorten} = this.state

    return(
      <div>
        {this.state.screen_size > 768 ?
          <Menu secondary className="main-navbar" size="massive" style={{backgroundColor: navbar_color}}>
            <Container>
              <Link className="item" to='/'>
                <div className="navbar-item" header>
                  <Image inline src={global_image_url} size="mini" spaced="right" />
                  {navbar_home_term}
                </div>
              </Link>
              {navbar_territories && 
                <Link className="item" to="/territories">
                  <div className="navbar-item">{navbar_territories_term}</div>
                </Link>
              }
              {navbar_consults &&
                <Link className="item" to="/consults">
                  <div className="navbar-item">{navbar_consults_term}</div>
                </Link>
              }
              {navbar_budget && budget_url_shorten &&
                <Link className="item" to={`/budgets/${budget_url_shorten}`}>
                  <div className="navbar-item">{navbar_budget_term ? navbar_budget_term : "Budget"}</div>
                </Link>
              }
              {navbar_projects && 
                <Link className="item" to="/projects">
                  <div className="navbar-item">{navbar_projects_term}</div>
                </Link>
              }
              {navbar_participation && 
                <Link className="item" to="/participation">
                  <div className="navbar-item">{navbar_participation_term}</div>
                </Link>
              }
              {navbar_lexical && 
                <Link className="item" to="/lexical">
                  <div className="navbar-item">{navbar_lexical_term}</div>
                </Link>
              }
              <Menu.Menu position='right' className="item">
                <NavbarAccountItem />
              </Menu.Menu>
            </Container>
          </Menu>
          :
          <Menu secondary className="main-navbar" size="large" style={{backgroundColor: navbar_color, padding: "0 2em"}}>
              <Menu.Item className="navbar-item" icon="content" onClick={(e) => {this.toggleSidebar(e) }} header/>
          </Menu>
        }
      </div>
    )
  }
}
