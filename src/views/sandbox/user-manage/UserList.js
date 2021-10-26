import React, { useEffect, useRef, useState } from "react";
import { Switch, Table, Button, Tag, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import UsersForm from "../../../components/UseForm";

export default function UserList() {
  const [dataSource, setDataSource] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isUpdateDisable, setIsUpdateDisable] = useState(false);
  const [regionsList, setRegionsList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [currentUserID, setCurrentUserID] = useState({});
  const addFormRef = useRef();
  const updateFormRef = useRef();

  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      filters: [
        {
          text: "全球",
          value: "",
        },
        ...regionsList.map((item) => ({
          text: item.title,
          value: item.value,
        })),
      ],
      onFilter: (value, item) => item.region === value,
      render: (region) => (
        <Tag color="gold">{region === "" ? "全球" : region}</Tag>
      ),
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render: (role) => <b>{role?.roleName}</b>,
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      dataIndex: "roleState",
      render: (roleState, item) => (
        <Switch
          checked={roleState}
          disabled={item.default}
          onChange={() => toggleRoleState(item)}
        />
      ),
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          {/* 编辑按钮 */}
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            style={{ marginRight: 10 }}
            disabled={item.default}
            onClick={() => {
              setTimeout(() => {
                setIsUpdateModalVisible(true);
                // 如果是超级管理员就禁用 区域选择框
                if (item.roleId === 1) {
                  setIsUpdateDisable(true);
                } else {
                  setIsUpdateDisable(false);
                }
                updateFormRef.current.setFieldsValue(item);
                setCurrentUserID(item.id);
              }, 0);
            }}
          />
          {/* 删除按钮 */}
          <Button
            type="danger"
            shape="circle"
            icon={<DeleteOutlined />}
            disabled={item.default}
            onClick={() => showConfirm(item)}
          />
        </div>
      ),
    },
  ];

  // 初始化用户列表
  const { region, username, roleId } = JSON.parse(
    localStorage.getItem("token")
  );
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get("/users?_expand=role");
        const list = res.data;
        // 根据权限过滤数据
        setDataSource(() =>
          roleId === 1
            ? list
            : [...list.filter((item) => item.region === region)]
        );
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, [region, roleId, username]);

  // 初始化区域列表
  useEffect(() => {
    const getRegionsList = async () => {
      try {
        const res = await axios.get("/regions");
        setRegionsList(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getRegionsList();
  }, []);

  // 初始化角色列表
  useEffect(() => {
    const getRolesList = async () => {
      try {
        const res = await axios.get("/roles");
        setRoleList(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getRolesList();
  }, []);

  // 展示确认框
  const showConfirm = (item) =>
    Modal.confirm({
      title: "你确定要删该项吗？",
      content: "删除后无法恢复！请谨慎使用",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item);
      },
      onCancel() {},
    });

  // 删除用户
  const deleteMethod = ({ id }) => {
    setDataSource((prevData) => prevData.filter((data) => data.id !== id));
    axios.delete(`/users/${id}`);
  };

  // 添加用户
  const addUser = async () => {
    try {
      const values = await addFormRef.current.validateFields();
      setIsAddModalVisible(false);
      // 先发送请求，更新后端数据，获取后端发送的返回数据的id
      const response = await axios.post(`/users`, {
        ...values,
        roleState: false,
        default: false,
      });
      const { data } = response;
      // 手动添加role字段
      data.role = roleList.filter((item) => item.id === data.roleId)[0];
      setDataSource((prevData) => [...prevData, data]);
      // 恢复表单默认值
      addFormRef.current.setFieldsValue({
        username: "",
        password: "",
        region: "",
        roleId: "",
      });
    } catch (error) {
      console.log("err:", error);
    }
  };

  // 更新用户
  const updateUser = async () => {
    try {
      const values = await updateFormRef.current.validateFields();
      // 关闭模态框
      setIsUpdateModalVisible(false);
      setIsUpdateDisable((prevData) => !prevData);
      // 更新前端页面
      setDataSource((prevData) =>
        prevData.map((data) =>
          data.id === currentUserID
            ? {
                ...values,
                role: roleList.filter((item) => item.id === values.roleId)[0],
              }
            : data
        )
      );
      // 更新后端数据
      axios.patch(`/users/${currentUserID}`, {
        ...values,
      });
    } catch (error) {
      console.log(error);
    }
  };
  // 切换用户状态
  const toggleRoleState = (item) => {
    const state = !item.roleState;
    setDataSource((prevData) =>
      prevData.map((data) =>
        data.id === item.id ? { ...data, roleState: state } : data
      )
    );
    axios.patch(`/users/${item.id}`, {
      roleState: state,
    });
  };

  return (
    <>
      <Button
        type="primary"
        style={{ marginBottom: 5 }}
        onClick={() => setIsAddModalVisible(true)}
      >
        添加用户
      </Button>

      {/* 添加用户 */}
      <Modal
        title="添加用户"
        visible={isAddModalVisible}
        onOk={addUser}
        onCancel={() => setIsAddModalVisible(false)}
      >
        <UsersForm
          regionList={regionsList}
          roleList={roleList}
          ref={addFormRef}
        />
      </Modal>

      {/* 更新用户 */}
      <Modal
        title="更新用户"
        visible={isUpdateModalVisible}
        onOk={updateUser}
        onCancel={() => {
          setIsUpdateModalVisible(false);
          setIsUpdateDisable((prevData) => !prevData);
        }}
      >
        <UsersForm
          regionList={regionsList}
          roleList={roleList}
          ref={updateFormRef}
          isUpdateDisable={isUpdateDisable}
          isUpdate={true}
        />
      </Modal>

      <Table
        dataSource={dataSource}
        rowKey={(item) => item.id}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </>
  );
}
