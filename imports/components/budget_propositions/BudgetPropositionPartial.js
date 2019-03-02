import React, {Component} from 'react'
import styled from 'styled-components'
import { Segment } from 'semantic-ui-react'

export default class BudgetPropositionPartial extends Component {
    state = {
        display_content: false
    }

    render(){
        const { budget_proposition } = this.props
        const { display_content } = this.state

        return(
            <MainContainer active={display_content} onClick={() => this.setState({display_content: !display_content})} className="animated fadeInUp">
                <Title>{budget_proposition.title}</Title>
                {display_content &&
                    <Content>
                        <div dangerouslySetInnerHTML={{__html: budget_proposition.content }} />
                    </Content>
                }
            </MainContainer>
        )
    }
}

const MainContainer = styled(Segment)`
    cursor: pointer;
    min-width: 40%;
    margin: 0.5em !important;

    ${props => props.active ? "width: 100%;" : "flex: 1;"}

    &:hover {
        background-color: ${props => !props.active && "#f3f3f3"};
    }
`

const Content = styled.div`
    margin-top: 2em;
`

const Title = styled.div`
    font-weight: bold;
`