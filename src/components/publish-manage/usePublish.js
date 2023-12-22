import axios from "axios"
import { useEffect, useState } from "react"

function usePublish(type) {
  const [dataSource, setDataSource] = useState([])
  const {username} = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [username, type])
  return {
    dataSource
  }
}

export default usePublish
