import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import BookingStyle from './booking.css';
import {Link} from 'react-router-dom';
import { NavBar,  DatePicker,List, Modal, Button, SwipeAction, Toast } from 'antd-mobile';
import Person from './Person/person.js';
import PersonStyle from './Person/person.css';

const alert = Modal.alert;

class Booking extends Component {
    constructor(props) {
        super(props);
        // 时间数据写入有问题：页面选择更新数据时
        let data = this.props.history.location.state;
        if(!data){
            this.goBack();
        }
        this.state = {
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            name: data.name,
            location: data.location,
            price: data.price,
            id: data.id,
            capacity: data.capacity
        };
    };

    goBack = () => {
        if (this.props.location.state) {
            this.props.history.replace({
                pathname: '/List',
                state:{
                    date: this.state.date,
                    startTime:this.state.startTime,
                    endTime:this.state.endTime,
                    name: this.state.name,
                    location: this.state.location,
                    price: this.state.price,
                    id: this.state.id,
                    capacity: this.state.capacity
                }
            })
        } else {
            //this.props.history.goBack();
            this.props.history.replace({
                pathname: '/'
            })
        }
    };

    getAttendants = (attendants) => {
        this.setState({ attendants: attendants });
    }

    clickSearch(e) {
        let theme = document.getElementById("inputTheme").value;
        if (!theme) {
            Toast.fail('主题不可为空', 1);
            return;
        }
        var reg = /^[0-9]*$/;
        if (!reg.test(document.getElementById("inputCount").value)) {
            Toast.fail('参与人数请填写数字', 1);
            return false;
        }
        //输入不可为表情
        var ranges = ['\ud83c[\udf00-\udfff]', '\ud83d[\udc00-\ude4f]', '\ud83d[\ude80-\udeff]'];
        var emojireg = document.getElementById("inputRemark").value;
        var emojireg2 = emojireg.replace(new RegExp(ranges.join('|'), 'g'), '');
        if (emojireg != emojireg2) {
            Toast.fail('不支持表情符号,请重新输入', 1);
            return false;
        }

        // alert('确认预定？', '', [
        //     { text: '取消' },
        //     { text: '确认', onPress: () => this.confirmBooking.bind(this)}
        // ]);
        let self = this;
        let param = {
            theme: theme,      //获取 主题
            bookingDate: self.state.date.format("yyyy-MM-dd"),
            startTime: self.state.startTime.format("hh:mm"),
            endTime: self.state.endTime.format("hh:mm"),
            meetingRoomId: self.state.id,
            attendants: self.state.attendants,    //获取 人员id   
            attendantCount: document.getElementById("inputCount").value,     //获取 参会人员   
            remark: document.getElementById("inputRemark").value     //获取 备注   
        };
        moli.ajaxRequest({
            type: 'post',
            url: "/meeting/bookMeeting",
            param: param
        }, function (ret) {
            if(ret.flag == 0){
                //Toast.success('预定成功，按时参会', 1);
                Toast.success('添加成功', 1, () => {self.homePage()});
            }else{
                Toast.fail(ret.msg, 1);
            }           
            //跳转首页   Link to='/'
        }, function (err) {
            Toast.fail('预定失败：' + err, 1);
        });
    };

    homePage = () => {
        this.props.history.replace({
            pathname: '/'
        })
    }

    render() {
        
        return (<div style={{ backgroundColor: "white"}}>
            <div className="navBar">
                <NavBar
                style={{ backgroundColor: "#f93333" }}
                    mode="dark"
                    leftContent={[<span key="0" className="iconfont icon-back"></span>]}
                    rightContent={[

                    ]}
                    onLeftClick={this.goBack}
                >
                    会议室预定
                    </NavBar>
            </div>
            {/* 主题、预定日期、开始时间、结束时间、会议室列表信息、参与人员、总人数、备注。 */}
            <div className="um-input-text" style={{ paddingTop: "4px", paddingLeft: "12px" }}>
                <span className="um-input-left" style={{
                    fontSize: "large", display: "block", marginLeft: "2px", lineHeight: "50px"
                }}>主题</span>
                <span className="um-input-left" style={{
                    width: "18%", color: "red",
                    fontSize: "large", display: "block", marginLeft: "2px", lineHeight: "50px"
                }}>* </span>
                <input type="" placeholder="请输入会议主题" className="form-control" id="inputTheme" style={{ fontSize: "15px" }} />
            </div>

            <DatePicker
                mode="date"
                title="会议日期"
                extra="Optional"
                value={this.state.date}
                onChange={date => this.setState({ date })}
            >
                <List.Item arrow="horizontal">预定日期</List.Item>
            </DatePicker>

            <DatePicker
                mode="time"
                minuteStep={30}
                title={"开始时间"}
                value={this.state.startTime}
                onChange={startTime => this.setState({ startTime })}
            >
                <List.Item arrow="horizontal">开始时间</List.Item>
            </DatePicker>

            <DatePicker
                mode="time"
                minuteStep={30}
                title={"结束时间"}
                value={this.state.endTime}
                onChange={endTime => this.setState({ endTime })}
            >
                <List.Item arrow="horizontal">结束时间</List.Item>
            </DatePicker>

            <div className="um-list">
                <div className={BookingStyle.bookingOneList}>
                    <Link to={{ pathname: "/List", state: { date: this.state.date, startTime: this.state.startTime, endTime: this.state.endTime,isChange:"true" }}}
                        key="1" data-type="booking" >
                        <div className="um-list-item-inner pl15">
                            <div className="um-list-item-body">
                                <h3 className="um-media-heading um-blue">{this.state.name}（{this.state.capacity}人）</h3>
                                <p className="um-black">{this.state.location}</p>
                            </div>
                            <div className="um-list-item-right f14">
                                <p className="mr15">点击更换</p>
                                <p className="mr15 um-red">{this.state.price} 元/小 时</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>


            <Person getAttendants={this.getAttendants} />

            <div className={BookingStyle.bookingPerson}>
                <div className="um-input-text">
                    <span className="um-input-left" style={{
                        width: "23%",
                        fontSize: "large", textAlign: "center", display: "block", lineHeight: "50px"
                    }}>会议人数:</span>
                    <input type="" placeholder="请输入会议总人数" id="inputCount" className="form-control" style={{ fontSize: "15px" }} />
                </div>
            </div>

            <div className={BookingStyle.bookingRemark}>
                <div className="um-input-text">
                    <span className="um-input-left" style={{
                        width: "23%",
                        fontSize: "large", textAlign: "center", display: "block"
                    }}>备注信息:</span>
                    <textarea name="a" type="hidden" id="inputRemark" placeholder="请输入会议备注信息(限100字)" maxLength={100} className={BookingStyle.bookingTextarea}></textarea>
                </div>
            </div>

            <div className={BookingStyle.bookingLocation}>
                <button className="um-btn" style={{ width: "90%", marginLeft: "5%" }} onClick={(e) => this.clickSearch(e)}>预定</button>
            </div>
            {/*
            <Button className={BookingStyle.bookingLocation}
                onClick={() =>
                    alert('MOLI', '确定预定吗?', [
                        { text: 'Cancel', onPress: () => console.log('cancel') },
                        { text: 'Ok', onPress: () => this.clickSearch(e) },
                    ])
                }
            >
                预订
            </Button>
             */}
            <div className={BookingStyle.bookingTop}>

            </div>
        </div>)
    }
}
export default Booking;
