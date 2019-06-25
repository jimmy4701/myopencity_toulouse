import React, { Component } from 'react'
import { Consults } from '/imports/api/consults/consults'
import { ConsultParts } from '/imports/api/consult_parts/consult_parts'
import { Configuration } from '/imports/api/configuration/configuration'
import { Territories } from '/imports/api/territories/territories'
import { Grid, Header, Image, Loader, Container, Divider, Statistic } from 'semantic-ui-react'
import ConsultPartResults from '/imports/components/consult_parts/ConsultPartResults'
import { withTracker } from 'meteor/react-meteor-data'
import moment from 'moment'
import _ from 'lodash'
import Helmet from 'react-helmet'
import styled from 'styled-components'

export class AdminConsultSummary extends Component {

    state = {
        statistics: {
            ages: []
        }
    }

    componentWillReceiveProps(){
        if(this.props.consult){
            Meteor.call('consults.get_users_statistics', this.props.consult._id, (error, result) => {
                if(error){
                    console.log('Erreur', error.message)
                }else{
                    this.setState({statistics: result})
                }
            })
        }
    }
    render() {
        const { loading, consult, consult_parts, territories, configuration } = this.props
        const actual_date = moment().format('DD.MM.YYYY')
        const {statistics} = this.state

        const ages_options = {
            "18": "Moins de 18 ans",
            "24": "Entre 18 et 24 ans",
            "39": "Entre 25 et 39 ans",
            "65": "Entre 40 et 65 ans",
            "80": "Plus de 65 ans",
            "none": "Non renseigné"
        }

        const genders_options = {
            "man": "Homme",
            "woman": "Femme",
            "other": "Autre",
            "none": "Non renseigné"
        }
        
        if (!loading) {
            const { global_image_url, navbar_color, main_title } = configuration

            return (
                <Container>
                    <Helmet>
                        <title>Compte rendu de consultation du {actual_date}</title>
                    </Helmet>
                    <Grid stackable style={{marginBottom: "15em"}}>
                        <Grid.Column width={16} className="center-align">
                            <Image src={global_image_url} inline size="medium" />
                            <Header as='h1'>{main_title}</Header>
                            <Header as='h2'>Compte rendu de consultation</Header>
                            <p>Généré le {actual_date}</p>
                        </Grid.Column>
                            <Grid.Column width={16}>
                                <Header as='h2' style={{backgroundColor: navbar_color, padding: "1em", color: "white"}}>{consult.title}</Header>
                                <p>Créée le {moment(consult.created_at).format('DD.MM.YYYY à HH:mm')}</p>
                                <Grid stackable>
                                    {consult_parts.map((part, part_index) => {
                                        const vote_values = _.orderBy(part.vote_values, ['counter'], ['desc'])
                                        const total_votes = _.sumBy(vote_values, (o) => {return o.counter})
                                        return (
                                            <Grid.Column width={16}>
                                                <Divider horizontal style={{backgroundColor: "rgb(228, 228, 228)"}}><Header as='h3' style={{color: navbar_color}}>{part.title}</Header></Divider>
                                                <Header as='h4'>Question : {part.question}</Header>
                                                <Grid stackable>
                                                    {vote_values.map((vote_value, vote_index) => {
                                                        return (
                                                            <Grid.Column width={8}>
                                                                <Statistic horizontal>
                                                                    <Statistic.Value>{vote_value.counter}</Statistic.Value>
                                                                    <Statistic.Label>{vote_value.vote_value} <span style={{color: navbar_color}}>({vote_value.counter > 0 ?_.round((vote_value.counter*100)/total_votes, 2) : 0} %)</span></Statistic.Label>
                                                                </Statistic>
                                                            </Grid.Column>
                                                        )
                                                    })}
                                                    <Grid.Column width={16}>
                                                        <ConsultPartResults consult_part={part} chart_type={part.results_format} />
                                                    </Grid.Column>
                                                </Grid>
                                            </Grid.Column>
                                        )
                                    })}
                                </Grid>
                            </Grid.Column>
                            <Grid.Column width={16}>
                                <Header as='h1'>Concernant les participants ({statistics.total_voters} au total)</Header>
                                <Header as='h2'>Tranches d'âge</Header>
                                {Object.keys(statistics.ages).map(cle => {
                                    return (
                                        <Statistic label={ages_options[cle]} value={statistics.ages[cle] + "  (" + _.round(statistics.ages[cle]*100/statistics.total_voters, 2) + " %)"} size="tiny" />
                                    )
                                })}
                                <Header as='h2'>Genres</Header>
                                <div>
                                    <Statistic label="Femmes" value={statistics.genders.woman} size="tiny" />
                                    <Statistic label="Hommes" value={statistics.genders.man} size="tiny" />
                                    <Statistic label="Non-précisé" value={statistics.genders.none} size="tiny" />
                                </div>
                                <Header as='h2'>Quartiers</Header>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Header as='h3'>Ils habitent</Header>
                                {Object.keys(statistics.territories.home_territories).map(cle => {
                                    const territory = _.find(territories, (o) =>{ return o._id == cle})
                                    return (
                                        <p>{statistics.territories.home_territories[cle]} ({_.round(statistics.territories.home_territories[cle]*100/statistics.total_voters, 2) + " %"}) - {territory ? territory.name : (cle == 'outside') ? "Hors territoire" : ""} </p>
                                    )
                                })}
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Header as='h3'>Ils y travaillent</Header>
                                {Object.keys(statistics.territories.work_territories).map(cle => {
                                    const territory = _.find(territories, (o) =>{ return o._id == cle})
                                    return (
                                        <p>{statistics.territories.work_territories[cle]} ({_.round(statistics.territories.work_territories[cle]*100/statistics.total_voters, 2) + " %"}) - {territory ? territory.name : (cle == 'outside') ? "Hors territoire" : ""} </p>
                                    )
                                })}
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Header as='h3'>Ils y passent régulièrement</Header>
                                {Object.keys(statistics.territories.travel_territories).map(cle => {
                                    if(cle == 'outside'){
                                        return 
                                    }
                                    const territory = _.find(territories, (o) =>{ return o._id == cle})
                                    return (
                                        <p>{statistics.territories.travel_territories[cle]} ({_.round(statistics.territories.travel_territories[cle]*100/statistics.total_voters, 2) + " %"}) - {territory ? territory.name : (cle == 'outside') ? "Hors territoire" : ""} </p>
                                    )
                                })}
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Header as='h3'>Ils sont intéressés</Header>
                                {Object.keys(statistics.territories.interest_territories).map(cle => {
                                    const territory = _.find(territories, (o) =>{ return o._id == cle})
                                    return (
                                        <p>{statistics.territories.interest_territories[cle]} ({_.round(statistics.territories.interest_territories[cle]*100/statistics.total_voters, 2) + " %"}) - {territory ? territory.name : (cle == 'outside') ? "Hors territoire" : ""} </p>
                                    )
                                })}
                            </Grid.Column>

                    </Grid>
                </Container>
            )
        } else {
            return <Loader className="inline-block">Chargement du compte rendu de consultation</Loader>
        }
    }
}

export default AdminConsultSummaryContainer = withTracker(({match}) => {
    const {shorten_url} = match.params
    const consultPublication = Meteor.isClient && Meteor.subscribe('consult.admin_by_shorten_url', shorten_url)
    const consult = Consults.findOne({url_shorten: shorten_url})
    if(consult){
        const consultPartsPublication = Meteor.isClient && Meteor.subscribe('consult_parts.by_consult_url_shorten', shorten_url)
        const territoriesPublication = Meteor.isClient && Meteor.subscribe('territories.all')
        const configurationPublication = Meteor.isClient && Meteor.subscribe('global_configuration')
        const loading = Meteor.isClient && (!configurationPublication.ready() || !territoriesPublication.ready() || !consultPublication.ready() || !consultPartsPublication.ready())
        const territories = Territories.find({}).fetch()
        const consult_parts = ConsultParts.find({consult_url_shorten: shorten_url, active: true}).fetch()
        const configuration = Configuration.findOne()
        return {
            loading,
            consult,
            consult_parts,
            territories,
            configuration
        }
    }else{
        return {loading: true}
    }
})(AdminConsultSummary)

const GendersContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`