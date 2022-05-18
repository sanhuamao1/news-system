import React from 'react'
import {Outlet} from 'react-router-dom' 
import { Layout } from 'antd';
const {Content}=Layout
export default function Container() {
  return (
    <Content className="site-layout-background"
        style={{
        margin: '24px 16px',
        padding: 24,
        minHeight: 280,
    }}>
        <Outlet></Outlet>
    </Content>
  )
}
