import React from 'react'
// import axios from 'axios'
import { Button } from 'antd'

export default function Home() {
  return (
    <div>
      <Button type='primary' onClick={() => {
        // axios.get('http://localhost:8000/posts').then(res => {
        //   console.log(res)
        // })

        // axios.post('http://localhost:8000/posts', {
        //   title: '22222',
        //   author: 'xgd'
        // })

        // axios.get('http://localhost:8000/posts?_embed=comments').then(res => {
        //   console.log(res.data)
        // })

        // axios.get('http://localhost:8000/comments?_expand=post').then(res => {
        //   console.log(res.data)
        // })
      }}>Button</Button>
    </div>
  )
}
