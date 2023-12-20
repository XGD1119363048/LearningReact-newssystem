import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@ant-design/pro-layout'
import { Button, Form, Input, Select, Steps, message, notification } from 'antd'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor'

import style from './News.module.css'

export default function NewsAdd() {
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])

  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState('')

  const newsForm = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/categories').then(res => {
      setCategoryList(res.data.map(item => ({
        value: item.id,
        label: item.title
      })))
    })
  }, [])

  const handleNext = () => {
    if (current === 0) {
      newsForm.current.validateFields().then(values => {
        setFormInfo(values)
        setCurrent(current + 1)
      }).catch(err => {
        console.log(err)
      })
    } else {
      // console.log(content)
      if (content === '' || content.trim() === '<p></p>') {
        message.error('新闻内容不能为空')
      } else {
        setCurrent(current + 1)
      }
    }
  }
  const handlePrevious = () => {
    setCurrent(current - 1)
  }

  const handleSave = (auditState) => {
    const user = JSON.parse(localStorage.getItem('token'))
    axios.post('/news', {
      ...formInfo,
      content: content,
      region: user.region || '全球',
      author: user.username,
      roleId: user.roleId,
      auditState: auditState,
      publishState: 0,
      createTime: Date.now(),
      star: 0,
      view: 0,
      // publishTime: 0
    }).then(res => {
      navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
      notification.open({
        message: '通知',
        description:
          `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
        placement: 'bottomRight'
      });
    })
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
        <div className={current === 1 ? '' : style.hidden}>
          <NewsEditor getContent={(value) => {
            setContent(value)
          }} />
        </div>
        <div className={current === 2 ? '' : style.hidden}></div>
      </div>

      <div style={{ marginTop: '50px' }}>
        {
          current === 2 && <span>
            <Button type='primary' onClick={() => handleSave(0)}>保存草稿箱</Button>
            <Button danger onClick={() => handleSave(1)}>提交审核</Button>
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
