import React, { useEffect, useRef, useState } from 'react'
import { PageHeader } from '@ant-design/pro-layout'
import { Button, Form, Input, Select, Steps } from 'antd'
import axios from 'axios'

import style from './News.module.css'

export default function NewsAdd() {
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])

  const newsForm = useRef(null)

  useEffect(() => {
    axios.get('/categories').then(res => {
      setCategoryList(res.data.map(item => ({
        value: item.id,
        label: item.title
      })))
    })
  }, [])
  

  const handleNext = () => {
    newsForm.current.validateFields().then(values => {
      console.log(values)
      setCurrent(current + 1)
    }).catch(err => {
      console.log(err)
    })
    
  }
  const handlePrevious = () => {
    setCurrent(current - 1)
  }

  return (
    <div>
      <PageHeader
        className='site-page-header'
        title='撰写新闻'
      />
      <Steps
        current={current}
        items={[
          { title: '基本信息', description: '新闻标题，新闻分类' },
          { title: '新闻内容', description: '新闻主题内容' },
          { title: '新闻提交', description: '保存草稿或者提交审核' },
        ]}
      />
      <div style={{marginTop: '50px'}}>
        <div className={current === 0 ? '' : style.hidden}>
          <Form
            ref={newsForm}
            name="basic"
            labelCol={{
              span: 2,
            }}
            wrapperCol={{
              span: 22,
            }}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: 'Please input your title!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="category"
              rules={[
                {
                  required: true,
                  message: 'Please select your category!',
                },
              ]}
            >
              <Select options={categoryList} />
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? '' : style.hidden}>222</div>
        <div className={current === 2 ? '' : style.hidden}>333</div>
      </div>

      <div style={{ marginTop: '50px' }}>
        {
          current === 2 && <span>
            <Button type='primary'>保存草稿箱</Button>
            <Button danger>提交审核</Button>
          </span>
        }
        {
          current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>
        }
        {
          current > 0 && <Button onClick={handlePrevious}>上一步</Button>
        }
      </div>
    </div>
  )
}
