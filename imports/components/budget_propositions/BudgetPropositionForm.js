import React, {Component} from 'react'
import styled from 'styled-components'
import { Form } from 'semantic-ui-react'

export default class BudgetPropositionForm extends Component {
    state = {
        budget_proposition: {},
        sub_territories: []
    }


    componentWillReceiveProps(props){
        if(props.sub_territories){
            this.setState({sub_territories: props.sub_territories})
        }
    }


    submitForm = (e) => {
        e.preventDefault()
        const { budget_proposition } = this.state
        if(this.props.onFormSubmit) this.props.onFormSubmit(budget_proposition)
    }

    render(){
        const { budget_proposition, sub_territories } = this.state

        const sub_territories_options = sub_territories.map(ter => {
            return {key: ter._id, value: ter._id, text: ter.name}
        })

        return(
            <CustomForm onSubmit={this.submitForm}>
                <Form.Input
                    label='Donnez un titre à votre proposition'
                    onChange={this.handleChange}
                    value={budget_proposition.title}
                    name='title'
                    required
                />
                <Form.Input
                    label='Localisation du projet (adresse et lieu si possible)'
                    onChange={this.handleChange}
                    value={budget_proposition.address}
                    name='address'
                />
                <Form.Select
                    options={sub_territories_options}
                    onChange={this.handleSubTerritorySelect}
                    value={budget_proposition.sub_territories}
                    label="Quartiers concernés"
                    multiple
                />
            </CustomForm>
        )
    }
}

const CustomForm = styled(Form)`
    
`