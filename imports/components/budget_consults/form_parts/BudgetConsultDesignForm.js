import React, {Component} from 'react'
import styled from 'styled-components'
import { BudgetConsultPartial } from '/imports/components/budget_consults'
import ImageCropper from '/imports/components/general/ImageCropper'
if(Meteor.isClient){
  import readAndCompressImage from 'browser-image-resizer'
}
import { toast } from 'react-toastify'
import { Form, Input } from 'semantic-ui-react'

export default class BudgetConsultDesignForm extends Component {
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

    handlePictureImport = async (cropped_image) => {
        this.setState({ loading_image: true })
        var metaContext = {}
        var uploader = new Slingshot.Upload("ConsultImage", metaContext)
        var uploader_mini = new Slingshot.Upload("ConsultImageMini", metaContext)
    
        const config = {
          quality: 0.5,
          maxWidth: 500,
          maxHeight: 500,
          autoRotate: true,
          debug: true
        };
    
        let minified_image = await readAndCompressImage(cropped_image, config);
    
        await uploader_mini.send(minified_image, (error, downloadUrl) => {
          if (error) {
            // Log service detailed response
            console.error('Error uploading', error)
            this.setState({ loading_image: false })
            toast.error(`Erreur lors de l'envoi de l'image sur Amazon : ${error.reason}`)
          }
          else {
            let { budget_consult } = this.state
            budget_consult.image_url_mini = downloadUrl
            this.setState({ budget_consult, loading_image: false })
          }
          // you will need this in the event the user hit the update button because it will remove the avatar url
        })
    
        await uploader.send(cropped_image, (error, downloadUrl) => {
          if (error) {
            // Log service detailed response
            console.error('Error uploading', error)
            this.setState({ loading_image: false })
            toast.error(`Erreur lors de l'envoi de l'image sur Amazon : ${error.reason}`)
          }
          else {
            // we use $set because the user can change their avatar so it overwrites the url :)
            const { budget_consult } = this.state
            budget_consult.image_url = downloadUrl
            this.setState({ budget_consult, loading_image: false })
          }
          // you will need this in the event the user hit the update button because it will remove the avatar url
        })
      }


    render(){
        const {budget_consult, loading_image} = this.state
        const { amazon_connected } = Session.get('global_configuration')

        return(
            <MainContainer>
                <Form loading={loading_image}>
                    <Form.Input required label="URL de l'image principale" type="text" placeholder="http://...." value={budget_consult.image_url} onChange={this.handleChange} name="image_url" />
                    <Form.Input required label="URL de l'image réduite (pour l'aperçu)" type="text" placeholder="http://...." value={budget_consult.image_url_mini} onChange={this.handleChange} name="image_url_mini" />
                    {amazon_connected ?
                        <Form.Field>
                            <label>Envoyer une image depuis votre ordinateur</label>
                            <ImageCropper onCrop={this.handlePictureImport} />
                        </Form.Field>
                        :
                        <p>Envie d'envoyer des images depuis votre ordinateur ? Vous devez <a href="/admin/external_apis">configurer Amazon S3</a></p>
                    }
                </Form>
                {budget_consult.image_url &&
                    <PartialContainer>
                        <h3>Aperçu de la consultation</h3>
                        <BudgetConsultPartial hide_buttons budget_consult={budget_consult} />
                    </PartialContainer>
                }
            </MainContainer>
        )
    }
}

const MainContainer = styled.div`
    
`

const PartialContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`