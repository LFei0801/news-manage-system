import axios from "axios";
import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router";
import { Spin } from "antd";
import { connect } from "react-redux";
// 自定义组件
import NotFound from "../components/NotFound";
import Audit from "../views/sandbox/audit-manage/Audit";
import AuditList from "../views/sandbox/audit-manage/AuditList";
import Home from "../views/sandbox/home/Home";
import AddNews from "../views/sandbox/news-manage/AddNews";
import NewsCategary from "../views/sandbox/news-manage/NewsCategary";
import NewsDraft from "../views/sandbox/news-manage/NewsDraft";
import NewsPreView from "../views/sandbox/news-manage/NewsPreView";
import NewsUpdate from "../views/sandbox/news-manage/NewsUpdate";
import Published from "../views/sandbox/publish-manage/Published";
import Sunset from "../views/sandbox/publish-manage/Sunset";
import Unpublish from "../views/sandbox/publish-manage/Unpublish";
import RightList from "../views/sandbox/right-manage/RightList";
import RoleList from "../views/sandbox/right-manage/RoleList";
import UserList from "../views/sandbox/user-manage/UserList";

const LocalRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/draft": NewsDraft,
  "/news-manage/preview/:id": NewsPreView,
  "/news-manage/update/:id": NewsUpdate,
  "/news-manage/add": AddNews,
  "/news-manage/category": NewsCategary,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublish,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset,
};

function SandBoxRouter({ isLoading }) {
  const [backRouteList, setBackRouteList] = useState([]);
  useEffect(() => {
    const getRouteList = async () => {
      const res = await Promise.all([axios.get("/rights"), axios.get("/children")]);
      setBackRouteList([...res[0].data, ...res[1].data]);
    };
    getRouteList();
  }, []);

  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));

  const checkPermission = item => {
    return (
      LocalRouterMap[item.key] &&
      (item.pagepermisson === 1 || item.routepermisson === 1) &&
      rights.includes(item.key)
    );
  };

  return (
    <Spin size="large" spinning={isLoading}>
      <Switch>
        {backRouteList.map(item => {
          if (checkPermission(item)) {
            return (
              <Route
                path={item.key}
                key={`route-${item.key}`}
                component={LocalRouterMap[item.key]}
                exact
              />
            );
          }
          return null;
        })}
        <Redirect from="/" to="/home" exact />
        {backRouteList.length > 0 && <Route path="*" component={NotFound} />}
      </Switch>
    </Spin>
  );
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => ({
  isLoading,
});

export default connect(mapStateToProps)(SandBoxRouter);
