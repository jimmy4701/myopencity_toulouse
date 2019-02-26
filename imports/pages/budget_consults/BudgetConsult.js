import React, {Component} from 'react'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'
import { BudgetConsults } from '/imports/api/budget_consults/budget_consults'
import {Helmet} from 'react-helmet'
import Stepper from '/imports/components/general/Stepper'
import { Container, Button, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { BudgetPropositionForm } from '/imports/components/budget_propositions'
import { toast } from 'react-toastify'

class BudgetConsult extends Component {
    state = {
        
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

    componentWillReceiveProps(props){
        if(props.budget_consult){
            Meteor.call('sub_territories.get_by_ids', {ids: props.budget_consult.sub_territories, fields: {name: 1, _id: 1}}, (error, result) => {
                if(error){
                    console.log('Erreur', error.message)
                    toast.error(error.message)
                }else{
                    this.setState({sub_territories: result})
                }
            })
            
        }
    }

    handlePropositionSubmit = (has_proposed) => this.setState({has_proposed})

    render(){
        const { loading, budget_consult } = this.props
        const { sub_territories, has_proposed } = this.state

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

        const steps = [
            { key: "propositions", title: "Propositons", description: "Jusqu'au 22 Janvier"},
            { key: "agora", title: "Agora", description: "Jusqu'au 22 Janvier"},
            { key: "analysis", title: "Analyse technique", description: "Jusqu'au 22 Janvier"},
            { key: "votes", title: "Votes", description: "Jusqu'au 22 Janvier"},
            { key: "results", title: "Résultats", description: "Jusqu'au 22 Janvier"},
        ]

        
        if(!loading){
            const step_index = steps.findIndex(o => o.key == budget_consult.step )
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
                    <CustomContainer>
                        <div dangerouslySetInnerHTML={{__html: budget_consult.propositions_content }} />
                        {/* PROPOSITIONS ACTIVE PART */}
                        {budget_consult.step == 'propositions' && !has_proposed  &&
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
                        {budget_consult.step == 'votes' &&
                            <div dangerouslySetInnerHTML={{__html: budget_consult.votes_content }} />
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
    const loading = Meteor.isClient && (!budgetConsultPublication.ready())
    const budget_consult = BudgetConsults.findOne({url_shorten})
    return {
        loading,
        budget_consult,
        url_shorten
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
`

const SocialShareContainer = styled.div`
    margin-bottom: 2em;
`

const PropositionFormContainer = styled.div`
    margin-top: 2em;
`