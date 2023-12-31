import React, { useEffect, useState } from 'react'
import axios from 'axios'
import _ from 'lodash'
import { NavLink } from 'react-router-dom'

import { PageHeader } from '@ant-design/pro-layout'
import { Card, Col, List, Row } from 'antd'

export default function News() {
  const [list, setList] = useState([])
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then(res => {
      setList(Object.entries(_.groupBy(res.data, item => item.category.title)))
    })
  }, [])
  return (
    <div style={{
      width: '95%',
      margin: '0 auto'
    }}>
      <PageHeader
        className='site-page-header'
        title='全球大新闻'
        subTitle='查看新闻'
      />
      <Row gutter={[16, 16]}>
        {
          list.map(item => <Col key={item[0]} span={8}>
            <Card title={item[0]} hoverable>
              <List
                size='small'
                dataSource={item[1]}
                pagination={{
                  pageSize: 3
                }}
                renderItem={data => <List.Item>
                  <NavLink to={`/detail/${data.id}`}>{data.title}</NavLink>
                </List.Item>}
              />
            </Card>
          </Col>)
        }
      </Row>
    </div>
  )
}
