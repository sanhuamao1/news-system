import React,{useEffect,useState} from 'react'
import { Form, Input,Select,Button, message,notification  } from 'antd';
import { CheckOutlined,ArrowLeftOutlined } from '@ant-design/icons';
import {getNewsSort,createNews,getNewsDetail,updateDraft} from '@/request/news'
import EditBox from './EditBox';
import {  useParams } from 'react-router-dom';
import moment from 'moment';

export default function DraftEdit() {
    const params=useParams()
    const [sortOptions, setsortOptions] = useState([]); //分类选项
    const [content, setContent] = useState("");//新闻内容
    const [checkState, setCheckState] = useState("")
    const [form]=Form.useForm()

    useEffect(() => {
        requiredNewsSort()
    }, []);

    //编辑状态
    useEffect(()=>{
        if(params.id!==undefined){
            requireNewsDetail(params.id)
        }
    },[params])

    //编辑状态初始化
    const requireNewsDetail=async(id)=>{
        const res=await getNewsDetail({id})
        if(res.data.status===200){
            const data=res.data.data
            setContent(data.content)
            if(data.check_state!==1){setCheckState(data.check_state)}//重置state
            form.setFieldsValue({
                "title":data.title,
                "sort_id":data.sort_id,
            })
        }
    }

    //获取新闻类别
    const requiredNewsSort=async ()=>{
        const res=await getNewsSort()
        setsortOptions(res.data.data)
    }

    //提交内容
    const handleSubmit=async (type)=>{
        if(content===""||content.trim()==="<p><br></p>"||content.trim()==="<p></p>"){
            return message.error('请输入内容！')
        }

        // 基本信息
        let info={
            title:form.getFieldValue('title'),
            sort_id:form.getFieldValue('sort_id'),
            content,
            update_time:moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            check_state:checkState?checkState:type
        }
        // 创建与更新
        const res=params.id===undefined?
            await createNews({...info,create_time:moment(new Date()).format('YYYY-MM-DD hh:mm:ss')}):
            await updateDraft({...info,id:params.id})

       if(res.data.status===200){
            if(params.id===undefined){
                setContent("")
                form.resetFields()
            }
                
            notification.open({
                message: type===1?'保存成功':'提交成功',
                description:`您可以在${type===1?'草稿箱':'审核列表'}中查看该条记录`,
                icon:<CheckOutlined style={{ color: '#39A945' }}/>,
                placement:'bottomRight'
            });
       }
    }

    
    return (
        <div>
            <p style={{marginBottom:'2em',fontSize: '18px',cursor:'pointer'}}>
                {params.id!==undefined&&<ArrowLeftOutlined style={{marginRight:'1em'}} onClick={()=>{window.history.back()}}/>}
                <span>{params.id!==undefined?'更新新闻':'撰写新闻'}</span>
            </p>
            <Form form={form} initialValues={{sort_id:1}}  labelCol={{span: 2}} >
                <Form.Item label="新闻标题" name="title" rules={[{ required: true }]}>
                    <Input/>
                </Form.Item>
                <Form.Item label="新闻类别" name="sort_id">
                    <Select>
                        { sortOptions.map(item=>
                            <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                        )}
                    </Select>
                </Form.Item>
                <Form.Item label="新闻内容">
                    <EditBox done={(values)=>{setContent(values)}} content={content}/>
                    <div style={{marginTop:'1em'}}>
                        {checkState===''&&<Button size="large" type="primary" onClick={()=>{handleSubmit(1)}} style={{marginRight:'1em'}}>保存到草稿箱</Button>}
                        <Button size="large" type="primary" onClick={()=>{handleSubmit(2)}}>提交审核</Button>
                    </div>
                    
                </Form.Item>
            </Form>
        </div>
    )
}


