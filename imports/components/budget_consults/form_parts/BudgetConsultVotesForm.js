import React, {Component} from 'react'
import styled from 'styled-components'
import TinyMCE from 'react-tinymce'
import { toast } from 'react-toastify'
import { Form } from 'semantic-ui-react'

export default class BudgetConsultVotesForm extends Component {
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
        budget_consult.votes_content = e.target.getContent()
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
                    <CustomFormGroup>
                        <Form.Input
                            label='Titre de la phase de votes'
                            onChange={this.handleChange}
                            value={budget_consult.votes_step_name}
                            name='votes_step_name'
                        />
                        <Form.Input
                            label='Titre de la modal de vote'
                            onChange={this.handleChange}
                            value={budget_consult.votes_modal_title}
                            name='votes_modal_title'
                        />
                    </CustomFormGroup>
                    <Form.Checkbox
                        checked={budget_consult.votes_active}
                        label="Les citoyens peuvent voter"
                        onClick={this.toggleState}
                        name="votes_active"
                    />
                    <Form.Field>
                        <label>Contenu pour la phase de votes</label>
                        <TinyMCE
                            content={budget_consult.votes_content}
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


const CustomFormGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 2em;

    .field {
        flex: 1 !important;
        margin: 0.5em !important;
    }
`