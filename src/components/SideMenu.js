import React, { useEffect, useState } from "react";
import axios from "axios";
import { menuIconList } from "../config/menu-icon-list";
import { connect } from "react-redux";
// antd
import { Layout, Menu } from "antd";
import { withRouter } from "react-router";

const { Sider } = Layout;
const { SubMenu } = Menu;

function SideMenu({ history, location, isCollapsed }) {
  const [menu, setMenu] = useState([]);
  const selectKey = location.pathname;
  const openKeys = "/" + selectKey.split("/")[1];
  // 加载菜单项
  useEffect(() => {
    const getMenu = async () => {
      try {
        const response = await axios.get("/rights?_embed=children");
        const menuData = response.data;
        setMenu(() => menuData);
      } catch (error) {
        console.log(error);
      }
    };
    getMenu();
  }, []);

  // 获取用户权限列表
  const user = JSON.parse(localStorage.getItem("token"));
  const {
    role: { rights },
  } = user;

  // 检测用户权限
  const checkPagepermisson = (item) => {
    return item.pagepermisson && rights.includes(item.key);
  };
  // 渲染菜单
  const renderMenu = (menudata) =>
    menudata.map((menu) => {
      if (menu.children?.length > 0 && checkPagepermisson(menu)) {
        return (
          <SubMenu
            key={menu.key}
            icon={menuIconList[menu.key]}
            title={menu.title}
          >
            {renderMenu(menu.children)}
          </SubMenu>
        );
      } else if (checkPagepermisson(menu)) {
        return (
          <Menu.Item
            key={menu.key}
            icon={menuIconList[menu.key]}
            onClick={() => {
              history.push(menu.key);
            }}
          >
            {menu.title}
          </Menu.Item>
        );
      } else {
        return null;
      }
    });

  //UI
  return (
    <Sider trigger={null} collapsible collapsed={isCollapsed}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {!isCollapsed && <div className="logo">新闻管理系统</div>}
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectKey]}
            defaultOpenKeys={[openKeys]}
          >
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  );
}

const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => ({
  isCollapsed,
});

export default connect(mapStateToProps)(withRouter(SideMenu));
