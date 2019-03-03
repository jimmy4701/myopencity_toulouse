import React, {Component} from 'react'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'
import { BudgetConsults } from '/imports/api/budget_consults/budget_consults'
import { SubTerritories } from '/imports/api/sub_territories/sub_territories'
import {Helmet} from 'react-helmet'
import Stepper from '/imports/components/general/Stepper'
import { Container, Button, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { BudgetPropositionForm, BudgetPropositionsDisplayer } from '/imports/components/budget_propositions'
import { toast } from 'react-toastify'
import { TerritoriesMap } from '/imports/components/territories'
import { BudgetPropositions } from '/imports/api/budget_propositions/budget_propositions'
import { Pagination } from '/imports/components/general'
import { ceil } from 'lodash'
import moment from 'moment'

class BudgetConsult extends Component {
    state = {
        validated_page: 0
    }

    componentDidMount(){
        window.scrollTo({top: 0, behavior: "smooth"})
        Meteor.call('budget_consults.has_proposed', this.props.match.params.url_shorten, (error, result) => {
            if(error){
                console.log(error.reason)
            }else{
                this.setState({has_proposed: result})
            }
        })
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

    handlePropositionSubmit = (has_proposed) => this.setState({has_proposed})

    render(){
        const { loading, budget_consult, sub_territories, budget_propositions_total_pages, budget_propositions_count, budget_propositions_coordinates } = this.props
        const { has_proposed, validated_page } = this.state

        const {
            consult_header_height,
            consult_header_color,
            consult_description_background_color,
            consult_description_color,
            consult_description_font_size,
            consult_territory_prefix, 
            consult_territory_icon,
            buttons_validation_text_color,
            buttons_validation_background_color,
            consult_term
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
                      key: "analysis",
                      title: budget_consult.analysis_step_name,
                      description: this.getDateDescription('analysis')
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
                    <ConsultHeader height={consult_header_height} image_url={budget_consult.image_url}>
                        <ConsultBackground/>
                        <ConsultTitle className="animated fadeInUp" color={consult_header_color}>{budget_consult.title}</ConsultTitle>
                    </ConsultHeader>
                    <CustomContainer>
                        <SocialShareContainer style={{marginBottom: "2em"}}>
                            <p style={{marginBottom: 0}}><strong>Partagez sur les réseaux sociaux</strong></p>
                            {Meteor.isClient && [
                                <Link to={"https://www.facebook.com/sharer/sharer.php?u=" + window.location.href } target="_blank">
                                    <Button icon="facebook" color="blue" size="tiny" content="Facebook"/>
                                </Link>,
                                <Link to={"https://twitter.com/home?status=" + encodeURIComponent("#jeparticipe @toulouse #budget " +  budget_consult.title + " " +  window.location.href) } target="_blank">
                                    <Button icon="twitter" color="blue" size="tiny" content="Twitter"/>
                                </Link>
                            ]}
                        </SocialShareContainer>
                    </CustomContainer>
                    <CustomContainer className="animated fadeInDown">
                        <Stepper steps={steps} current_step={step_index}/>
                    </CustomContainer>
                    <CustomContainer size_defined>
                        <div dangerouslySetInnerHTML={{__html: budget_consult.propositions_content }} />
                        {budget_propositions_count > 0 &&
                            <h3>Déjà {budget_propositions_count} idées proposées</h3>
                        }
                        <BudgetPropositionsDisplayer budget_consult_id={budget_consult._id} page={validated_page} total_pages={budget_propositions_total_pages} status="validated" />
                        <PaginationContainer>
                            <Pagination increment total_pages={budget_propositions_total_pages} page={validated_page} onPageClick={(validated_page) => this.setState({validated_page})} />
                        </PaginationContainer>
                        <TerritoriesMap 
                            territories={sub_territories}
                            budget_propositions={budget_propositions_coordinates}
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCziAxTCEOc9etrIjh77P86s_LA9plQdG4&v=3.exp&libraries=geometry,drawing,places"
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<MapContainer />}
                            mapElement={<div style={{ height: `100%`, width: '100%' }} />}
                        />
                        {has_proposed ?
                            <HasProposedContainer>
                                <h3>Vous avez proposé le nombre maximum d'idées pour cette consultation.</h3>
                            </HasProposedContainer>
                        :
                            <PropositionFormContainer>
                                <h2>Proposez votre projet</h2>
                                <BudgetPropositionForm 
                                    budget_consult={budget_consult} 
                                    disabled={!budget_consult.propositions_active} 
                                    sub_territories={sub_territories}
                                    onFormSubmit={this.handlePropositionSubmit}
                                />
                            </PropositionFormContainer>
                        }
                        {step_index >= 1 &&
                            <CustomContainer>
                                <div dangerouslySetInnerHTML={{__html: budget_consult.agora_content }} />
                            </CustomContainer>
                        }
                        {step_index >= 2 &&
                            <CustomContainer>
                                <div dangerouslySetInnerHTML={{__html: budget_consult.analysis_content }} />
                            </CustomContainer>
                        }
                        {step_index >= 3 &&
                            <CustomContainer>
                                <div dangerouslySetInnerHTML={{__html: budget_consult.votes_content }} />
                            </CustomContainer>
                        }
                        {step_index >= 4 &&
                            <CustomContainer>
                                <div dangerouslySetInnerHTML={{__html: budget_consult.results_content }} />
                            </CustomContainer>
                        }
                    </CustomContainer>
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
        const budgetPropositionsPublication = Meteor.isClient && Meteor.subscribe('budget_propositions.by_budget_consult_light', budget_consult._id)
        const loading = Meteor.isClient && (!budgetConsultPublication.ready() || !subTerritoriesPublication.ready() || !budgetPropositionsPublication.ready())
        const sub_territories = SubTerritories.find({_id: {$in: budget_consult.sub_territories}}, {fields: {name: 1, coordinates: 1, color: 1}}).fetch()
        const budget_propositions_count = BudgetPropositions.find({budget_consult: budget_consult._id, status: 'validated'}).count()
        const budget_propositions_total_pages = ceil(budget_propositions_count / 10)
        const budget_propositions_coordinates = BudgetPropositions.find({budget_consult: budget_consult._id, status: 'validated'}, {fields: {coordinates: 1}}).fetch()
        return {
            loading,
            budget_consult,
            url_shorten,
            sub_territories,
            budget_propositions_total_pages,
            budget_propositions_count,
            budget_propositions_coordinates
        }
    }else{
        return {loading: true}
    }
})(BudgetConsult)

const MainContainer = styled.div`
    
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