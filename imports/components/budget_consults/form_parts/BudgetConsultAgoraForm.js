import React, {Component} from 'react'
import styled from 'styled-components'
import TinyMCE from 'react-tinymce'
import { toast } from 'react-toastify'
import { Form } from 'semantic-ui-react'

export default class BudgetConsultAgoraForm extends Component {
    state = {
        budget_consult: {}
    }

    componentWillMount(){
        const {budget_consult} = this.props
        this.setState({budget_consult})
    }

    componentWillUnmount(){
        const {budget_consult} = this.state
        this.props.onFormSubmit(budget_consult)
    }

    handleChange = (e, {name, value}) => {
        let { budget_consult } = this.state
        budget_consult[name] = value
        this.setState({budget_consult})
    }

    handleContentChange = (e) => {
        let {budget_consult} = this.state
        budget_consult.agora_content = e.target.getContent()
        this.setState({budget_consult})
    }

    handleUploadImage = (blobInfo, success, failure) => {
        var metaContext = {}
        var uploader = new Slingshot.Upload("ConsultImage", metaContext)
        uploader.send(blobInfo.blob(), (error, downloadUrl) => {
        if (error) {
            // Log service detailed response
            console.error('Error uploading', error)
            toast.error("Erreur lors de l'envoi de l'image sur Amazon")
            failure("Erreur lors de l'envoi de l'image : " + error)
        }
        else {
            success(downloadUrl)
        }
        })
        
    }

    toggleState = (e, {name}) => {
        let { budget_consult } = this.state
        budget_consult[name] = !this.state.budget_consult[name]
        this.setState({budget_consult})
    }

    render(){
        const {budget_consult} = this.state

        return(
            <MainContainer>
                <Form>
                    <Form.Input
                        label="Titre de la phase d'Agora"
                        onChange={this.handleChange}
                        value={budget_consult.agora_step_name}
                        name='agora_step_name'
                    />
                    <Form.Field>
                        <label>Contenu pour la phase d'Agora</label>
                        <TinyMCE
                            content={budget_consult.agora_content}
                            config={{
                                plugins: 'image autoresize media code link paste',
                                paste_as_text: true,
                                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | formatselect | image media code | link',
                                images_upload_handler: this.handleUploadImage
                            }}
                            onChange={this.handleContentChange}
                        />
                    </Form.Field>

                </Form>
            </MainContainer>
        )
    }
}

const MainContainer = styled.div`
    
`