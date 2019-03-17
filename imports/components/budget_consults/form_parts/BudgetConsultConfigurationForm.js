import React, {Component} from 'react'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { Form } from 'semantic-ui-react'
import { withTracker } from 'meteor/react-meteor-data'

class BudgetConsultConfigurationForm extends Component {
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

    handleModeratorsSelect = (event, data) => {
      let {budget_consult} = this.state
      budget_consult.moderators_emails = data.value
      this.setState({budget_consult})
    }


    render(){
        const {budget_consult} = this.state
        const { moderators, loading } = this.props

        const moderators_options = moderators.map(moderator => {
          return {key: moderator.emails[0].address, value: moderator.emails[0].address, text: moderator.emails[0].address + " (" + moderator.username + ")"}
        })

        if(!loading){
          return(
              <MainContainer>
                  <Form>
                    <Form.Select
                      options={moderators_options}
                      label="Sélectionnez les modérateurs de cette consultation"
                      onChange={this.handleModeratorsSelect}
                      multiple
                      value={budget_consult.moderators_emails}
                    />
                  </Form>
              </MainContainer>
          )
        }else{
          return <div>Chargement des modérateurs</div>
        }

    }
}


export default BudgetConsultConfigurationFormContainer = withTracker(() => {
  const moderatorsPublication = Meteor.isClient && Meteor.subscribe('admin.moderators')
  const loading = Meteor.isClient && !moderatorsPublication.ready()
  const moderators = Meteor.users.find({roles: {$in: ['moderator', 'admin']}}, {fields: {'emails': 1, 'username': 1}}).fetch()
  return {
    loading,
    moderators
  }
})(BudgetConsultConfigurationForm)

const MainContainer = styled.div`
    
`