import React, {Component} from 'react'
import { Modal, Header, Form, Button } from 'semantic-ui-react'
import TinyMCE from 'react-tinymce'


export default class ContactForm extends Component {
    state = {
        message: "",
        subject: "",
        email: ""
    }

    componentDidMount(){
        const user = Meteor.user()
        if(user){
            this.setState({email: user.emails[0].address})
        }
    }

    submit_message = (e) => {
        e.preventDefault()
        const {message, subject, email} = this.state
        if(!message || !subject || !email){
            Bert.alert({
                title: 'Merci de remplir tous les champs du formulaire',
                style: 'growl-bottom-left',
                type: 'danger'
            })
        }else{
            Meteor.call('accounts.send_contact_message', this.state , (error, result) => {
                if(error){
                    console.log('Erreur', error.message)
                }else{
                    Bert.alert({
                        title: 'Votre message a bien été envoyé',
                        style: 'growl-bottom-left',
                        type: 'success'
                    })
                    this.props.onCloseClick()
                }
            })
        }
    }


    handleChange = (e, {name, value}) => this.setState({[name]: value})

    handleMessage = (e) => this.setState({message: e.target.getContent()})

    render(){
        const {email, subject, message} = this.state
        const {navbar_color} = Session.get('global_configuration')

        return(
            <Modal size='small' {...this.props} closeIcon onClose={() => this.props.onCloseClick()}>
                <Modal.Header className="center-align" as="h1" style={{backgroundColor: navbar_color, color: "white"}}>
                    Contactez-nous
                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.submit_message}>
                        <Form.Input
                            label='Votre adresse email'
                            onChange={this.handleChange}
                            value={email}
                            name='email'
                            required
                            disabled={Meteor.userId()}
                        />
                        <Form.Input
                            label='Sujet de votre message'
                            onChange={this.handleChange}
                            value={subject}
                            required
                            name='subject'
                        />
                        <Form.Field required>
                            <label>Votre message</label>
                            <TinyMCE
                                content={message}
                                config={{
                                toolbar: false,
                                menubar: false,
                                branding: false,
                                statusbar: false
                                }}
                                onChange={this.handleMessage}
                                />
                            </Form.Field>
                            <Button>Envoyer le message</Button>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}