import React from 'react'
import AdminStore from '@/tstore/adminStore'
import { observer } from 'mobx-react';
import SideMenu from '../components/SideMenu'
import TopHeader from '../components/TopHeader' 
import { Layout } from 'antd';
import Container from '../components/Container';
import {Spin} from 'antd'
export default observer(()=> {
  return (
    <Layout>
      <SideMenu/>
      <Layout className="site-layout">
        <TopHeader/>
        <Spin spinning={AdminStore.spining}>
          <Container/>
        </Spin>
       
      </Layout>
    </Layout>
  )
})


