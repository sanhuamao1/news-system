
import { Form, Input, Select,Button} from 'antd';
import {AdminStore,UserStore} from '../../store/index';
const SearchComponent=({search,addUser})=>(
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
                    UserStore.characterSearchOptions?.map(item=>
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
  
  
export default SearchComponent