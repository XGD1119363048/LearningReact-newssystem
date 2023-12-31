import { Button, Form, Input, Modal, Table } from 'antd';
import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'

const { confirm } = Modal

export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get('/categories').then(res => {
      setDataSource(res.data)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      key: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave,
      }),
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
        </div>
      }
    }
  ];

  const handleSave = (record) => {
    axios.patch(`/categories/${record.id}`, {
      title: record.title,
      value: record.title
    }).then(_ => {
      setDataSource(dataSource.map(item => {
        if (item.id === record.id) {
          return {
            id: item.id,
            title: record.title,
            value: record.title
          }
        }
        return item
      }))
    })
  };

  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      onOk() {
        // console.log('OK');
        deleteMethod(item)
      },
      onCancel() {
        // console.log('Cancel');
      },
    })
  }

  const deleteMethod = (item) => {
    // console.log(item)
    // 当前页面同步状态 + 后端同步
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/categories/${item.id}`)
  }

  const EditableContext = React.createContext(null);

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{
        pageSize: 5
      }} rowKey={item => item.id} components={{
        body: {
          row: EditableRow,
          cell: EditableCell
        }
      }} />
    </div>
  )
}
