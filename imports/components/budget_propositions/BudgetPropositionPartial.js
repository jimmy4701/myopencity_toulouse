import React, {Component} from 'react'
import styled from 'styled-components'
import { Segment, Rating } from 'semantic-ui-react'

export default class BudgetPropositionPartial extends Component {
    state = {
        display_content: false
    }

    handleRate = (e, {rating, maxRating}) => {
        e.stopPropagation()
        const {budget_proposition} = this.props
        this.props.onVote({proposition_id: budget_proposition._id, vote: rating})
    }

    render(){
        const { budget_proposition, votable } = this.props
        const { display_content } = this.state

        return(
            <MainContainer active={display_content} onClick={() => this.setState({display_content: !display_content})} className="animated fadeInUp">
                <HeaderContainer>
        <Title>{budget_proposition.title} {votable && budget_proposition.estimation && <Estimation>(Estimé à {budget_proposition.estimation.toLocaleString('fr')} €)</Estimation>}</Title>
                    {votable &&
                        <Rating icon='heart' clearable maxRating={3} size="huge" onRate={this.handleRate} />
                    }
                </HeaderContainer>
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

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Content = styled.div`
    margin-top: 2em;
`

const Title = styled.div`
    font-weight: bold;
`

const Estimation = styled.span`
    font-weight: bold;
    color: grey;
`