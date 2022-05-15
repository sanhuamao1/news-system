import React,{useState,useRef,useEffect} from 'react'
import {Table,Tag,Button,Tooltip,Modal,notification } from 'antd';
import { NewsStore } from '@/store';
import {getDraftList,deleteDraft,submitDraft} from '@/request/news'
import { EditOutlined,DeleteFilled,ContainerOutlined,ExclamationCircleOutlined,CheckOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
export default function DratfList() {
    const [draftList, setDraftList] = useState([]);//草稿列表
    const {current:pageSize}=useRef(5)
    const [currentPage, setcurrentPage] = useState(1)
    const [total, settotal] = useState(0);
    const navigate=useNavigate()

    const requireDraftList=(params)=>{
        getDraftList(params).then(res=>{
            if(res.data.status===200){
                setDraftList(res.data.data)
                if(total!==res.data.total){settotal(res.data.total)}
            }
        })
    }

    useEffect(() => {
        requireDraftList({currentPage,pageSize})
    }, [currentPage]);

    const deleteRow=async (id)=>{
        Modal.confirm({
            title: '确定要删除吗？',
            icon: <ExclamationCircleOutlined />,
            cancelText:'取消',
            okText:'确定',
            async onOk() {
                const res=await deleteDraft({id})
                if(res.data.status===200){
                    requireDraftList({currentPage:1,pageSize})
                }
            },
        });
    }

    const submitRow=async (id)=>{
        const res=await submitDraft({id})
        if(res.data.status===200){
            requireDraftList({currentPage:1,pageSize})
            notification.open({
                message: '已提交审核',
                description:`您可以在新闻列表中查看审核进度`,
                icon:<CheckOutlined style={{ color: '#39A945' }}/>,
                placement:'bottomRight'
            });
        }
    }

    const columns=[
        {
            title: '标题',
            dataIndex: 'title',
            align:'center'
        },
        {
            title: '类别',
            dataIndex: 'sort_id',
            align:'center',
            render:text=><Tag color={NewsStore.sortColor[text]}>{NewsStore.sortList[text]}</Tag>
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            align:'center',
            render:text=><span>{text.replace("T", ' ').replace(".000Z","")}</span>
        },
        {
            title: '操作',
            key:'operation',
            align:'center',
            render:(text,record)=><span>
                <Tooltip title="编辑">
                    <Button shape="circle" icon={<EditOutlined />} onClick={()=>{navigate(`/news-manage/draft/${record.id}`)}} style={{marginRight:'1em'}}/>
                </Tooltip>
                <Tooltip title="提交审核">
                    <Button shape="circle" icon={<ContainerOutlined />} onClick={()=>{submitRow(record.id)}} style={{marginRight:'1em'}}/>
                </Tooltip>
                <Tooltip title="删除">
                    <Button danger shape="circle" icon={<DeleteFilled />} onClick={()=>{deleteRow(record.id)}}/>
                </Tooltip>
            </span>
        },
    ]

    return (
        <div>
            <Table 
                rowKey={item=>item.id}
                columns={columns} 
                dataSource={draftList?draftList:[]} 
                pagination={{
                    pageSize,
                    current:currentPage,
                    total,
                    onChange:(value)=>{setcurrentPage(value)}
                }}
            />
        </div>
    )
}
