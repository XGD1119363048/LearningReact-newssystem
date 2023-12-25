import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Layout, Button, theme, Dropdown, Avatar } from 'antd';
import { connect } from 'react-redux'

const { Header } = Layout;

function TopHeader(props) {
  // const [collapsed, setCollapsed] = useState(false)

  const navigate = useNavigate()

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const {role: {roleName}, username} = JSON.parse(localStorage.getItem('token'))

  const items = [
    {
      key: '1',
      label: roleName,
    },
    {
      key: '2',
      danger: true,
      label: '退出',
    },
  ];

  const changeCollapsed = () => {

  }

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <Button
        type="text"
        icon={props.isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => changeCollapsed()}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />

      <div style={{
        float: 'right'
      }}>
        <span>欢迎<span style={{color: '#1890ff'}}>{username}</span>回来</span>
        <Dropdown menu={{ items, onClick: ({ key }) => {
          if (key === '2') {
            localStorage.removeItem('token')
            navigate('/login', {
              replace: true
            })
          }
        } }}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = ({CollapsedReducer: {isCollapsed}}) => {
  return {
    isCollapsed
  }
}

export default connect(mapStateToProps)(TopHeader)
