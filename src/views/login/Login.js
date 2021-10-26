import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import "./login.css";

export default function Login({ history }) {
  const onFinish = async (values) => {
    try {
      const { username, password } = values;
      // 判断是否登录成功
      const response = await axios.get(
        `/users?username=${username}&password=${password}`
      );
      // 登录成功后，设置token
      if (response.data.length && response.data[0].roleState) {
        const { id } = response.data[0];
        const res = await axios.get(`/users/${id}?_expand=role`);
        //设置 token
        localStorage.setItem("token", JSON.stringify(res.data));
        // 跳转至 home页面
        history.push("/home");
      } else {
        message.error("用户名与密码不匹配");
      }
    } catch (error) {
      console.info("err", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-cotainer">
        <h1>新闻发布管理系统</h1>
        <Form name="basic" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="username" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="password" prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-btn">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
