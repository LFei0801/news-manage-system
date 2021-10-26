import React, { forwardRef, useEffect, useState } from "react";
import { Form, Input, Select } from "antd";

function UsersForm({ regionList, roleList, isUpdateDisable }, ref) {
  const { region, roleId } = JSON.parse(localStorage.getItem("token"));
  const [isDisable, setIsDisable] = useState(false);
  // 根据 isUpdateDisable 的值决定 是否禁用区域选择框
  useEffect(() => {
    setIsDisable(isUpdateDisable);
  }, [isUpdateDisable]);

  const checkRegionPermission = (item) => {
    if (roleId === 1) {
      return false;
    } else {
      return item.value !== region;
    }
  };

  const checkRolePermission = (item) => {
    if (roleId === 1) {
      return false;
    } else {
      return item.roleType !== 3;
    }
  };

  return (
    <Form layout="vertical " ref={ref}>
      {/* 用户输入框 */}
      <Form.Item
        label="用户名"
        required
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input autoComplete="off" />
      </Form.Item>

      {/* 密码输入框 */}
      <Form.Item
        label="密码"
        required
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input type="password" autoComplete="off" />
      </Form.Item>

      {/* 区域选择框 */}
      <Form.Item
        label="区域"
        required
        name="region"
        rules={
          isDisable
            ? []
            : [{ required: true, message: "Please checked your region!" }]
        }
      >
        <Select disabled={isDisable}>
          {regionList.map((item) => (
            <Select.Option
              value={item.value}
              key={`region${item.id}`}
              disabled={checkRegionPermission(item)}
            >
              {item.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* 权限选择框 */}
      <Form.Item
        label="角色"
        required
        name="roleId"
        rules={[{ required: true, message: "Please checkd your role!" }]}
      >
        <Select
          onChange={(value) => {
            if (value === 1) {
              setIsDisable(true);
              ref.current.setFieldsValue({ region: "" });
            } else {
              setIsDisable(false);
            }
          }}
        >
          {roleList.map((item) => (
            <Select.Option
              value={item.roleType}
              key={`role${item.id}`}
              disabled={checkRolePermission(item)}
            >
              {item.roleName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
}

export default forwardRef(UsersForm);
