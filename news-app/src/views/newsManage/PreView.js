import React,{useState,useEffect, useRef} from 'react'
import { useParams } from 'react-router-dom';
import {getNewsDetail} from '@/request/news'
import { PageHeader, Tag, Descriptions } from 'antd';
import NewsStore from '@/tstore/newsStore';

export default function PreView() {
    const [newsInfo, setNewsInfo] = useState({});
    const {current:id}=useRef(useParams().id)

    

    useEffect(() => {
        requireNewsDetail(id)
    }, []);

    const requireNewsDetail=async(id)=>{
        const res=await getNewsDetail({id})
        if(res.data.status===200){
            setNewsInfo(res.data.data)
        }
    }

    return (
        <div>
            {JSON.stringify(newsInfo)!=="{}"&&<PageHeader
                onBack={() => window.history.back()}
                title="返回"
                // subTitle={<Tag color={NewsStore.sortColor[newsInfo.sort_id]}>{NewsStore.sortList[newsInfo.sort_id]}</Tag>}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="标题">{newsInfo.title}</Descriptions.Item>
                    <Descriptions.Item label="作者">{newsInfo.author_name}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{newsInfo.create_time.replace("T", ' ').replace(".000Z","")}</Descriptions.Item>
                    <Descriptions.Item label="类别">
                        <Tag color={NewsStore.sortColor[newsInfo.sort_id]}>{NewsStore.sortList[newsInfo.sort_id]}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="审核状态">
                        <span style={{color:NewsStore.c_color[newsInfo.check_state]}}>{NewsStore.c_state[newsInfo.check_state]}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="发布状态">
                        <span style={{color:NewsStore.p_color[newsInfo.publish_state]}}>{NewsStore.p_state[newsInfo.publish_state]}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="访问量">{newsInfo.view}</Descriptions.Item>
                    <Descriptions.Item label="点赞量">{newsInfo.star}</Descriptions.Item>
                    <Descriptions.Item label="评论量">{newsInfo.comment}</Descriptions.Item>
                </Descriptions>
            </PageHeader>}
            <div 
                style={{margin:'16px 24px',border:'1px solid #E6E6E6',padding:'1em',borderRadius:'4px'}} 
                dangerouslySetInnerHTML={{__html:newsInfo.content}}
            >
                
            </div>
        </div>
    )
}