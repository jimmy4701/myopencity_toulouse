import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { createContainer } from 'meteor/react-meteor-data'
import { Grid, Header, Loader, Button, Container } from 'semantic-ui-react'
import ConsultPartial from '/imports/components/consults/ConsultPartial'
import { Consults } from '/imports/api/consults/consults'
import { Territories } from '/imports/api/territories/territories'
import { BudgetConsults } from '/imports/api/budget_consults/budget_consults'
import BudgetConsultPartial from '/imports/components/budget_consults/BudgetConsultPartial'

export class TerritoryConsultsPage extends TrackerReact(Component) {

    state = {
        show_ended_consults: false
    }

    toggleState(attr, e) {
        let state = this.state
        state[attr] = !state[attr]
        this.setState(state)
    }

    render() {
        const { consults, ended_consults, territory, budget_consults, ended_budget_consults, loading } = this.props
        const { show_ended_consults } = this.state
        const { navbar_color } = Meteor.isClient && Session.get('global_configuration')
        const { ended_consults_title, consults_title, consults_no_consults } = Meteor.isClient && Session.get('global_configuration')

        if (!loading) {
            return (
                <Container>
                    <Grid className="wow fadeInUp" stackable>
                        <Grid.Column width={16} className="territory-consults-header mobile-padding">
                            <Header as="h1" className="wow fadeInUp territory-name" style={{color: navbar_color, fontSize: "2.5em"}}>{territory.name}</Header>
                            <Header as="h3" className="wow fadeInDown territory-label" data-wow-delay="0.5s">{!show_ended_consults ? consults_title : ended_consults_title}</Header>
                            {((ended_consults.length > 0) || (ended_budget_consults.length > 0)) ?
                                <Button size="mini" onClick={(e) => { this.toggleState('show_ended_consults', e) }}>Voir les consultations {!show_ended_consults ? "terminées" : "en cours"}</Button>
                                : ''}
                            <div className="dangerous" dangerouslySetInnerHTML={{__html: territory.description }} />
                        </Grid.Column>
                        {!show_ended_consults ?
                            <Grid.Column width={16} className="mobile-padding">
                                {((consults.length == 0) && (budget_consults.length == 0)) ?
                                    <Header className="center-align" as="h3">{consults_no_consults}</Header>
                                    :
                                    <Grid stackable>
                                        {budget_consults.map(budget_consult => {
                                            return <Grid.Column width={4} key={budget_consult._id}>
                                                <BudgetConsultPartial budget_consult={budget_consult} className="animated fadeInUp" />
                                            </Grid.Column>
                                        })}
                                        {consults.map((consult, index) => {
                                            return (
                                                <Grid.Column width={4} className="center-align">
                                                    <ConsultPartial className="wow fadeInUp" consult={consult} />
                                                </Grid.Column>
                                            )
                                        })}
                                    </Grid>
                                }
                            </Grid.Column>
                            :
                            <Grid.Column width={16} className="mobile-padding">
                                {((ended_consults.length == 0) && (ended_budget_consults.length == 0)) ?
                                    <Header className="center-align" as="h3">Aucune consultation terminée actuellement</Header>
                                    :
                                    <Grid stackable>
                                        {ended_budget_consults.map(budget_consult => {
                                            return <Grid.Column width={4} key={budget_consult._id}>
                                                <BudgetConsultPartial budget_consult={budget_consult} className="animated fadeInUp" />
                                            </Grid.Column>
                                        })}
                                        {ended_consults.map((consult, index) => {
                                            return (
                                                <Grid.Column width={4} className="center-align">
                                                    <ConsultPartial className="wow fadeInUp" consult={consult} />
                                                </Grid.Column>
                                            )
                                        })}
                                    </Grid>
                                }
                            </Grid.Column>
                        }
                    </Grid>
                </Container>
            )
        } else {
            return <Loader className="inline-block">Chargement des consultations</Loader>
        }
    }
}

export default TerritoryConsultsPageContainer = createContainer(({ match }) => {
    const { shorten_url } = match.params
    const territoryPublication = Meteor.isClient && Meteor.subscribe('territories.by_shorten_url', shorten_url )
    const territory = Territories.findOne({shorten_url, active: true})
    if(territory){
        const consultsPublication = Meteor.isClient && Meteor.subscribe('consults.by_territory', territory._id)
        const budgetConsultsPublication = Meteor.isClient && Meteor.subscribe('budget_consults.by_territory', territory._id)
        const loading = Meteor.isClient && (!territoryPublication.ready() || !consultsPublication.ready() || !budgetConsultsPublication.ready())
        const consults = Consults.find({ visible: true, ended: false, territories: territory._id }).fetch()
        const ended_consults = Consults.find({ visible: true, ended: true, territories: territory._id }, {sort: {title: 1}}).fetch()
        const budget_consults = BudgetConsults.find({visible: true, active: true, ended: false, territories: territory._id}).fetch()
        const ended_budget_consults = BudgetConsults.find({visible: true, active: true, ended: true, territories: territory._id}).fetch()
        return {
            loading,
            consults,
            ended_consults,
            territory,
            budget_consults,
            ended_budget_consults
        }
    }else{
        return {loading: true}
    }
}, TerritoryConsultsPage)
