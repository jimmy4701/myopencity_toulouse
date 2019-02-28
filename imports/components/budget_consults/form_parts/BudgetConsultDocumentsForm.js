import React, {Component} from 'react'
import styled from 'styled-components'
import TinyMCE from 'react-tinymce'
import { toast } from 'react-toastify'
import { Form, Icon, Segment, Button, Input } from 'semantic-ui-react'

export default class BudgetConsultDocumentsForm extends Component {
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

    handleChange = (e, {name, value}) => this.setState({[name]: value})

    handleContentChange = (e) => {
        let {budget_consult} = this.state
        budget_consult.results_content = e.target.getContent()
        this.setState({budget_consult})
    }

    handleFileImport(e) {
        e.preventDefault()
        this.setState({ loading_file: true })
        var metaContext = { title: this.state.document_title }
        var uploader = new Slingshot.Upload("ConsultFile", metaContext)
        uploader.send(e.target.files[0], (error, downloadUrl) => {
          if (error) {
            // Log service detailed response
            console.error('Error uploading', error)
            this.setState({ loading_file: false })
            toast.error("Erreur lors de l'envoi du document sur Amazon")
          }
          else {
            // we use $set because the user can change their avatar so it overwrites the url :)
            const { budget_consult, document_title } = this.state
            const new_file = {
              title: document_title,
              url: downloadUrl
            }
            budget_consult.attached_files.push(new_file)
            this.setState({ budget_consult, loading_file: false, document_title: '' })
          }
          // you will need this in the event the user hit the update button because it will remove the avatar url
        })
      }

      remove_attached_file(index, e) {
        e.preventDefault()
        let { budget_consult } = this.state
        budget_consult.attached_files.splice(index, 1)
        this.setState({ budget_consult })
      }

    render(){
        const {budget_consult, loading_file, document_title} = this.state
        const { amazon_connected } = Session.get('global_configuration')

        return(
            <MainContainer>
                {amazon_connected ?
                    <Form loading={loading_file}>
                        <Form.Field>
                            <label>Donnez un titre à votre document</label>
                            <Input onChange={this.handleChange} name="document_title" type="text" value={document_title} />
                        </Form.Field>
                        <Form.Field>
                            <label>Envoyer un document depuis votre ordinateur {!document_title && "(Merci d'entrer un nom de document)"}</label>
                            <Input disabled={!document_title} loading={loading_file} onChange={(e) => { this.handleFileImport(e) }} type="file" />
                        </Form.Field>
                    </Form>
                    :
                    <p>Envie d'envoyer de lier des documents à vos consultations ? Vous devez <a href="/admin/external_apis">configurer Amazon S3</a></p>
                }
                {budget_consult.attached_files.length > 0 ?
                    <DocumentsContainer>
                        <h3>Documents attachés à la consultation</h3>
                        {budget_consult.attached_files.map((attached_file, index) => {
                            return (
                                <DocumentPartial clearing>
                                    <h4><Icon name="file" /> {attached_file.title}</h4> 
                                    <a href={attached_file.url} target="_blank">{attached_file.url}</a>
                                    <Button color="red" icon="remove" content="Supprimer" floated="right" onClick={(e) => { this.remove_attached_file(index, e) }} />
                                </DocumentPartial>
                            )
                        })}
                    </DocumentsContainer>
                :
                    <h4>Aucun document n'est attaché à la consultation pour l'instant</h4>
                }

            </MainContainer>
        )
    }
}

const MainContainer = styled.div`
    
`

const DocumentsContainer = styled.div`
    margin-top: 2em ;
`

const DocumentPartial = styled(Segment)`
    padding: 0.5em !important;
`