import { Table } from 'antd';
import React from 'react'
import { NavLink } from 'react-router-dom';

export default function NewsPublish(props) {
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      key: 'title',
      render: (title, item) => {
        return <NavLink to={`/news-manage/preview/${item.id}`}>{title}</NavLink>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category.title
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {props.button(item.id)}
        </div>
      }
    }
  ];

  return (
    <div>
      <Table dataSource={props.dataSource} columns={columns} pagination={{
        pageSize: 5
      }} rowKey={item => item.id} />
    </div>
  )
}
