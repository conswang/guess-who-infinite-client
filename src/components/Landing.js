import React, { useState, useEffect } from 'react';
import { socket } from '../App';
import LobbyRoom from './LobbyRoom';
import Footer from './Footer';

export default (props) => {
    const [select, useSelect] = useState(true);
    const [lobby, setLobby] = useState(false);
    let [name, setName] = useState('');
    let [category, setCategory] = useState('');
    let [join, setJoin] = useState('');
    let [code, setCode] = useState('');

    useEffect(() => {
        socket.on("startedGame", (category) => {
          props.setCategoryCallback(category);
          props.callback("select");
        });
      });

    let createGame = () => {
        if(name === '') {
            alert("PLEASE ENTER A NAME")
            return
        }
        socket.emit('createGame', name, category);
        socket.on('createdGame', joinCode => {
            console.log(joinCode);
            setCode(joinCode);
            props.setCategoryCallback(category);
        });
        setLobby(true);
        
    }
    
    let joinGame = () => {
        if(name === '' || join === '') {
            alert("PLEASE ENTER A NAME AND ENTER A CODE")
            return
        }
        socket.emit('joinGame', name, join);
    }

    const handleNameChange = event => {
        const letter = event.target.value;
        setName(letter);
    }

    const handleCategoryChange = event => {
        const letter = event.target.value;
        setCategory(letter);        
    }

    const handleJoinChange = event => {
        const letter = event.target.value;
        setJoin(letter);        
    }

    const createTab = () => {
        return <div className='normalize-bot'>
            {console.log(lobby)}
                <label for="category">category</label>
                <input name="category" id="category" type="text" value={ category } onChange={ handleCategoryChange } required></input>
                <br></br>
                <span className="right-side-button">
                    <button type="submit" className="submit" onClick={createGame}> CREATE </button>
                </span>
                <Footer />
            </div>
    }

    const joinTab = () => {
        return <div className='normalize-bot'>
            {console.log(lobby)}
                <label for="join">join code</label>
                <input name="join" id="join" type="text" value={ join } onChange={ handleJoinChange } required></input>
                <br></br>
                <span className="right-side-button">
                    <button type="submit" className="submit" onClick={joinGame}> JOIN </button>
                </span>
                <Footer />
            </div>
    }

    const inLobby = () => {
        return lobby ? <LobbyRoom code={ code } callback={ props.callback } /> :
              <div className="landing-form-container">
                <div className="create-join-container">
                    <button onClick={() => {useSelect(!select)}} className={ select ? 'create select' : 'create'}> create </button>
                    <button onClick={() => {useSelect(!select)}} className={ select ? 'join' : 'join select'}> join</button>
                </div>

                <label for="name">name</label>
                <input name="name" id="name" type="text" value={ name } onChange={ handleNameChange } required></input>
                { select ? createTab() : joinTab() }
            </div>
    }

    return(
        props.show
        ?<div className="landing-container">
            { console.log(`${code} hereeeeee`) }
            <div className="title">
                <h3> Guess Who </h3>
                <h1> Infinite </h1>
            </div>

            { inLobby() }
        </div>
        : <></>
    )
}