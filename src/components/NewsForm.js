import React, { useEffect, useRef, useState } from "react";
import { Steps, Button, Card, message, notification } from "antd";
import { ArrowLeftOutlined, SmileOutlined } from "@ant-design/icons";
import NewsTitleForm from "./NewsTitleForm";
import axios from "axios";
import NewsEditor from "./NewsEditor";
import NewsInfo from "./NewsInfo";

const { Step } = Steps;

export default function NewsForm({
  history,
  isUpdate = false,
  newsInfo = null,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [news, setNews] = useState({});
  const titleFormRef = useRef();

  // 初始化新闻分类列表
  useEffect(() => {
    const getCategoryList = async () => {
      try {
        const res = await axios.get("/categories");
        setCategoryList(() => res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCategoryList();
  }, []);

  // 初始化表单字段
  useEffect(() => {
    if (newsInfo !== null) {
      titleFormRef.current.setFieldsValue({
        title: newsInfo.title,
        categoryId: categoryList[newsInfo.categoryId - 1].title,
      });
      setNews((prevNews) => ({ ...prevNews, content: newsInfo.content }));
    }
  }, [newsInfo, categoryList]);

  // 下一步按钮点击事件
  const handleNext = async () => {
    try {
      // 处理新闻标题表单提交
      if (currentStep === 0) {
        const values = await titleFormRef.current.validateFields();
        setNews((prevNews) => ({
          ...prevNews,
          title: values.title,
          categoryId: categoryList.filter(
            (item) => item.title === values.categoryId
          )[0].id,
        }));
        setCurrentStep((prevStep) => (prevStep += 1));
      }
      // 处理新闻内容表单提交
      else {
        if (
          news.content === undefined ||
          news.content === "" ||
          news.content === "<p></p>\n"
        ) {
          message.error("新闻内容不能为空");
        } else {
          setCurrentStep((prevStep) => (prevStep += 1));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 保存新闻
  const handleSave = (auditState) => {
    const { region, username, roleId } = JSON.parse(
      localStorage.getItem("token")
    );
    axios
      .post("/news", {
        ...news,
        region: region ? region : "全球",
        author: username,
        roleId: roleId,
        auditState: auditState,
        publishState: 0,
        createTime: Date.now(),
        star: 0,
        view: 0,
      })
      .then(() => toDraftOrPublish(auditState));
  };

  // 更新新闻
  const handleUpdate = (auditState) => {
    axios
      .patch(`/news/${newsInfo.id}`, {
        ...news,
        auditState: auditState,
      })
      .then(() => toDraftOrPublish(auditState));
  };

  // 跳转页面
  const toDraftOrPublish = (auditState) => {
    history.push(
      auditState === 0 ? "/news-manage/draft" : "/audit-manage/list"
    );
    notification.open({
      message: "通知",
      description: `你可以在${
        auditState === 0 ? "草稿箱" : "审核列表"
      }中查看你编写的新闻`,
      placement: "topRight",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };

  return (
    <Card
      title={
        isUpdate ? (
          <>
            <span
              style={{ cursor: "pointer", marginRight: 5 }}
              onClick={() => history.goBack()}
            >
              <ArrowLeftOutlined />
            </span>
            <b>更新新闻</b>
          </>
        ) : (
          <b>撰写新闻</b>
        )
      }
      className="news-wrapper"
      extra={
        <>
          <Steps current={currentStep}>
            <Step title="基本信息" description="新闻标题，新闻分类" />
            <Step title="新闻内容" description="新闻主体内容" />
            <Step title="新闻提交" description="保存新闻或者提交审核" />
          </Steps>
        </>
      }
    >
      {/* 表单 */}
      <div style={{ marginTop: 5 }}>
        <div className={currentStep === 0 ? "" : "hidden"}>
          <NewsTitleForm categoryList={categoryList} ref={titleFormRef} />
        </div>
        <div className={currentStep === 1 ? "" : "hidden"}>
          <NewsEditor
            getContent={(values) =>
              setNews((prevNews) => ({ ...prevNews, content: values }))
            }
            content={news.content}
          />
        </div>
        <div className={currentStep === 2 ? "" : "hidden"}>
          <NewsInfo news={news} categoryList={categoryList} />
        </div>
      </div>

      {/* 按钮 */}
      <div className="add-news-btn-wrapper">
        <div className="left">
          <Button
            type="primary"
            onClick={handleNext}
            disabled={currentStep === 2}
            style={{ marginRight: 10 }}
          >
            下一步
          </Button>
          <Button
            type="dashed"
            onClick={() => setCurrentStep((prevStep) => (prevStep -= 1))}
            disabled={currentStep === 0}
          >
            上一步
          </Button>
        </div>
        <div className="right">
          <Button
            type="primary"
            disabled={currentStep !== 2}
            style={{ marginRight: 10 }}
            onClick={() => {
              isUpdate ? handleUpdate(0) : handleSave(0);
            }}
          >
            保存草稿
          </Button>
          <Button
            type="danger"
            disabled={currentStep !== 2}
            onClick={() => (isUpdate ? handleUpdate(1) : handleSave(1))}
          >
            提交新闻
          </Button>
        </div>
      </div>
    </Card>
  );
}
