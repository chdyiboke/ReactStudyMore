import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import RoomInfoStyle from './roomInfo.css';
import {Link} from 'react-router-dom';
import { NavBar, DatePicker, List, Toast,SwipeAction } from 'antd-mobile';

class RoomInfo extends Component {
    constructor(props) {
        super(props);
        // 时间数据写入有问题：页面选择更新数据时
        let data = this.props.history.location.state;
        if(!data){
            this.goBack();
        }
        this.state = {
            theme: data.theme,
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            name: data.name,
            location: data.location,
            price: data.price,    //总价
            attendants:data.attendants?data.attendants:[],
            attendantCount: data.attendantCount?data.attendantCount:10,
            remark: data.remark?data.remark:"无备注信息。",
            todoList:[]
        };
    };

    componentDidMount = () => {
        this.init();
    };

    init = () => {
		let self = this;
		Toast.loading('Loading...', 2.5, () => {
			Toast.offline('请求超时', 1);
		});
		
		let param = {
			memberIds:this.state.attendants
		};

		moli.ajaxRequest({
			type: 'post',
			url: "/userlink/getMemberByIds",
			param: param
		}, function (ret) {
			Toast.hide();
			if(ret.flag ==0){
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
    
    goBack = () => {
            this.props.history.goBack();
    }

    render() {
        let listDom = this.state.todoList.map((e,i)=>{
            return ( <SwipeAction
                key={i}
                autoClose
            >
                 {/* <div>
                     <img src={e.avatar ? e.avatar : require('../../assets/img/def_user.png')} className={RoomInfoStyle.img} />
                                    <span>{e.userName}</span>
                </div> */}
                <li className="border" >
                    <div className={RoomInfoStyle.roomTop}>
                        <img src={e.avatar == 'null' ? require('../../assets/img/def_user.png') : e.avatar} />
                    </div>
                    <p>
                        {e.userName}
                    </p>
                </li>   
            </SwipeAction>)
        })
        return (<div style={{backgroundColor: "white"}}>
            <div className="navBar">
                <NavBar
                style={{ backgroundColor: "#f93333" }}
                    mode="dark"
                    leftContent={[<span key="0" className="iconfont icon-back"></span>]}
                    rightContent={[

                    ]}
                    onLeftClick={this.goBack}
                >
                    会议室信息
                    </NavBar>
            </div>
            {/* 主题、预定日期、开始时间、结束时间、会议室列表信息、参与人员、总人数、备注。 */}

                    <ul className="um-list">
        				<li>
        					<div className="um-list-item">
        						<div className="um-list-item-inner">
        							<div className="um-list-item-left" style={{fontSize: "large"}}>
                                    会议主题：
        							</div>
        							<div className="um-list-item-right">
        								<input type="text" value = {this.state.theme} disabled="disabled" className="form-control"  required/>
        							</div>
        						</div>
        					</div>
        				</li>
        				<li>
        					<div className="um-list-item">
        						<div className="um-list-item-inner">
        							<div className="um-list-item-left" style={{fontSize: "large"}}>
                                    预定日期：
        							</div>
        							<div className="um-list-item-right">
        								<input type="email" value = {this.state.date} disabled="disabled" className="form-control"  required/>
        							</div>
        						</div>
        					</div>
        				</li>
        				<li>
        					<div className="um-list-item">
        						<div className="um-list-item-inner">
        							<div className="um-list-item-left" style={{fontSize: "large"}}>
                                    开始时间：
        							</div>
        							<div className="um-list-item-right">
        								<input value = {this.state.startTime} disabled="disabled" className="form-control"  required/>
        							</div>
        						</div>
        					</div>
        				</li>
        				<li>
        					<div className="um-list-item">
        						<div className="um-list-item-inner">
        							<div className="um-list-item-left" style={{fontSize: "large"}}>
                                    结束时间：
        							</div>
        							<div className="um-list-item-right">
        								<input value = {this.state.endTime} disabled="disabled" className="form-control"  required />
        							</div>
        						</div>
        					</div>
        				</li>
                        <li>
        					<div className="um-list-item">
        						<div className="um-list-item-inner">
        							<div className="um-list-item-left" style={{fontSize: "large"}}>
                                    会议人数：
        							</div>
        							<div className="um-list-item-right">
        								<input value = {this.state.attendantCount} disabled="disabled" className="form-control"  required />
        							</div>
        						</div>
        					</div>
        				</li>
        			</ul>

            <div className="um-list">
                <div className={RoomInfoStyle.bookingOneList}>
                        <div className="um-list-item-inner pl15">
                            <div className="um-list-item-body">
                                <h3 className="um-media-heading um-blue">{this.state.name}</h3>
                                <p className="um-black">{this.state.location}</p>
                            </div>
                            <div className="um-list-item-right f14">
                                <p className="mr15">总价</p>
                                <p className="mr15 um-red">{this.state.price} 元</p>
                            </div>
                        </div>
                </div>
            </div>

            <div className="member" style={{ marginTop: "10px" }}>
                <p className="title pl10">
                    会议人员:
                </p>
                
                <div className="um-list">
                    <div className={RoomInfoStyle.addressList}>
                        <ul>
                            {listDom}
                        </ul>
                    </div>
                </div>
                

            </div>

            <div className={RoomInfoStyle.bookingRemark}>
                <div className="um-input-text">
                    <span className="um-input-left" style={{
                        width: "23%",
                        fontSize: "large", textAlign: "center", display: "block"
                    }}>备注信息:</span>
                    <textarea name="a" value = {this.state.remark} type="hidden" id="inputRemark" className={RoomInfoStyle.bookingTextarea}></textarea>
                </div>
            </div>

            <div className={RoomInfoStyle.bookingLocation}>
                <Link to='/MyRoom' key="2" data-type="homePage" >
                    <button className="um-btn" style={{ width: "90%", marginLeft: "5%" }} >我知道了</button>
                </Link>
            </div>
           
            <div className={RoomInfoStyle.bookingTop}>

            </div>
        </div>)
    }
}
export default RoomInfo;
