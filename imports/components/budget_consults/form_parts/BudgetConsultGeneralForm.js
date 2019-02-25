import React, {Component} from 'react'
import styled from 'styled-components'
import { Form, Button } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'

export default class BudgetConsultGeneralForm extends Component {
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

    handleDateChange = (date, name) => {
        let {budget_consult} = this.state
        budget_consult[name] = date.toDate()
        this.setState({budget_consult})
    }

    handleChange = (e, {name, value}) => {
        let { budget_consult } = this.state
        budget_consult[name] = value
        this.setState({budget_consult})
    } 

    render(){
        const { budget_consult } = this.state

        return(
            <MainContainer>
                <h3>Dates des différentes phases</h3>
                <Form>
                    <CustomFormGroup>
                        <Form.Field>
                            <label>Début de la phase de propositions</label>
                            <DatePicker
                                selected={moment(budget_consult.propositions_start_date)}
                                dateFormat="DD/MM/YYYY"
                                onChange={(date) => this.handleDateChange(date, "propositions_start_date")}
                                name="propositions_start_date"
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Fin de la phase de propositions</label>
                            <DatePicker
                                selected={moment(budget_consult.propositions_end_date)}
                                dateFormat="DD/MM/YYYY"
                                name="propositions_end_date"
                                onChange={(date) => this.handleDateChange(date, "propositions_end_date")}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Début de la phase de votes</label>
                            <DatePicker
                                selected={moment(budget_consult.votes_start_date)}
                                dateFormat="DD/MM/YYYY"
                                name="votes_start_date"
                                onChange={(date) => this.handleDateChange(date, "votes_start_date")}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Début de la phase de votes</label>
                            <DatePicker
                                selected={moment(budget_consult.votes_end_date)}
                                dateFormat="DD/MM/YYYY"
                                name="votes_end_date"
                                onChange={(date) => this.handleDateChange(date, "votes_end_date")}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Début de la phase de résultats</label>
                            <DatePicker
                                selected={moment(budget_consult.results_start_date)}
                                dateFormat="DD/MM/YYYY"
                                name="results_start_date"
                                onChange={(date) => this.handleDateChange(date, "results_start_date")}
                            />
                        </Form.Field>
                    </CustomFormGroup>
                    <Form.Input 
                        label="Titre de la consultation"
                        onChange={this.handleChange}
                        value={budget_consult.title}
                        name="title"
                        required
                    />
                    <Form.TextArea 
                        label="Description de la consultation"
                        onChange={this.handleChange}
                        value={budget_consult.description}
                        name="description"
                        required
                    />
                    <p><span style={{color: "red"}}>*</span> Champs obligatoires</p>
                </Form>
            </MainContainer>
        )
    }
}

const MainContainer = styled.div`
    
`

const CustomFormGroup = styled.div`
    display: flex;
    justify-content: space-between;
`