import React, { useEffect, useRef, useState } from 'react'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import * as echarts from 'echarts'
import _ from 'lodash'
import { Avatar, Card, Col, Drawer, List, Row } from 'antd'
const { Meta } = Card;

export default function Home() {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [open, setOpen] = useState(false)
  const [pieChart, setPieChart] = useState(null)
  const [allList, setAllList] = useState([])
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res => {
      setViewList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res => {
      setStarList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then(res => {
      renderBarView(_.groupBy(res.data, item => item.category.title))
      setAllList(res.data)
    })
    return () => {
      window.onresize = null
    }
  }, [])

  const barRef = useRef()
  const pieRef = useRef()

  const renderBarView = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: '45',
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    window.onresize = () => {
      // console.log('resize')
      myChart.resize()
    }
  }

  const renderPieView = () => {
    // 数据处理
    let currentList = allList.filter(item => item.author === username)
    let groupObj = _.groupBy(currentList, item => item.category.title)

    let list = []
    for(let key in groupObj) {
      list.push({
        name: key,
        value: groupObj[key].length
      })
    }

    // 基于准备好的dom，初始化echarts实例
    var myChart
    if (!pieChart) {
      myChart = echarts.init(pieRef.current)
      setPieChart(myChart)
    } else {
      myChart = pieChart
    }

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '当前用户新闻分类图示',
        // subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }

  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览">
            <List
              size="small"
              dataSource={viewList}
              renderItem={(item) => <List.Item>
                <NavLink to={`/news-manage/preview/${item.id}`}>{item.title}</NavLink>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多">
            <List
              size="small"
              dataSource={starList}
              renderItem={(item) => <List.Item>
                <NavLink to={`/news-manage/preview/${item.id}`}>{item.title}</NavLink>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={() => {
                setTimeout(() => {
                  setOpen(true)
                  renderPieView()
                })
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
              title={username}
              description={<div>
                <b>{region || '全球'}</b>
                <span style={{ paddingLeft: '30px' }}>{roleName}</span>
              </div>}
            />
          </Card>
        </Col>
      </Row>

      <div ref={barRef} style={{
        width: '100%',
        height: '400px',
        marginTop: '30px'
      }} />

      <Drawer title="个人新闻分类" placement="right" width='500px' onClose={() => setOpen(false)} open={open}>
        <div ref={pieRef} style={{
          width: '100%',
          height: '400px',
          marginTop: '30px'
        }} />
      </Drawer>
    </div>
  )
}
