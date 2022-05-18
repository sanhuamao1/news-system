import React,{useState,useEffect,useRef} from 'react'
import {getCheckList,drawbackCheck,submitDraft,getCheckHistory} from '@/request/news'
import {Table,Tag,Button,Tooltip,notification,Drawer,Timeline } from 'antd';
import NewsStore from '@/tstore/newsStore';
import { CheckOutlined,RollbackOutlined,EditOutlined,ContainerOutlined,InfoOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


export default function CheckList() {
    const [checkList, setCheckList] = useState([]);

    const {current:pageSize}=useRef(5)
    const [currentPage, setcurrentPage] = useState(1)
    const [total, settotal] = useState(0);

    const navigate=useNavigate()

    const [drawVisible, setDrawVisible] = useState(false);
    const [history, setHistory] = useState([]);
    //审核列表
    const requireCheckList=(params)=>{
        getCheckList(params).then(res=>{
            if(res.data.status===200){
                setCheckList(res.data.data)
                if(total!==res.data.total){settotal(res.data.total)}
            }
        })
    }

    //撤回
    const handleDrawbackCheck=async (id)=>{
        const res=await drawbackCheck({id})
        if(res.data.status===200){
            requireCheckList({currentPage:1,pageSize})
            notification.open({
                message: '成功撤销',
                description:`您可以在草稿箱中查看该条记录`,
                icon:<CheckOutlined style={{ color: '#39A945' }}/>,
                placement:'bottomRight'
            });
        }
    }

    //重新提交
    const handleSubmit=async (id)=>{
        const res=await submitDraft({id})
        if(res.data.status===200){
            requireCheckList({currentPage:1,pageSize})
            notification.open({
                message: '成功提交！',
                description:`您可以在审核列表中查看审核进度`,
                icon:<CheckOutlined style={{ color: '#39A945' }}/>,
                placement:'bottomRight'
            });
        }
    }

    const requireCheckHistory=async(id)=>{
        const res=await getCheckHistory({id})
        setHistory(res.data.data)
        setDrawVisible(true)
    }
    useEffect(() => {
        requireCheckList({currentPage,pageSize})
    }, [currentPage]);

    const columns=[
        {
            title: '标题',
            dataIndex: 'title',
            align:'center',
            render:(text,record)=><a href={`#/news-manage/preview/${record.id}`}>{text}</a>
        },
        {
            title: '类别',
            dataIndex: 'sort_id',
            align:'center',
            render:text=><Tag color={NewsStore.sortColor[text]}>{NewsStore.sortList[text]}</Tag>
        },
        {
            title: '状态',
            dataIndex: 'check_state',
            align:'center',
            render:text=><Tag color={NewsStore.c_color[text]}>{NewsStore.c_state[text]}</Tag>
        },
        {
            title: '审核时间',
            dataIndex: 'check_time',
            align:'center',
            render:text=><span>{text?text:'/'}</span>
        },
        {
            title: '操作',
            key:'operation',
            dataIndex: 'check_state',
            align:'center',
            render:(text,record)=>{
                if(text===2){return <span>
                        <Tooltip title="撤销回草稿箱">
                            <Button shape="circle" danger icon={<RollbackOutlined />} onClick={()=>{handleDrawbackCheck(record.id)}} style={{marginRight:'1em'}}/>
                        </Tooltip>
                        <Tooltip title="查看审核记录" onClick={()=>{requireCheckHistory(record.id)}}>
                            <Button shape="circle" icon={<InfoOutlined />}/>
                        </Tooltip>
                    </span>
                    
                }
                if(text===3){
                    return <Tooltip title="查看审核记录">
                        <Button shape="circle" icon={<InfoOutlined />} onClick={()=>{requireCheckHistory(record.id)}}/>
                    </Tooltip>
                }
                if(text===4){return  <span>
                        <Tooltip title="修改">
                            <Button shape="circle" type='primary' icon={<EditOutlined />} onClick={()=>{navigate(`/news-manage/draft/${record.id}`)}} style={{marginRight:'1em'}}/>
                        </Tooltip>
                        <Tooltip title="重新提交">
                            <Button shape="circle" icon={<ContainerOutlined />} onClick={()=>{handleSubmit(record.id)}} style={{marginRight:'1em'}}/>
                        </Tooltip>
                        <Tooltip title="查看审核记录">
                            <Button shape="circle" icon={<InfoOutlined />} onClick={()=>{requireCheckHistory(record.id)}}/>
                        </Tooltip>
                    </span>
                }
                if(text===4){return '/' }
            }
        },
    ]
    return (
        <div>
            <Table 
                rowKey={item=>item.id}
                columns={columns} 
                dataSource={checkList?checkList:[]} 
                pagination={{
                    pageSize,
                    current:currentPage,
                    total,
                    onChange:(value)=>{setcurrentPage(value)}
                }}
            />
            <Drawer
                title="审核记录"
                placement="left"
                closable={false}
                onClose={()=>{setDrawVisible(false)}}
                visible={drawVisible}
            >
                 <Timeline mode="left">
                     {history?.map(item=><Timeline.Item label={`${item.submit_time}`} color={item.check_result===1?'green':'red'} key={item.id}>
                        <p>
                            <span style={{color:'#2db7f5'}}>{item.check_person} </span>
                            <span>于 {item.check_time} {item.check_result===1?'审核通过':'驳回'}</span>
                        </p>
                        {
                            item.check_comment&&<p>理由：{item.check_comment}  </p>
                        }
                     </Timeline.Item>
                    )}
                </Timeline>
            </Drawer>
        </div>
    )
}

