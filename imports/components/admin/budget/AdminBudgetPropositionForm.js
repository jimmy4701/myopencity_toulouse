import React, {Component} from 'react'
import styled from 'styled-components'
import { Form, Input, Button } from 'semantic-ui-react'
import { toast } from 'react-toastify'
import TinyMCE from 'react-tinymce'
import Geocomplete from '/imports/components/territories/Geocomplete'

export default class AdminBudgetPropositionForm extends Component {
    state = {
        budget_proposition: {
            documents: [],
            user_age: 'adult'
        },
        sub_territories: []
        
    }


    getDerivedStateFromProps(props, oldState){
        console.log(props, oldState)
        if(props.sub_territories){
            return {sub_territories: props.sub_territories}
        }
    }

    componentWillMount(){
        this.setState({budget_proposition: this.props.budget_proposition})
    }

    componentDidMount(){
        if(this.props.sub_territories){
            this.setState({sub_territories: this.props.sub_territories})
        }
        
    }


    submitForm = (e) => {
        e.preventDefault()
        const { budget_proposition } = this.state
        if(this.props.onFormSubmit) this.props.onFormSubmit(budget_proposition)
    }
    
    handleContentChange = (e) => {
        let {budget_proposition} = this.state
        budget_proposition.content = e.target.getContent()
        this.setState({budget_proposition})
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

    handleSubTerritorySelect = (event, {value}) => {
        let { budget_proposition } = this.state
        budget_proposition.sub_territories = value
        this.setState({budget_proposition})
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
            const { budget_proposition, document_title } = this.state
            const new_file = {
              title: document_title,
              url: downloadUrl
            }
            budget_proposition.documents.push(new_file)
            this.setState({ budget_proposition, loading_file: false, document_title: '' })
          }
          // you will need this in the event the user hit the update button because it will remove the avatar url
        })
      }

      handleChange = (e, {name, value}) => this.setState({[name]: value})
      handlePropositionChange = (e, {name, value}) => {
          let { budget_proposition } = this.state
          budget_proposition[name] = value
          this.setState({budget_proposition})
      }

      handleRemoveDocument = (document) => {
          let { budget_proposition } = this.state
          budget_proposition.documents = budget_proposition.documents.filter(o => o != document)
          this.setState({budget_proposition})
      }

      handleUserSelect = (event, {name, value}) => {
          let { budget_proposition } = this.state
          budget_proposition[name] = value
          this.setState({budget_proposition})
      }

      handleAddressSelect = ({address, coordinates}) => {
        let {budget_proposition} = this.state
        budget_proposition.geolocation_address = address
        budget_proposition.coordinates = coordinates
        this.setState({budget_proposition})
      }

      removeAddress = () => {
          let { budget_proposition } = this.state
          budget_proposition.geolocation_address = ""
          budget_proposition.coordinates = null
          this.setState({budget_proposition})
      }

      handleGeocompleteSelect = ({address, coordinates}) => {
          console.log(address, coordinates)
      }

      handleStatusSelect = (event, {value}) => {
          let { budget_proposition } = this.state
          budget_proposition.status = value
          this.setState({budget_proposition})
      }

    render(){
        const { budget_proposition, sub_territories, loading_file, document_title } = this.state
        const { budget_consult } = this.props

        const sub_territories_options = sub_territories.map(ter => {
            return {key: ter._id, value: ter._id, text: ter.name}
        })

        const { amazon_connected, buttons_validation_background_color, buttons_validation_text_color } = Meteor.isClient && Session.get('global_configuration')

        const status_options = [
            {key: "not_verified", value: "not_verified", text: "Non vérifié"},
            {key: "verified", value: "verified", text: "Vérifié"},
            {key: "validated", value: "validated", text: "Validé"},
            {key: "invalid", value: "invalid", text: "Non valide"},
            {key: "votable", value: "votable", text: "Votable"},
            {key: "voted", value: "voted", text: "Voté"}
        ]

        return(
            <CustomForm onSubmit={this.submitForm}>
                <Form.Input
                    label='Donnez un titre à votre proposition'
                    onChange={this.handlePropositionChange}
                    value={budget_proposition.title}
                    name='title'
                    required
                />
                <Form.Input
                    label='Localisation du projet par le citoyen (adresse et lieu si possible)'
                    onChange={this.handlePropositionChange}
                    value={budget_proposition.address}
                    name='address'
                />
                <Form.Field>
                    <label>Adresse de géolocalisation (Google Map)</label>
                    <Geocomplete onSelect={this.handleAddressSelect}/>
                    {budget_proposition.geolocation_address ?
                        <div>
                            <p>Adresse actuelle : {budget_proposition.geolocation_address}</p>
                            <Button onClick={this.removeAddress}>Supprimer l'adresse</Button>
                        </div>
                    :
                        <p>Actuellement aucune adresse sélectionnée</p>
                    }
                </Form.Field>
                <Form.Select
                    options={sub_territories_options}
                    onChange={this.handleSubTerritorySelect}
                    value={budget_proposition.sub_territories}
                    label="Quartiers concernés"
                    multiple
                />
                <Form.Field required>
                    <label>Décrivez votre projet</label>
                    <TinyMCE
                        content={budget_proposition.content}
                        config={{
                            plugins: 'image autoresize media link paste',
                            paste_as_text: true,
                            menubar: false,
                            toolbar: 'bold italic | image media | link',
                            images_upload_handler: this.handleUploadImage
                        }}
                        onChange={this.handleContentChange}
                    />
                </Form.Field>
                {amazon_connected &&
                    <div>
                        <h3>Liez des documents à votre proposition de projet</h3>
                        <FlexFormContainer bordered>
                            <CustomField>
                                <label>Donnez un titre à votre document</label>
                                <Input loading={loading_file} onChange={this.handleChange} name="document_title" type="text" value={document_title} />
                            </CustomField>
                            <CustomField style={{flex: 2, marginLeft: "1em"}}>
                                <label>Ajoutez un document depuis votre ordinateur {!document_title && "(Merci d'entrer un nom de document)"}</label>
                                <Input disabled={!document_title} loading={loading_file} onChange={(e) => { this.handleFileImport(e) }} type="file" />
                            </CustomField>
                        </FlexFormContainer>
                    </div>
                }
                {budget_proposition.documents.length > 0 &&
                    <DocumentsContainer>
                        {budget_proposition.documents.map((document, index) => {
                            return <DocumentPartial key={document.url + index} onRemove={this.handleRemoveDocument} document={document} />
                        })}
                    </DocumentsContainer>
                }
                <FlexFormContainer bordered>
                    <CustomSelect
                        value={budget_proposition.user_type}
                        onChange={this.handleUserSelect}
                        name="user_type"
                        label="Vous proposez en tant que"
                        options={[
                            {key: 'individual', value: 'individual', text: "Un individu"},
                            {key: 'collective', value: 'collective', text: "Un collectif"},
                            {key: 'association', value: 'association', text: "Une association"}
                        ]}
                    />
                    <CustomSelect
                        style={{marginLeft: "1em"}}
                        value={budget_proposition.user_age}
                        label="Vous êtes"
                        name="user_age"
                        onChange={this.handleUserSelect}
                        options={[
                            {key: 'adult', value: 'adult', text: "Adulte"},
                            {key: 'minor', value: 'minor', text: "Mineur"}
                        ]}
                    />
                </FlexFormContainer>
                <ValidationContainer>
                    <Form.Select 
                        options={status_options}
                        onChange={this.handleStatusSelect}
                        multiple
                        value={budget_proposition.status}
                        label="Statuts de la proposition"
                    />
                </ValidationContainer>
                <ButtonContainer>
                    <CustomButton background_color={buttons_validation_background_color} color={buttons_validation_text_color} size="huge" onClick={this.submitForm}>Modifier la proposition</CustomButton>
                </ButtonContainer>
            </CustomForm>
        )
    }
}

const CustomForm = styled(Form)`
    
`
const CustomField = styled(Form.Field)`
    flex: 1;
`

const FlexFormContainer = styled.div`
    display: flex;
    flex-wrap;
    width: 100%;
    justify-content: space-between;
    margin-top: 3em;
    ${props => props.bordered && "border-top: 1px solid #dadada;"}
    padding-top: 1em;
`

const DocumentPartial = (props) => {
    return(
        <CustomDocument>
            {props.document.title}
            <Button size="mini" color="red" onClick={() => props.onRemove(props.document)} content="Supprimer" icon="delete" />
        </CustomDocument>
    )
}

const CustomDocument = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 1em;
    border: 1px solid #dadada;
    border-radius: 0.5em;
    box-shadow: 4px -2px 20px -10px rgba(0,0,0,0.75);
    margin-top: 0.5em;
`
const DocumentsContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const CustomSelect = styled(Form.Select)`
    flex: 1;
`


const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const CustomButton = styled(Button)`
    background-color: ${props => props.background_color} !important;
    color: ${props => props.color} !important;
`

const ValidationContainer = styled.div`
    display: flex;
    margin-top: 1em;
`