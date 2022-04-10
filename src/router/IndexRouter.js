import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "../views/login/Login";
import Detail from "../views/news/Detail";
import News from "../views/news/News";
import NewsSandBox from "../views/sandbox/NewsSandBox";

export default function IndexRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/news" component={News} exact />
        <Route path="/news/datail/:id" component={Detail} />
        {/* 没有授权时就重定向到登录界面 */}
        <Route
          path="/"
          render={() => (localStorage.getItem("token") ? <NewsSandBox /> : <Redirect to="login" />)}
        />
      </Switch>
    </BrowserRouter>
  );
}
