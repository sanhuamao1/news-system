import React,{useState,useEffect,useRef} from 'react'
import {getCheckListForManager,agreeCheck,opposeCheck} from '@/request/news'
import {Table,Tag,Tooltip,Input,Modal,Form  } from 'antd';
import { NewsStore} from '@/store';
import { CheckCircleFilled,CloseCircleFilled} from '@ant-design/icons';


export default function CheckManage() {
    const [checkList, setCheckList] = useState([]);
    const [form]=Form.useForm()

    const {current:pageSize}=useRef(5)
    const [currentPage, setcurrentPage] = useState(1)
    const [total, settotal] = useState(0);

    const [visible, setVisible] = useState(false);
    const [info, setInfo] = useState({});

    

      //审核列表
    const requireCheckList=(params)=>{
        getCheckListForManager(params).then(res=>{
            if(res.data.status===200){
                setCheckList(res.data.data)
                if(total!==res.data.total){settotal(res.data.total)}
            }
        })
    }

    const handleOpen=(type,record)=>{
        form.resetFields()
        setInfo({
            title:type,
            latest_check_id:record.latest_check_id,
            id:record.id
        })
        setVisible(true)
    }

    const handleSubmit=async()=>{
        const data={
            ...info,
            check_comment:form.getFieldValue('check_comment')
        }
        const res=info.title==='通过'?await agreeCheck(data):await opposeCheck(data)
        if(res.data.status===200){
            setVisible(false)
            requireCheckList({currentPage:1,pageSize})
        }
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
            title: '作者',
            dataIndex: 'author_name',
            align:'center',
        },
        {
            title: '类别',
            dataIndex: 'sort_id',
            align:'center',
            render:text=><Tag color={NewsStore.sortColor[text]}>{NewsStore.sortList[text]}</Tag>
        },
        {
            title: '提交时间',
            dataIndex: 'submit_time',
            align:'center',
            render:text=><span>{text?text:'/'}</span>
        },
        {
            title: '操作',
            key:'operation',
            align:'center',
            render:(text,record)=> <span>
                <Tooltip title="通过">
                    <CheckCircleFilled style={{marginRight:'1em',color:'#f50',fontSize:'26px'}} onClick={()=>{handleOpen('通过',record)}}
                    />
                </Tooltip>
                <Tooltip title="驳回">
                    <CloseCircleFilled style={{color:'#87d068',fontSize:'26px'}} onClick={()=>{handleOpen('驳回',record)}}/>
                </Tooltip>
            </span>
            
        },
    ]
    return (
        <div>
            <Modal 
                title={info.title?info.title:''} 
                visible={visible} 
                okText="确定"
                cancelText="取消"
                onOk={handleSubmit} 
                onCancel={()=>{setVisible(false)}}
            >
                 <Form form={form}>
                    <Form.Item name="check_comment">
                        <Input.TextArea showCount maxLength={100} style={{ height: 120 }} placeholder="请输入审核理由..."/>
                    </Form.Item>
                </Form>
            </Modal>
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
        </div>
       
    )
}