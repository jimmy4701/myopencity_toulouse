import React, {Component} from 'react'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'
import { BudgetConsults } from '/imports/api/budget_consults/budget_consults'
import {Helmet} from 'react-helmet'

class BudgetConsult extends Component {
    state = {
        
    }

    componentDidMount(){
        window.scrollTo({top: 0, behavior: "smooth"})
    }

    render(){
        const { loading, budget_consult } = this.props

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
        budget_consult
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
`