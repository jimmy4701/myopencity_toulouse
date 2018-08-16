import React, { Component } from 'react'
import { Card, Image, Button, Icon } from 'semantic-ui-react'
import _ from 'lodash'
import { withTracker } from 'meteor/react-meteor-data'
import { Link } from 'react-router-dom'
import { Territories } from '/imports/api/territories/territories'
import styled from 'styled-components'

export class ConsultPartial extends Component {

  /*
    required props:
      - consult: Object
    facultative props:
      - hideButtons: Boolean (hide the partial buttons)
  */

    state = {
      display_manage_buttons: false,
      remove_confirm: false,
      exporting: false
    }

  toggleState(attr, e) {
    let state = this.state
    state[attr] = !state[attr]
    this.setState(state)
  }

  export_alternatives = () => {
    this.setState({loading: true})
    const { consult } = this.props
    Meteor.call('consults.export_alternatives', consult._id, (error, result) => {
      if(error){
        console.log(error)
        Bert.alert({
          title: "Erreur lors de l'export des avis",
          message: error.reason,
          type: 'danger',
          style: 'growl-bottom-left',
        })
        this.setState({exporting: false})
      }else{
        const csv = Papa.unparse(result, {delimiter: ";", header: true})
        const blob = new Blob([csv])
        if (window.navigator.msSaveOrOpenBlob)  // IE hack see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
          window.navigator.msSaveBlob(blob, consult.title + ".csv")
        else
        {
          const a = window.document.createElement("a")
          a.href = window.URL.createObjectURL(blob, {type: "text/plain;charset=UTF-8"})
          a.download = consult.title + ".csv"
          document.body.appendChild(a)
          a.click()  // IE: "Access is denied" see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
          document.body.removeChild(a)
        }

        this.setState({exporting: false})
      }
    })
  }

  export_voters = () => {
    this.setState({exporting: true})
    const { consult } = this.props
    Meteor.call('consults.export_voters', consult._id , (error, result) => {
      if(error){
        console.log("Erreur lors de l'export", error.message)
        Bert.alert({
          title: "Erreur lors de l'export",
          message: error.message,
          style: 'growl-bottom-left',
          type: 'success'
        })
        this.setState({exporting: false})
      }else{
        const csv = Papa.unparse(result, {delimiter: ";", header: true})
        const blob = new Blob([csv])
        if (window.navigator.msSaveOrOpenBlob)  // IE hack see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
          window.navigator.msSaveBlob(blob, "voteurs - " + consult.title + ".csv")
        else
        {
          const a = window.document.createElement("a")
          a.href = window.URL.createObjectURL(blob, {type: "text/plain;charset=UTF-8"})
          a.download = "voteurs - " + consult.title + ".csv"
          document.body.appendChild(a)
          a.click()  // IE: "Access is denied" see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
          document.body.removeChild(a)
        }

        this.setState({exporting: false})
      }
    })
  }

  toggleEditConsult(attr, e) {
    let consult = this.props.consult
    consult[attr] = !consult[attr]
    Meteor.call('consults.update', { consult }, (error, result) => {
      if (error) {
        console.log(error)
        Bert.alert({
          title: "Erreur lors de la modification de la consultation",
          message: error.reason,
          type: 'danger',
          style: 'growl-bottom-left',
        })
      } else {
        Bert.alert({
          title: "Consultation modifiée",
          type: 'success',
          style: 'growl-bottom-left',
        })
      }
    });
  }

  removeConsult(e) {
    Meteor.call('consults.remove', this.props.consult._id, (error, result) => {
      if (error) {
        console.log(error)
        Bert.alert({
          title: "Erreur lors de la suppression de la consultation",
          message: error.reason,
          type: 'danger',
          style: 'growl-bottom-left',
        })
      } else {
        Bert.alert({
          title: "La consultation a été supprimée",
          type: 'success',
          style: 'growl-bottom-left',
        })
      }
    });
  }

  render() {
    const { consult, className, user_id, territories, loading, display_dates } = this.props
    const { exporting } = this.state
    const {consult_territory_icon} = Meteor.isClient && Session.get('global_configuration')

    if (!loading) {
      return (
        <Card className={"inline-block " + className} style={{height: "100%"}}>
          <Link style={{display: "flex", flexDirection: "column", position: "relative"}} to={"/consults/" + consult.url_shorten}>
            <Image src={consult.image_url_mini ? consult.image_url_mini : consult.image_url} />
            {consult.metropole &&
              <Image src="/images/toulouse-metropole-little.png" style={{
                position: "absolute",
                bottom: "12px",
                left: "7px",
                width: "73px"
              }} />
            }
            {consult.dmt &&
              <Image src="/images/dmt_logo.png" style={{
                position: "absolute",
                bottom: "7px",
                left: "8px",
                width: "29px"
              }} />
            }
          </Link>
          <Card.Content>
            <Card.Header>
              {!consult.hide_territories && territories && territories.map(territory => {
                return <Link to={"/territory/" + territory.shorten_url + "/consults"}><span className="territory-label"><Icon name={consult_territory_icon}/>{territory.name}</span></Link>
              })}
              {territories && <br/>}
              {consult.title}
              {display_dates && consult.start_date && consult.end_date &&
                <p className="consult-partial-dates">Du {moment(consult.start_date).format('DD/MM/YYYY')} au {moment(consult.end_date).format('DD/MM/YYYY')}</p>
              }
              {consult.external_url ?
                <span className="external-label"><br /><Icon name="sitemap" /> {consult.external_site_name}</span>
                : ''}
            </Card.Header>
            <Card.Description>
              {this.state.display_manage_buttons ?
                <div>
                  <p>{consult.visible ? "Consultation actuellement visible" : "Consultation actuellement cachée"}</p>
                  <p>{consult.votable ? "Votes en cours" : "Votes désactivés"}</p>
                </div>
                :
                <div>{_.truncate(consult.description, { length: 200, separator: ' ' })}</div>
              }
            </Card.Description>
          </Card.Content>
          {!this.props.hideButtons ?
            <Card.Content className="center-align" extra>
              <Link to={"/consults/" + consult.url_shorten}>
                <Button fluid>Consulter</Button>
              </Link>
              {Roles.userIsInRole(user_id, ['admin', 'moderator']) ?
                <div>
                  <Button fluid active={this.state.display_manage_buttons} onClick={(e) => { this.toggleState('display_manage_buttons', e) }}>Gérer</Button>
                  {this.state.display_manage_buttons ?
                    <div>
                      <Link to={"/admin/consults/" + consult.url_shorten + "/edit"}>
                        <Button fluid>Modifier</Button>
                      </Link>
                      <Button onClick={(e) => { this.toggleEditConsult('visible', e) }} fluid>{consult.visible ? "Rendre invisible" : "Rendre visible"}</Button>
                      <Button onClick={(e) => { this.toggleEditConsult('votable', e) }} fluid>{consult.votable ? "Stopper les votes" : "Lancer les votes"}</Button>
                      <Button onClick={(e) => { this.toggleEditConsult('ended', e) }} fluid>{consult.ended ? "Lancer la consultation" : "Stopper la consultation"}</Button>
                      <Button loading={exporting} onClick={this.export_alternatives} fluid>Excel avis</Button>
                      <Button loading={exporting} onClick={this.export_voters} fluid>Excel voteurs</Button>
                      <Link to={"/admin/consult_summary/" + consult.url_shorten}>
                        <Button fluid>Compte rendu</Button>
                      </Link>
                      <Button onClick={(e) => { this.toggleEditConsult('landing_display', e) }} fluid>{consult.landing_display ? "Ne plus mettre en avant" : "Mettre en avant"}</Button>
                      {this.state.remove_confirm ?
                        <div className="animated fadeInUp">
                          <p>Vous confirmez ?</p>
                          <Button onClick={(e) => { this.toggleState('remove_confirm', e) }}>Annuler</Button>
                          <Button color="red" onClick={(e) => { this.removeConsult(e) }}>Supprimer</Button>
                        </div>
                        :
                        <Button color="red" onClick={(e) => { this.toggleState('remove_confirm', e) }} fluid>Supprimer</Button>
                      }
                    </div>
                    : ''}
                </div>
                : ''}
            </Card.Content>
            : ''}
        </Card>
      )
    } else {
      return <div></div>
    }
  }
}


export default ConsultPartialContainer = withTracker((props) => {
  const { consult } = props
  const territoriesPublication = Meteor.isClient &&  Meteor.subscribe('territories.by_ids', consult.territories)
  const loading = Meteor.isClient && !territoriesPublication.ready()
  const territories = Territories.find({ _id: {$in: consult.territories}}, {sort: {}, limit: 1000}).fetch()
  return {
    user_id: Meteor.isClient ? Meteor.userId() : this.userId,
    territories,
    loading
  }
})(styled(ConsultPartial)`
  display: flex !important;
`)
