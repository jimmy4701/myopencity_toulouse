import React, { Component } from 'react'
import { Card, Image, Icon, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class TerritoryPartial extends Component {

    state = {
        removing: false
    }

    remove = (e) => {
        Meteor.call('territories.remove', this.props.territory._id, (error, result) => {
            if (error) {
                console.log(error)
                Bert.alert({
                    title: "Erreur lors de la suppression du territoire",
                    message: error.reason,
                    type: 'danger',
                    style: 'growl-bottom-left',
                })
            } else {
                Bert.alert({
                    title: "Le territoire a été supprimé",
                    type: 'success',
                    style: 'growl-bottom-left',
                })
            }
        });
    }

    edit = () => {
        this.props.onEditClick()
    }

    toggleRemove = () => this.setState({removing: !this.state.removing})

    render() {
        const { territory } = this.props
        const { removing } = this.state

        return (
            <Card>
                <Image src={territory.image_url_mini ? territory.image_url_mini : territory.image_url ? territory.image_url : "https://image.flaticon.com/icons/svg/235/235861.svg"} />
                <Card.Content>
                    <Card.Header>
                        {territory.name}
                     </Card.Header>
                </Card.Content>
                <Card.Content extra>
                    <Button onClick={this.edit}>Modifier</Button>
                    <Link to={"/admin/territory/" + territory._id}>
                        <Button content="Gérer"/>
                    </Link>
                    {removing ? 
                    [
                        <p>Vous confirmez ?</p>,
                        <Button onClick={this.toggleRemove}>Annuler</Button>,
                        <Button onClick={this.remove} color="red">Supprimer</Button>
                    ]
                :
                    <Button onClick={this.toggleRemove} color="red">Supprimer</Button>
                }
                </Card.Content>
            </Card>
        )

    }
}