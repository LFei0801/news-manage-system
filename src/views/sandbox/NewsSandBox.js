import React, { useEffect } from "react";
import SideMenu from "../../components/SideMenu";
import TopHeader from "../../components/TopHeader";
import SandBoxRouter from "../../router/SandBoxRouter";
import Nprogress from "nprogress";
import "./sandBox.css";
import "nprogress/nprogress.css";

// antd
import { Layout } from "antd";
const { Content } = Layout;

export default function NewsSandBox() {
  // 顶部进度条
  Nprogress.start();
  useEffect(() => {
    Nprogress.done();
  });

  return (
    <Layout style={{ width: "100%", height: "100%" }}>
      <SideMenu />
      <Layout className="site-layout">
        <TopHeader />
        <Content
          className="site-layout-background"
          style={{
            margin: "16px 16px",
            padding: 20,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          {/* 路由 */}
          <SandBoxRouter />
        </Content>
      </Layout>
    </Layout>
  );
}
