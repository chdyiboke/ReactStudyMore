import React, { Component } from 'react';
import MyRoomStyle from './myRoom.css';
import {Link} from 'react-router-dom';
import { NavBar, List, Modal, Button, SwipeAction, Toast } from 'antd-mobile';
const alert = Modal.alert;

 {/*<Button className={BookingStyle.bookingLocation}
                onClick={() =>
                    alert('MOLI', '确定预定吗?', [
                        { text: 'Cancel', onPress: () => console.log('cancel') },
                        { text: 'Ok', onPress: () => console.log('ok') },
                    ])
                }
            >
                预订
            </Button> */}
class MyRoom extends React.Component {

    goBack = () => {
        this.props.history.replace({
            pathname: '/'
        });
    }
    constructor() {
        super();
        this.state = {
            selectedTab: 0,
            todoList:[]
        };
    };

    componentDidMount = () => {
        this.init();

    };
    //待验证
    // componentWillUnmount = () => {
    //     this.setState = (state, callback) => {
    //         return;
    //     };
    // };
    init = () => {
        let self = this;
        Toast.loading('Loading...', 5, () => {
            Toast.offline('请求超时', 1);
        });

        moli.ajaxRequest({
            type: 'post',
            url: "/meeting/getMeetingBookings"

        }, function (ret) {
            Toast.hide();
            if(ret.flag == 0){
                self.setState({
                    todoList: ret.data
                });
            }else{
                Toast.fail(ret.msg,1);
                self.goBack();
            }
            
        }, function (err) {
            Toast.fail('服务器开小差，请稍后再试~',1);
        });

    };


    delete = (id) => {
        alert('确认取消该预定？', '', [
            { text: '取消' },
            { text: '确认', onPress: () => this.confirmDelete(id), style:{ color: "#F44336" } }
        ]);
    };

    //取消预订会议室
    confirmDelete = (id) => {
        let self = this;
        let param = {
            meetingBookingId: id
        };

        moli.ajaxRequest({
            type: 'post',
            url: "/meeting/cancelBooking",
            param: param
        }, function (ret) {
            if(ret.flag == 0){
                Toast.success('取消预订成功', 1);
                self.init();
            }else{
                Toast.fail(ret.msg ,1);
            }
            
        }, function (err) {
            Toast.fail('服务器开小差，请稍后再试~',1);
        });

    };

     changeSelect = (index) => {
         this.setState({selectedTab: index});
      };

    render() {
       var active0 = this.state.selectedTab == 0? "active": "";
       var active1 = this.state.selectedTab == 1? "active": "";

        var myListArr = this.state.todoList.map((e, i) => {
            if (e.own == "1") {
                return (<SwipeAction
                    key={i}
                    autoClose
                    right={[
                        {
                            text: '取消预订',
                            onPress: this.delete.bind(null, e.id),
                            style: { backgroundColor: '#F4333C', color: 'white', padding: '0 0.2rem' },
                        }
                    ]}
                >
                <Link to={{
							pathname: "/RoomInfo", state: {
								name: e.meetingRoomName, 
                                location: e.meetingRoomLocation,
                                price: e.totalPrice,
                                theme: e.theme,
                                date: e.bookingDate, 
                                startTime: e.startTime, 
                                endTime: e.endTime, 
                                remark:e.remark,
                                attendantCount:e.attendantCount,
                                attendants:e.attendants
							}
						}}
							key="1" data-type="booking" >
                        <div className="um-list-item-inner pl15">
                            <div className="um-list-item-body">
                                <h3 className="um-media-heading um-blue">主题：{e.theme}</h3>
                                <p className="um-black">{e.meetingRoomName}（{e.attendantCount ? e.attendantCount : "10"}人参与）</p>
                                <p className="um-black">{e.meetingRoomLocation}</p>
                            </div>
                            <div className="um-list-item-right f14">
                                <p className="mr15"></p>
                                <p className="mr15">会议开始时间</p>
                                <p className="mr15 um-red">{e.bookingDate}日{e.startTime}</p>

                            </div>
                        </div>
                    </Link>
                </SwipeAction>)
            }
        });

        var listArr =this.state.todoList.map((e,i) =>{
            if (e.own == "0") {
                return (
                    <SwipeAction
                        key={i}
                        autoClose
                    ><Link to={{
                        pathname: "/RoomInfo", state: {
                            name: e.meetingRoomName, 
                            location: e.meetingRoomLocation,
                            price: e.totalPrice,
                            theme: e.theme,
                            date: e.bookingDate, 
                            startTime: e.startTime, 
                            endTime: e.endTime, 
                            remark:e.remark,
                            attendantCount:e.attendantCount,
                            attendants:e.attendants
                        }
                    }}
                        key="1" data-type="booking" >
                        <div className="um-list-item-inner pl15">
                            <div className="um-list-item-body">
                                <h3 className="um-media-heading um-blue">主题：{e.theme}</h3>
                                <p className="um-black">{e.meetingRoomName}（{e.attendantCount ? e.attendantCount : "10"}人参与）</p>
                                <p className="um-black">{e.meetingRoomLocation}</p>
                            </div>
                            <div className="um-list-item-right f14">
                                <p className="mr15"></p>
                                <p className="mr15">会议开始时间</p>
                                <p className="mr15 um-red">{e.bookingDate}日{e.startTime}</p>

                            </div>
                        </div> 
                    </Link>
                    </SwipeAction>
                )
            }
        })
        return (
            <div>
                <div className="navBar">
                    <NavBar
                    style={{ backgroundColor: "#f93333" }}
                        mode="dark"
                        leftContent={[<span key="0" className="iconfont icon-back"></span>]}
                        rightContent={[

                        ]}
                        onLeftClick={this.goBack}
                    >
                        我的会议室
                        </NavBar>
                </div>
                <center>
                <ul className="um-tabbar" style={{ width: "60%",marginTop: "10px"}}>
                  <li className={active0} onClick={this.changeSelect.bind(null, 0)}>
                  <a>我预定的</a>
                  </li>
                  <li className={active1} onClick={this.changeSelect.bind(null, 1)}>
                  <a>我参与的</a>
                  </li>
               </ul> 
               </center>
                <ul className="um-list"  style={{ marginTop: "10px"}}>
                    {this.state.selectedTab == 0 && (myListArr)}
                    {this.state.selectedTab == 1 && (listArr)}
                </ul>
            </div>
        );
    };
}
export default MyRoom;
