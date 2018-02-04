import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { Grid, Form, Input, Button, Select } from 'semantic-ui-react'

export default class EditProfileDetailsForm extends TrackerReact(Component) {

    /*
      required props:
        - none
    */
    state = {
        user_profile: {}
    }

    componentWillMount() {
        this.setState({ user_profile: Meteor.isClient && Meteor.user().profile })
    }

    handleDescriptionChange(e) {
        let { user_profile } = this.state
        user_profile.description = e.target.getContent()
        this.setState({ user_profile })
    }

    handleProfileChange(attr, e) {
        let { user_profile } = this.state
        user_profile[attr] = e.target.value
        this.setState({ user_profile })
    }

    toggleProfile = (attr) => {
        let { user_profile } = this.state
        user_profile[attr] = !user_profile[attr]
        this.setState({user_profile})
    }

    handleSocioProChange = (event, data) => {
        let { user_profile } = this.state
        user_profile.socio_pro = data.value
        this.setState({user_profile})
    }

    edit_profile(e) {
        e.preventDefault()
        const { user_profile } = this.state

        Meteor.call('user.edit_profile', user_profile, (error, result) => {
            if (error) {
                console.log(error)
                Bert.alert({
                    title: "Erreur lors de la modification de votre profil",
                    message: error.reason,
                    type: 'danger',
                    style: 'growl-bottom-left',
                })
            } else {
                Bert.alert({
                    title: "Votre profil a bien été modifié",
                    type: 'success',
                    style: 'growl-bottom-left',
                })
                if (this.props.onSubmitForm) {
                    this.props.onSubmitForm()
                }
            }
        });
    }

    

    render() {
        const { user_profile } = this.state
        const socio_pro_options = [
            { key: 11, value: 11, text: "Agriculteurs sur petite exploitation" },
            { key: 12, value: 12, text: "Agriculteurs sur moyenne exploitation" },
            { key: 13, value: 13, text: "Agriculteurs sur grande exploitation" },
            { key: 21, value: 21, text: "Artisan" },
            { key: 22, value: 22, text: "Commerçant et assimilés" },
            { key: 23, value: 23, text: "Chefs d’entreprise de 10 salariés ou plus" },
            { key: 31, value: 31, text: "Professions libérales" },
            { key: 33, value: 33, text: "Cadres de la fonction publique" },
            { key: 34, value: 34, text: "Professeurs, professions scientifiques" },
            { key: 35, value: 35, text: "Professions de l’information, des arts et des spectacles" },
            { key: 37, value: 37, text: "Cadres administratifs et commerciaux d’entreprise" },
            { key: 38, value: 38, text: "Ingénieurs et cadres techniques d’entreprise" },
            { key: 42, value: 42, text: "Professeurs des écoles, instituteurs et assimilés" },
            { key: 43, value: 43, text: "Professions intermédiaires de la santé et du travail social" },
            { key: 44, value: 44, text: "Clergé, religieux" },
            { key: 45, value: 45, text: "Professions intermédiaires administratives de la fonction publique" },
            { key: 46, value: 46, text: "Professions intermédiaires administratives et commerciales des entreprises" },
            { key: 47, value: 47, text: "Techniciens" },
            { key: 48, value: 48, text: "Contremaîtres, agents de maîtrise" },
            { key: 52, value: 52, text: "Employés civils et agents de service de la fonction publique" },
            { key: 53, value: 53, text: "Policiers et militaires" },
            { key: 54, value: 54, text: "Employés administratifs d’entreprise" },
            { key: 55, value: 55, text: "Employés de commerce" },
            { key: 56, value: 56, text: "Personnels des services directs aux particuliers" },
            { key: 62, value: 62, text: "Ouvriers qualifiés de type industriel" },
            { key: 63, value: 63, text: "Ouvriers qualifiés de type artisanal" },
            { key: 64, value: 64, text: "Chauffeurs" },
            { key: 65, value: 65, text: "Ouvriers qualifiés de la manutention, du magasinage et du transport" },
            { key: 67, value: 67, text: "Ouvriers non qualifiés de type industriel" },
            { key: 68, value: 68, text: "Ouvriers non qualifiés de type artisanal" },
            { key: 69, value: 69, text: "Ouvriers agricoles" },
            { key: 71, value: 71, text: "Anciens agriculteurs exploitants" },
            { key: 72, value: 72, text: "Anciens artisans, commerçants et chefs d’entreprise" },
            { key: 74, value: 74, text: "Anciens cadres" },
            { key: 75, value: 75, text: "Anciennes professions intermédiaires" },
            { key: 77, value: 77, text: "Anciens employés" },
            { key: 78, value: 78, text: "Anciens ouvriers" },
            { key: 81, value: 81, text: "Chômeurs n’ayant jamais travaillé" },
            { key: 83, value: 83, text: "Militaires du contingent" },
            { key: 84, value: 84, text: "Élèves, étudiants" },
            { key: 85, value: 85, text: "Personnes diverses sans activité professionnelle de moins de 60 ans (sauf retraités)" },
            { key: 86, value: 86, text: "Personnes diverses sans activité professionnelle de 60 ans et plus (sauf retraités)" }
        ]
        return (
            <Form>
                <Form.Group widths="equal">
                    <Form.Checkbox
                        label={{ children: "J'autorise les autres citoyens à voir mes données" }}
                        vertical
                        onClick={() => this.toggleProfile('public_profile')}
                        checked={user_profile.public_profile}
                    />
                    <Form.Checkbox
                        label={{ children: "J'habite à Toulouse" }}
                        vertical
                        onClick={() => this.toggleProfile('local_citizen')}
                        checked={user_profile.local_citizen}
                    />
                    <Form.Field>
                        <label>Catégorie socio-professionnelle</label>
                        <Select
                            options={socio_pro_options}
                            value={user_profile.socio_pro}
                            onChange={this.handleSocioProChange}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Field className="padded-bottom center-align">
                    <Button positive onClick={(e) => { this.edit_profile(e) }}>Modifier les détails</Button>
                </Form.Field>
            </Form>
        )
    }
}
