import React, { Component } from 'react';
import SearchRoomStyle from './searchRoom.css';
import {Link} from 'react-router-dom';
import { NavBar, Toast, DatePicker, List } from 'antd-mobile';

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

const addTime1 = now.getHours()+1;
const addTime2 = now.getHours()+2;
//30  60 整半点显示    IOS 获取有问题 yyyy/MM/dd 解决
const startTime = new Date(now.format("yyyy/MM/dd ")+addTime1+":00:00");
const endTime = new Date(now.format("yyyy/MM/dd ")+addTime2+":00:00");

class SearchRoom extends React.Component {
	constructor() {
		super();
		this.state = {
			date: now,
			startTime: startTime,
			endTime: endTime,
			isChange: ""
		};
	};

	goBack = () => {
		this.props.history.replace({
			pathname: '/'
		})
	}
	render() {
		return (<div>
			<div className="navBar">
				<NavBar
				style={{ backgroundColor: "#f93333" }}
					mode="dark"
					leftContent={[<span key="0" className="iconfont icon-back"></span>]}
					rightContent={[

					]}
					onLeftClick={this.goBack}
				>
					会议室查询
						</NavBar>
			</div>
			<div>
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
					title={"开始时间"}
					// minDate={minDate}
					// maxDate={maxDate}
					minuteStep={30}
					value={this.state.startTime}
					onChange={startTime => this.setState({ startTime })}
				>
					<List.Item arrow="horizontal">开始时间</List.Item>
				</DatePicker>

				<DatePicker
					mode="time"
					// minDate={minDate}
					// maxDate={maxDate}
					title={"结束时间"}
					minuteStep={30}
					value={this.state.endTime}
					onChange={endTime => this.setState({ endTime })}
				>
					<List.Item arrow="horizontal">结束时间</List.Item>
				</DatePicker>

				<div className={SearchRoomStyle.searchRoom}>
					{/* 获取：this.props.history.location.state */}
					<Link to={{ pathname: "/List", state: { date: this.state.date, startTime: this.state.startTime, endTime: this.state.endTime,isChange:this.state.isChange } }} key="3" data-type="list" >
						<button className="btn" style={{ width: "90%", marginLeft: "5%" }}>搜索</button>
					</Link>
				</div>
			</div>

		</div>)
	}
}
export default SearchRoom
