import React, { Component } from 'react';
import { Grid, Container, Image, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default class Footer extends Component {
    render() {
        const { footer_background_color, footer_color, footer_cgu_display, cgu_term, footer_legal_notice_display,  legal_notice_term, footer_height, footer_content } = Meteor.isClient && Session.get('global_configuration')

        return (
            <Grid stackable className="footer" verticalAlign="middle" style={{ backgroundColor: footer_background_color, color: footer_color, minHeight: footer_height }}>
                <Grid.Column width={16}>
                    <Container>
                        <Grid stackable centered>
                        <Grid.Column width={3}>
                            <Image src="/images/logo_smartcity.png" className="footer-logo"/>
                        </Grid.Column>
                            <Grid.Column width={10} className="center-align">
                                <Link to="http://toulouse.fr" target="_blank">
                                    <Image className="inline-block footer-image" src="/images/mairie-toulouse.png" inline fluid size="small"/>
                                </Link>
                                <Link to="//toulouse-metropole.fr" target="_blank">
                                    <Image className="inline-block footer-image" src="/images/toulouse-metropole.png" inline fluid size="small"/>
                                </Link>
                                <br/>
                                <div style={{margin: "1em 0"}}>{footer_content}</div>
                            </Grid.Column>
                            <Grid.Column width={3} verticalAlign="middle" style={{textAlign: "right"}}>
                                {footer_cgu_display && <Link to='/conditions' className="pointer footer-link" ><span style={{color: footer_color}}>{cgu_term}<br/></span></Link>}
                                {footer_legal_notice_display && <Link to='/mentions_legales' className="pointer footer-link" ><span style={{color: footer_color}}>{legal_notice_term}<br/></span></Link>}
                                <Link to="//facebook.com/Toulouse" target="_blank">
                                    <Icon name="facebook" circular style={{
                                        backgroundColor: "#c5c5c5",
                                        boxShadow: "none",
                                        color: "white"
                                    }}/>
                                </Link>
                            </Grid.Column>
                        </Grid>
                    </Container>
                </Grid.Column>
            </Grid>
        );
    }
}