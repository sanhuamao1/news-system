import React from 'react'
import { Tabs,Table ,Button} from 'antd';
import {getPublishList,publishNews,offlineNews} from '@/request/publish'


export default function PublishList() {
  const [list, setList] = React.useState([]);
  const [publishState, setPublishState] = React.useState(2);

  React.useEffect(() => {
    requirePublishList(publishState)
  }, [publishState]);

  const requirePublishList=async()=>{
    const res=await getPublishList({publishState})
    setList(res.data.data)
  }

  const handleOperation=async (type,id)=>{
      let res=type===1?await publishNews({id}):await offlineNews({id})
      if(res.data.status===200){
        requirePublishList()
      }
  }
  const columns=[
    {
        title: '标题',
        dataIndex: 'title',
        align:'center',
        render:(text,record)=><a href={`#/news-manage/preview/${record.id}`}>{text}</a>
    },
    {
        title: '作者',
        dataIndex: 'author_name',
        align:'center',
    },
    {
      title: '审核人',
      dataIndex: 'check_person',
      align:'center',
    },
    {
        title: '操作',
        key:'operation',
        align:'center',
        render:(text,record)=>{
          if(record.publish_state===2){return <Button type='primary' onClick={()=>{handleOperation(1,record.id)}}>发布</Button>}
          if(record.publish_state===3){return <Button type='primary' danger onClick={()=>{handleOperation(2,record.id)}}>下线</Button>}
          if(record.publish_state===4){return <Button type='primary' onClick={()=>{handleOperation(1,record.id)}}>重新上线</Button>}
        }
    },
  ]
  return  <div>
      <Tabs defaultActiveKey={publishState} onChange={(key)=>{setPublishState(key)}}>
        <Tabs.TabPane tab="待发布" key="2"/>
        <Tabs.TabPane tab="已发布" key="3"/>
        <Tabs.TabPane tab="已下线" key="4"/>
      </Tabs>
      <Table 
          key={publishState}
          rowKey={item=>item.id}
          columns={columns} 
          dataSource={list?list:[]} 
          pagination={false}
        />
  </div>
}