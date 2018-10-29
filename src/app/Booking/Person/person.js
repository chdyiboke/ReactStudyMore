import React, { Component } from 'react';
import PersonStyle from './person.css';
import { SwipeAction } from 'antd-mobile';
class Person extends React.Component {
    constructor() {
        super();
        this.state = {
            personList: []
        };
    };
    componentDidMount = () => {
        window._Room = this;

    };
    chooseMember = () => {
        let self = this;
        var moliUserInfo = summer.getStorage('moliUserInfo');
        var selfId = moliUserInfo.userId;
        var exceptMembers = [];
        self.state.personList.map((e, i) => {
            exceptMembers.push(e.yhtId);
        });
        exceptMembers.push(selfId);
        summer.openWin({
            appid: "MOLI",
            id: "selectCorp",
            url: "comps/message/html/publicSelectPeople/selectCorp.html",
            create: "false",
            type: "actionBar",
            pageParam: {
                id: "bookMeetingroot",
                exceptMembers: exceptMembers
            },
            actionBar: {
                title: " 选择联系人",
                leftItem: {
                    image: "",
                    method: ""
                },
                rightItems: [{
                    type: "text",
                    text: "完成(0)",
                    method: "saveClose()"
                }]
            }
        });

    };
    //MOLI跨页面执行   id：root
    setMemberInfos = (text) => {

        var info = $summer.strToJson(text);
        let personList = [];
        let attendants = [];

        for (var i = 0; i < info.length; i++) {
            personList.push(
                info[i]
            );
            attendants.push(
                info[i].id
            );
        };

        this.attS(JSON.stringify(attendants));
        this.setState({
            personList: personList
        });
        
    };
    //传给父组件
    attS(attendants) {
        this.props.getAttendants(attendants); // 传给父组件
    }

    render() {
        let peopleArr = this.state.personList.map((e, i) => {
                return (
                    <SwipeAction
                    key={i}
                    autoClose
                >
                                {/* <div>
                                    <img className={PersonStyle.img} src={e.avatar =='null' ?require('../../../assets/img/def_user.png'): e.avatar}/>
                                    <span className={PersonStyle.name}>{e.userName}</span>
                                </div>  */}

                        <li className="border" >
                            <div className={PersonStyle.personTop}>
                                <img src={e.avatar =='null' ?require('../../../assets/img/def_user.png'): e.avatar} />
                            </div>
                            <p>
                            {e.userName}
							</p>
                        </li>    
                </SwipeAction>
                )    
        });
        return (<div className="member" style={{ marginTop: "10px" }}>
            <p className="title pl10">
                会议人员
                </p>
            <div className="um-label um-box-justify border" onClick={this.chooseMember}>
                <div>
                    <i className="iconfont icon-add f20 um-blue"></i>
                    <span> 添加会议人员</span>
                </div>
            </div>
            <div className="um-list">
                <div className={PersonStyle.addressList}>
                    <ul>
                        {peopleArr}
                    </ul>
                </div>
            </div>

        </div>)
    }
}
export default Person;
