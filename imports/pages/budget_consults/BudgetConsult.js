import React, {Component, Fragment} from 'react'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'
import { BudgetConsults } from '/imports/api/budget_consults/budget_consults'
import { SubTerritories } from '/imports/api/sub_territories/sub_territories'
import {Helmet} from 'react-helmet'
import Stepper from '/imports/components/general/Stepper'
import { Container, Button, Grid } from 'semantic-ui-react'
import { BudgetPropositionForm, BudgetPropositionsDisplayer } from '/imports/components/budget_propositions'
import { toast } from 'react-toastify'
import { TerritoriesMap } from '/imports/components/territories'
import { Pagination } from '/imports/components/general'
import moment from 'moment'

class BudgetConsult extends Component {
    state = {
        validated_page: 0,
        votable_page: 0,
        budget_propositions_coordinates: [],
        active_step_initialized: false,
        active_step: 'propositions'
    }

    componentDidMount(){
        window.scrollTo({top: 0, behavior: "smooth"})
        const {budget_consult} = this.props
        if(budget_consult){
            console.log('ACTIVE STEP CHANGE')
            this.setState({active_step: budget_consult.step})
        }
        Meteor.call('budget_consults.has_proposed', this.props.match.params.url_shorten, (error, result) => {
            if(error){
                console.log(error.reason)
            }else{
                this.setState({has_proposed: result})
            }
        })
        Meteor.call('budget_propositions.get_total_pages', this.props.match.params.url_shorten, (error, result) => {
            if(error){
                console.log('Erreur', error.message)
                toast.error(error.message)
            }else{
                this.setState(result)
            }
        })
        Meteor.call('budget_propositions.coordinates', this.props.match.params.url_shorten , (error, budget_propositions_coordinates) => {
            if(error){
                console.log('Erreur', error.message)
                toast.error(error.message)
            }else{
                this.setState({budget_propositions_coordinates})
            }
        })
    }

    componentWillReceiveProps(props){
        const {budget_consult} = props
        const {active_step_initialized} = this.state
        if(!active_step_initialized && budget_consult){
            this.setState({active_step: budget_consult.step, active_step_initialized: true})
        }
    }

    getDateDescription = (step) => {
        const { budget_consult } = this.props
        const start_date = budget_consult[`${step}_start_date`]
        const end_date = budget_consult[`${step}_end_date`]
        if(start_date && end_date){
            return `Du ${moment(start_date).format('DD/MM/YYYY')} au ${moment(end_date).format('DD/MM/YYYY')}`
        }else if(start_date){
            return `A partir du ${moment(start_date).format('DD/MM/YYYY')}`
        }else if(end_date){
            return `Jusqu'au ${moment(end_date).format('DD/MM/YYYY')}`
        }else{
            return "Aucune date encore précisée"
        }
    }

    changeStep = (active_step) => {
        const {budget_consult} = this.props
        const steps = ['propositions', 'agora', 'analysis', 'votes', 'results']
        const active_step_index = steps.indexOf(active_step)
        this.setState({active_step, active_step_index})

    }

    handlePropositionSubmit = (has_proposed) => this.setState({has_proposed})

    render(){
        const { 
            loading,
            budget_consult,
            sub_territories
        } = this.props
        const { 
            has_proposed, 
            validated_page, 
            votable_page,
            validated_total_pages,
            validated_count,
            votable_total_pages,
            budget_propositions_coordinates,
            active_step
        } = this.state

        const {
            consult_header_height,
            consult_header_color,
          } = Meteor.isClient && Session.get('global_configuration')
          
          if(!loading){
              const steps = [
                  { 
                      key: "propositions",
                      title: budget_consult.propositions_step_name,
                      description: this.getDateDescription('propositions')
                    },
                  { 
                      key: "agora",
                      title: budget_consult.agora_step_name,
                      description: this.getDateDescription('agora')
                    },
                  { 
                      key: "votes",
                      title: budget_consult.votes_step_name,
                      description: this.getDateDescription('votes')
                    },
                  { 
                      key: "results",
                      title: budget_consult.results_step_name,
                      description: this.getDateDescription('results')
                    },
              ]
            const step_index = steps.findIndex(o => o.key == (budget_consult ? budget_consult.step : 'propositions') )
            const active_step_index = steps.findIndex(o => o.key == active_step )

            return(
                <MainContainer>
                    <Helmet>
                        <meta property="og:title" content={budget_consult.title} />
                        <meta property="og:type" content="article" />
                        <meta property="og:description" content={budget_consult.description} />
                        <meta name="description" content={budget_consult.description} />
                        <meta property="og:image" content={budget_consult.image_url} />
                        <meta property="og:url" content={"https://jeparticipe.toulouse.fr" + this.props.location.pathname} />
                    </Helmet>
                    <Grid.Column
                        width={16}
                        className="center-align consult-header"
                        style={{
                            backgroundImage: "url('" + budget_consult.image_url + "')",
                            height: consult_header_height
                        }}
                    >
                        <Grid verticalAlign="middle" className="consult-header-inner-grid">
                            <Grid.Column width={16} className="center-align">
                                <ConsultTitle className="animated fadeInUp" data-wow-delay="1s" as="h1" style={{color: consult_header_color}}>{budget_consult.title}</ConsultTitle>
                            </Grid.Column>
                        </Grid>
                    </Grid.Column>
                    <Grid.Column width={16}>
                        
                        <CustomContainer>
                            <SocialShareContainer style={{marginBottom: "2em"}}>
                                <p style={{marginBottom: 0}}><strong>Partagez sur les réseaux sociaux</strong></p>
                                {Meteor.isClient && [
                                    <a href={"https://www.facebook.com/sharer/sharer.php?u=" + window.location.href } target="_blank">
                                        <Button icon="facebook" color="blue" size="tiny" content="Facebook"/>
                                    </a>,
                                    <a href={"https://twitter.com/home?status=" + encodeURIComponent("#jeparticipe @toulouse #budget " +  budget_consult.title + " " +  window.location.href) } target="_blank">
                                        <Button icon="twitter" color="blue" size="tiny" content="Twitter"/>
                                    </a>
                                ]}
                            </SocialShareContainer>
                        </CustomContainer>
                        <CustomContainer className="animated fadeInDown">
                            <Stepper 
                                active_step={active_step}
                                active_step_index={active_step_index}
                                steps={steps}
                                budget_step={step_index}
                                onStepClick={this.changeStep} />
                        </CustomContainer>
                        {active_step == 'propositions' &&
                            <CustomContainer>
                                <div dangerouslySetInnerHTML={{__html: budget_consult.propositions_content }} />
                                <TerritoriesMap
                                    avoid_link_territory
                                    display_roads
                                    territories={sub_territories}
                                    budget_propositions={budget_propositions_coordinates}
                                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCziAxTCEOc9etrIjh77P86s_LA9plQdG4&v=3.exp&libraries=geometry,drawing,places"
                                    loadingElement={<div style={{ height: `100%` }} />}
                                    containerElement={<MapContainer />}
                                    mapElement={<div style={{ height: `100%`, width: '100%' }} />}
                                />
                                {budget_consult.step == 'propositions' &&
                                    <Fragment>
                                        {has_proposed ?
                                            <HasProposedContainer>
                                                <h3>Vous avez proposé le nombre maximum d'idées pour cette consultation.</h3>
                                            </HasProposedContainer>
                                        :
                                            <PropositionFormContainer>
                                                <h2>Proposez votre idée</h2>
                                                <BudgetPropositionForm 
                                                    budget_consult={budget_consult} 
                                                    disabled={!budget_consult.propositions_active} 
                                                    sub_territories={sub_territories}
                                                    onFormSubmit={this.handlePropositionSubmit}
                                                />
                                            </PropositionFormContainer>
                                        }
                                        {validated_count > 0 &&
                                            <h3>Déjà {validated_count} idées proposées</h3>
                                        }
                                    </Fragment>
                                }
                                <BudgetPropositionsDisplayer title="Les projets déposés" budget_consult_id={budget_consult._id} page={validated_page} total_pages={validated_total_pages} status="validated" />
                                <PaginationContainer>
                                    <Pagination increment total_pages={validated_total_pages} page={validated_page} onPageClick={(validated_page) => this.setState({validated_page})} />
                                </PaginationContainer>
                            </CustomContainer>
                        }
                        {active_step == 'agora' &&
                            <CustomContainer>
                                <div dangerouslySetInnerHTML={{__html: budget_consult.agora_content }} />
                            </CustomContainer>
                        }
                        {active_step == 'votes' &&
                            <CustomContainer>
                                <div dangerouslySetInnerHTML={{__html: budget_consult.votes_content }} />
                                <BudgetPropositionsDisplayer 
                                    votable={budget_consult.step == 'votes'}
                                    display_votes
                                    maximum_votes={budget_consult.available_votes} 
                                    budget_consult_id={budget_consult._id} 
                                    page={votable_page} 
                                    total_pages={votable_total_pages}
                                    total_budget={budget_consult.total_budget}
                                    status="votable" 
                                />
                                <PaginationContainer>
                                    <Pagination increment total_pages={votable_total_pages} page={votable_page} onPageClick={(votable_page) => this.setState({votable_page})} />
                                </PaginationContainer>
                            </CustomContainer>
                        }
                        {active_step == 'results' &&
                            <CustomContainer>
                                <div dangerouslySetInnerHTML={{__html: budget_consult.results_content }} />
                            </CustomContainer>
                        }
                    </Grid.Column>
                </MainContainer>
            )
        }else{
            return <div></div>
        }
    }
}

export default BudgetConsultContainer = withTracker(({match}) => {
    const { url_shorten } = match.params
    const budgetConsultPublication = Meteor.isClient && Meteor.subscribe('budget_consults.by_url_shorten', url_shorten)
    const budget_consult = BudgetConsults.findOne({url_shorten})

    if(budget_consult){
        const subTerritoriesPublication = Meteor.isClient && Meteor.subscribe('sub_territories.by_ids', budget_consult.sub_territories)
        const loading = Meteor.isClient && (!budgetConsultPublication.ready() || !subTerritoriesPublication.ready())
        const sub_territories = SubTerritories.find({_id: {$in: budget_consult.sub_territories}}, {fields: {name: 1, coordinates: 1, color: 1}}).fetch()

        return {
            loading,
            budget_consult,
            url_shorten,
            sub_territories
        }
    }else{
        return {loading: true}
    }
})(BudgetConsult)

const MainContainer = styled(Grid)`
    
`

const ConsultHeader = styled.div`
    background-image: url('${props => props.image_url}');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    height: ${props => props.height};
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-top: -1em;
`

const ConsultBackground = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    position: absolute;
`

const ConsultTitle = styled.h3`
    color: ${props => props.color};
    font-size: 2em;
`

const CustomContainer = styled(Container)`
    margin-top: 2em;
    ${props => props.size_defined ? "height: 100%; width: 100%;" : ""}
`

const SocialShareContainer = styled.div`
    margin-bottom: 2em;
`

const PropositionFormContainer = styled.div`
    margin-top: 2em;
`

const HasProposedContainer = styled.div`
    margin: 2em 0;
`

const MapContainer = styled.div`
    height: 35em;
    width: 100%;
    margin: 2em 0;
`

const PaginationContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`