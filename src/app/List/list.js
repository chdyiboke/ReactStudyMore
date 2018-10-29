import React, { Component } from 'react';
import ListStyle from './list.css';
import {
	HashRouter as Router,
	Route,
	Link,
	Switch
} from 'react-router-dom';
import { NavBar, Toast, SwipeAction } from 'antd-mobile';
import Moli from '../../assets/js/moli.common.js';

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

const addTime1 = now.getHours()+1;
const addTime2 = now.getHours()+2;
//30  60 整半点显示    IOS 获取有问题 yyyy/MM/dd 解决
const startTime = new Date(now.format("yyyy/MM/dd ")+addTime1+":00:00");
const endTime = new Date(now.format("yyyy/MM/dd ")+addTime2+":00:00");

class List extends React.Component {

	constructor(props) {
		super(props);
		let data = this.props.history.location.state;
        if(data){
            this.state = {
				date: data.date,
				startTime: data.startTime,
				endTime: data.endTime,
				isChange: data.isChange,
				todoList:[]
			};
		}else{
			this.state = {
				date: now,
				startTime: startTime,
				endTime: endTime,
				isChange: '',
				todoList:[]
			};
		}
		

	};
	goBack = () => {
				this.props.history.replace({
					pathname: '/SearchRoom'
				})	
	}
	componentDidMount = () => {
		console.log(this);
		this.init();

	};
	componentWillUnmount = () => {
		this.setState = (state, callback) => {
			return;
		};
	};
	init = () => {
		let self = this;
		let data;
		Toast.loading('Loading...', 5, () => {
			Toast.offline('请求超时', 1);
		});
		
		let param = {
			qDate: this.state.date.format("yyyy-MM-dd"),
			qStartTime: this.state.startTime.format("hh:mm"),
			qEndTime: this.state.endTime.format("hh:mm")
		};

		moli.ajaxRequest({
			type: 'post',
			url: "/meeting/getMeetingRooms",
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
	render() {
		let listDom = this.state.todoList.map((e, i) => {
			if (e.available == "1") {
				return (
					<SwipeAction
						key={i}
						autoClose
					>
						<Link to={{
							pathname: "/booking", state: {
								name: e.name, location: e.location, price: e.price, id: e.id, capacity: e.capacity,
								date: this.state.date, startTime: this.state.startTime, endTime: this.state.endTime
							}
						}}
							key="1" data-type="booking" >
							<div className="um-list-item-inner pl15">
								<div className="um-list-item-body">
									<h3 className="um-media-heading um-blue">{e.name}（{e.capacity}人）</h3>
									<p className="um-black">{e.location}</p>
								</div>
								<div className="um-list-item-right f14">
									<p className="mr15">{this.state.isChange=="true"?"选择更换":"点击预定"}</p>
									<p className="mr15 um-red">{e.price} 元/小 时</p>
								</div>
							</div>

						</Link>
					</SwipeAction>
				)
			}
			else {
				return (
					<SwipeAction
						key={i}
						autoClose
					>
						<div className="um-list-item-inner pl15">
							<div className="um-list-item-body">
								<h3 className="um-media-heading">{e.name}（{e.capacity}人）</h3>
								<p className="um-black">{e.location}</p>
							</div>
							<div className="um-list-item-right f14">
								<p className="mr15">已被预定</p>
								<p className="mr15">{e.price} 元/小 时</p>
							</div>
						</div>
					</SwipeAction>
				)
			}
		});
	
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
						{ this.state.isChange=="true" ? "更换会议室" : "会议室列表" }
                    				</NavBar>
				</div>
				<div className="um-list">
					{listDom}
				</div>
			</div>
		);
	};
};
export default List;
