import React from 'react';
import CharacterContainer from './CharacterContainer';
import { socket } from '../App';

export default class SelectContainer extends React.Component {
  state = {
    // status can be select | wait
    status: 'select',
    selectedIdx: null,
  }

  componentDidMount() {
    console.log('I mounted')
    socket.on('startedQuestions', () => {
      this.props.callback('game');
      socket.emit('getTurn');
    });
  }

  updateSelectedIdx = (idx) => {
    this.setState({
      selectedIdx: idx
    })
  }

  selectCard = (idx) => {
    if (idx !== null) {
      socket.emit('selectCard', idx);
      socket.on('waitingForSelection', () => {
        this.setState({
          status: 'wait'
        })
      });
    }
  }

  render() {
    let chooseButton = this.state.selectedIdx !== null
      ? <button className='button-select' onClick={ () => this.selectCard(this.state.selectedIdx)}> Confirm Card </button>
      : undefined
    return (
      this.props.show ?
        this.state.status === 'select'
          ? <div className="character-select-container">
              <h1 className="choose-label">Choose your card</h1>
              <CharacterContainer
                callback={this.updateSelectedIdx}
                inFinalSelectMode={true}
                category={this.props.category} 
                images={this.props.images}
                setImages={this.props.setImages} />
              { chooseButton }
            </div>
          : <div className="waitingRoom">
              <div class="loader"></div>
              <h1>Waiting for other player...</h1>
            </div>
        :<></>
      
    );
  }
}