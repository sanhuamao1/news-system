import React from 'react'
import SideMenu from '../components/SideMenu'
import TopHeader from '../components/TopHeader'
import { Layout } from 'antd';
import Container from '../components/Container';
export default function Manage() {
  return (
    <Layout>
      <SideMenu/>
      <Layout className="site-layout">
        <TopHeader/>
        <Container/>
      </Layout>
    </Layout>
  )
}


