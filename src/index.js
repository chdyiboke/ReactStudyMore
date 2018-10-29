//index.js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter as Router,
    Route
} from 'react-router-dom';

import './assets/css/iuapmobile.um.css';
import './assets/css/iscroll.css';
import './assets/fonts/iconfont.css';
import './assets/css/font-icons.css';
import './assets/css/main.css';

import HomePage from './app/HomePage/homePage.js';
import SearchRoom from './app/SearchRoom/searchRoom.js';
import MyRoom from './app/MyRoom/myRoom.js';
import List from './app/List/list.js';
import Booking from './app/Booking/booking.js';
import RoomInfo from './app/RoomInfo/roomInfo.js';


class App extends Component {
    constructor() {
        super();
    };

    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={HomePage}></Route>
                    <Route path="/SearchRoom" component={SearchRoom}></Route>
                    <Route path="/MyRoom" component={MyRoom}></Route>
                    <Route path="/List" component={List}></Route>
                    <Route path="/Booking" component={Booking}></Route>
                    <Route path="/RoomInfo" component={RoomInfo}></Route>
                </div>
            </Router>
        );
    };
};
ReactDOM.render(<App />, document.getElementById('root'));