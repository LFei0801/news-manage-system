import React from "react";
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Dropdown, Menu, Avatar } from "antd";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { CHANGE_COLLAPSED } from "../redux/const";
import { meunList } from "../config/menu-list";

const { Header } = Layout;

function TopHeader({ isCollapsed, history, toggleCollasped, location: { pathname } }) {
  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem("token"));

  const menu = (
    <Menu>
      <Menu.Item key="0">{roleName}</Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="1"
        danger
        onClick={() => {
          history.replace("/login");
          localStorage.removeItem("token");
        }}
      >
        退出
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="site-layout-background" style={{ padding: "0 24px" }}>
      {/* 折叠按钮 */}
      {isCollapsed ? (
        <MenuUnfoldOutlined onClick={() => toggleCollasped(false)} />
      ) : (
        <MenuFoldOutlined onClick={() => toggleCollasped(true)} />
      )}
      <strong style={{ marginLeft: 20 }}>
        {meunList[pathname] !== undefined
          ? meunList[pathname]
          : pathname.includes("/news-manage/preview")
          ? "新闻预览"
          : "更新新闻"}
      </strong>
      {/* 用户信息面板 */}
      <div style={{ float: "right" }}>
        <span style={{ marginRight: 5 }}>欢迎回来</span>
        <span style={{ marginRight: 10, color: "#1890FF" }}>{username}</span>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Avatar style={{ backgroundColor: "#f56a00" }} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}

const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => ({
  isCollapsed,
});

const mapDispatchToProps = {
  toggleCollasped(isCollapsed) {
    return { type: CHANGE_COLLAPSED, isCollapsed };
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader));
