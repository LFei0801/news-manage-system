import { useState, useEffect } from "react";
import axios from "axios";
import { notification } from "antd";

export default function usePublish(type) {
  const [dataSource, setDataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));

  // 请求数据
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `/news?author=${username}&publishState=${type}&_expand=category`
        );
        setDataSource(data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [username, type]);

  // 通知消息
  const notificationInfo = message => {
    notification.info({
      message: "通知",
      description: message,
      placement: "topLeft",
    });
  };

  // 更新页面
  const uploadPage = id => {
    setDataSource(prevData => prevData.filter(data => data.id !== id));
  };

  // 下线新闻
  const handleSunset = id => {
    // console.log("下线", id);
    uploadPage(id);
    axios
      .patch(`/news/${id}`, {
        publishState: 3,
      })
      .then(() => {
        notificationInfo("你已经将该条新闻下线了");
      });
  };

  // 发布新闻
  const handlePublish = id => {
    // console.log("发布", id);
    uploadPage(id);
    axios
      .patch(`/news/${id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then(() => {
        notificationInfo("你已经发布了该条新闻");
      });
  };

  // 删除新闻
  const handleDelete = id => {
    // console.log("撤销", id);
    uploadPage(id);
    axios.delete(`/news/${id}`).then(() => {
      notificationInfo("你已经删除了该新闻");
    });
  };

  return { dataSource, handleDelete, handleSunset, handlePublish };
}
