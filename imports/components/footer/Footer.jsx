import React, { Component } from 'react';
import { Grid, Container, Image, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import ContactForm from '/imports/components/footer/ContactForm'

export default class Footer extends Component {

    state = {
        display_contact: false
    }

    toggleContact = () => this.setState({display_contact: !this.state.display_contact})

    render() {
        const { footer_background_color, footer_color, footer_cgu_display, cgu_term, about_term, footer_about_display, footer_legal_notice_display,  legal_notice_term, footer_height, footer_content } = Meteor.isClient && Session.get('global_configuration')
        const {display_contact} = this.state

        return (
            <Grid stackable className="footer" verticalAlign="middle" style={{ backgroundColor: footer_background_color, color: footer_color, minHeight: footer_height }}>
                <Grid.Column width={16}>
                    <Container>
                        <Grid stackable centered>
                        <Grid.Column width={2}>
                            <Image src="/images/logo_smartcity.png" className="footer-logo"/>
                        </Grid.Column>
                            <Grid.Column width={8} className="center-align">
                                <Link to="https://toulouse.fr" target="_blank">
                                    <Image className="inline-block footer-image" src="/images/mairie-toulouse.png" inline fluid size="small"/>
                                </Link>
                                <Link to="https://toulouse-metropole.fr" target="_blank">
                                    <Image className="inline-block footer-image" src="/images/toulouse-metropole.png" inline fluid size="small"/>
                                </Link>
                                <br/>
                                <div style={{margin: "1em 0"}}>{footer_content}</div>
                            </Grid.Column>
                            <Grid.Column width={6} verticalAlign="middle" className="footer-abouts">
                                {footer_about_display && <Link to='/a_propos' className="pointer footer-link" ><span style={{color: footer_color}}>{about_term}</span></Link>}
                                {footer_cgu_display && <Link to='/conditions' className="pointer footer-link" ><span style={{color: footer_color}}> | {cgu_term}</span></Link>}
                                {footer_legal_notice_display && <Link to='/mentions_legales' className="pointer footer-link" ><span style={{color: footer_color}}> | {legal_notice_term}<br/></span></Link>}
                                {<span className="pointer footer-link" onClick={this.toggleContact} style={{color: footer_color}}> | Contact</span>}
                            </Grid.Column>
                            <ContactForm open={display_contact} onCloseClick={this.toggleContact}/>
                        </Grid>
                    </Container>
                </Grid.Column>
            </Grid>
        );
    }
}