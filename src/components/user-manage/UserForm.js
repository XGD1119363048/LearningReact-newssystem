import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'

const UserForm = forwardRef((props, ref) => {
  const [isDisbaled, setIsDisbaled] = useState(false)
  // const [form] = Form.useForm();

  useEffect(() => {
    setIsDisbaled(props.isUpdateDisabled)
  }, [props.isUpdateDisabled])

  const {roleId, region} = JSON.parse(localStorage.getItem('token'))
  const roleObj = {
    '1': 'superadmin',
    '2': 'admin',
    '3': 'editor'
  }
  
  const checkRegionDisabled = (item) => {
    if (props.isUpdate) {
      if (roleObj[roleId] === 'superadmin') {
        return false
      } else {
        return true
      }
    } else {
      if (roleObj[roleId] === 'superadmin') {
        return false
      } else {
        return region !== item.value
      }
    }
  }

  const checkRoleDisabled = (item) => {
    if (props.isUpdate) {
      if (roleObj[roleId] === 'superadmin') {
        return false
      } else {
        return true
      }
    } else {
      if (roleObj[roleId] === 'superadmin') {
        return false
      } else {
        return roleObj[item.id] !== 'editor'
      }
    }
  }

  return (
    <Form
      // form={form}
      ref={ref}
      layout="vertical"
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={isDisbaled ? [] : [
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Select options={props.regionList.map(item => ({
          value: item.value,
          label: item.title,
          disabled: checkRegionDisabled(item)
        }))} disabled={isDisbaled} />
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Select options={props.roleList.map(item => ({
          value: item.id,
          label: item.roleName,
          disabled: checkRoleDisabled(item)
        }))} onChange={(value) => {
          if (value === 1) {
            setIsDisbaled(true)
            ref.current.setFieldValue('region', '')
            // form.setFieldValue('region', '')
          }
          else setIsDisbaled(false)
        }} />
      </Form.Item>
    </Form>
  )
})

export default UserForm
