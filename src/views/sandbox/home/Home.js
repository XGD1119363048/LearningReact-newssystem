import React, { useEffect, useState } from 'react'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { Avatar, Card, Col, List, Row } from 'antd'
const { Meta } = Card;

export default function Home() {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
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

  const {username, region, role: {roleName}} = JSON.parse(localStorage.getItem('token'))
  
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
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
              title={username}
              description={<div>
                <b>{region || '全球'}</b>
                <span style={{paddingLeft: '30px'}}>{roleName}</span>
              </div>}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
