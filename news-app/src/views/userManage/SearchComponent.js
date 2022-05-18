
import { Form, Input, Select,Button} from 'antd';
import AdminStore from '@/tstore/adminStore'
import { observer } from 'mobx-react';
import { useStores } from '@/tstore/useStores'

const SearchComponent=observer(({search,addUser})=>{
    const {UserStore}=useStores()

    return (
        <Form layout="inline" style={{marginBottom:'1em'}} onFinish={search} initialValues={{
            character_id:0,
        }}>
            <Form.Item label="用户名" name="username">
                <Input/>
            </Form.Item>
            <Form.Item label="邮箱" name="email">
                <Input/>
            </Form.Item>
            <Form.Item label="角色" name="character_id" style={{width:'220px'}}>
                <Select>
                    {
                        [{id:0,name:'全部'},...UserStore.characterOptions].map(item=>
                            <Select.Option value={item.id} key={item.name}>{item.name}</Select.Option>
                        )
                    }
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    查询
                </Button>
                {
                    AdminStore.modules.operations.includes('userAdd')?
                    <Button type="primary" style={{marginLeft:'1em'}} onClick={addUser}>
                        添加用户
                    </Button>:''
                }
            </Form.Item>
        </Form>
    )
   
})
  
  
export default SearchComponent