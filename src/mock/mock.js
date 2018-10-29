import Mock from 'mockjs';

Mock.setup({
    timeout: '600'
});

Mock.mock('http://data/meetings', {
    'list|2-10': [{
        'roomName': '@first()',
        'startTime': '@date("2018-04-dd HH:mm:ss")',
        'roomLocation': '用友产业园中区',
        'roomPrice': '@integer(20,30)',
        'myBooking': '会议开始时间',
        'remark': '@ctitle(30)',
    }]
});
