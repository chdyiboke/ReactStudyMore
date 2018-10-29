import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import { NavBar } from 'antd-mobile';

import homePageStyle from './homePage.css';
import Summer from '../../assets/js/summer.js';

class HomePage extends Component {
    constructor() {
        super();
    };
    goBack = () => {
        summer.closeWin();
    }
    render() {
        return (
            <div>
                <div className="navBar">
                    <NavBar
                    className={homePageStyle.NavBarA}
                        mode="dark"
                        leftContent={[<span key="0" className="iconfont icon-back"></span>]}
                        rightContent={[

                        ]}
                        onLeftClick={this.goBack}
                    >
                        会议管理
                    </NavBar>
                </div>

                {/* 两个按钮：会议室查询、我的会议 */}
                <div>
                    <div><div>
                        <img src={require('../../assets/img/booking.jpg')} className={homePageStyle.image} /></div>
                        <div className={homePageStyle.threeButton}>
                            <center>
                                <Link to='/SearchRoom' key="1" data-type="searchRoom" ><button className="btn um-btn">会议室查询</button></Link>
                                <Link to='/MyRoom' key="2" data-type="myRoom" ><button className="btn" style={{ marginTop: '10px' }}>我的会议</button></Link>
                            </center>
                        </div>

                    </div>

                </div>
            </div>
        );
    };
};

export default HomePage;