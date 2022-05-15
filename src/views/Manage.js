import React,{useEffect} from 'react'
import SideMenu from '../components/SideMenu'
import TopHeader from '../components/TopHeader'
import { Layout } from 'antd';
import Container from '../components/Container';
// import NProgress from 'nprogress';
// import 'nprogress/nprogress.css'
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


