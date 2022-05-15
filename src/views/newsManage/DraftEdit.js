import React,{useEffect,useState} from 'react'
import { Form, Input,Select,Button, message,notification  } from 'antd';
import { CheckOutlined,ArrowLeftOutlined } from '@ant-design/icons';
import {getNewsSort,createNews,getNewsDetail,updateDraft} from '@/request/news'
import EditBox from './EditBox';
import {  useParams } from 'react-router-dom';

export default function DraftEdit() {
    const params=useParams()
    const [sortOptions, setsortOptions] = useState([]); //分类选项
    const [content, setContent] = useState("");//新闻内容
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
            console.log(data)
            setContent(data.content)
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
       const info={
            title:form.getFieldValue('title'),
            sort_id:form.getFieldValue('sort_id'),
            content,
            checkstate:type==='draft'?1:2,
       }

       let res
       if(params.id===undefined){
            res=await createNews(info)
       }else{
            info.id=params.id
            res=await updateDraft(info)
       }


       if(res.data.status===200){
            if(params.id===undefined){
                setContent("")
                form.resetFields()
            }
                
            notification.open({
                message: type==='draft'?'保存成功':'提交成功',
                description:`您可以在${type==='draft'?'草稿箱':'新闻列表'}中查看该条记录`,
                icon:<CheckOutlined style={{ color: '#39A945' }}/>,
                placement:'bottomRight'
            });
       }
    }

    
    return (
        <div>
            {params.id!==undefined&&
                <p onClick={()=>{window.history.back()}} style={{marginBottom:'2em',fontSize: '16px',cursor:'pointer'}}>
                    <ArrowLeftOutlined style={{marginRight:'1em'}}/>
                    <span>返回</span>
                </p>
            }
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
                        <Button size="large" type="primary" onClick={()=>{handleSubmit('draft')}} style={{marginRight:'1em'}}>保存到草稿箱</Button>
                        <Button size="large" type="primary" onClick={()=>{handleSubmit('submit')}}>提交审核</Button>
                    </div>
                    
                </Form.Item>
            </Form>
        </div>
    )
}


