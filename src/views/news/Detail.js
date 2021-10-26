import React, { useEffect, useState } from "react";
import { PageHeader, Descriptions } from "antd";
import { HeartTwoTone, HeartFilled } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";

export default function Detail({ match }) {
  const [newsInfo, setNewsInfo] = useState(null);
  const [isClickStar, setIsClickStar] = useState(false);

  useEffect(() => {
    const getPreviewData = async () => {
      try {
        const res = await axios.get(
          `/news/${match.params.id}?_expand=category&_expand=role`
        );
        setNewsInfo(() => ({ ...res.data, view: res.data.view + 1 }));
        axios.patch(`/news/${match.params.id}`, {
          view: res.data.view + 1,
        });
      } catch (error) {
        console.log(error);
      }
    };
    getPreviewData();
  }, [match.params.id]);

  const handleClickStar = (currentStar) => {
    setIsClickStar((prevState) => !prevState);
    setNewsInfo((prevNews) => ({ ...prevNews, star: currentStar }));
    // 更新后端数据
    axios.patch(`news/${match.params.id}`, {
      star: currentStar,
    });
  };

  return (
    <>
      {newsInfo && (
        <div>
          {/* 标题 */}
          <PageHeader
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={newsInfo.category.title}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">
                {newsInfo.author}
              </Descriptions.Item>
              <Descriptions.Item label="发布时间">
                {newsInfo.publishTime
                  ? moment(newsInfo.publishTime).format("YYYY-MM-DD HH:mm:ss")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="区域">
                {newsInfo.region}
              </Descriptions.Item>

              <Descriptions.Item label="访问数量">
                {newsInfo.view}
              </Descriptions.Item>
              <Descriptions.Item label="点赞数量">
                <span>
                  {newsInfo.star}
                  {isClickStar ? (
                    <HeartFilled
                      style={{
                        color: "#eb2f96",
                        marginLeft: 5,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        const currentStar = newsInfo.star - 1;
                        handleClickStar(currentStar);
                      }}
                    />
                  ) : (
                    <HeartTwoTone
                      twoToneColor="#eb2f96"
                      style={{ marginLeft: 5, cursor: "pointer" }}
                      onClick={() => {
                        const currentStar = newsInfo.star + 1;
                        handleClickStar(currentStar);
                      }}
                    />
                  )}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="评论数量">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>
          {/* 内容 */}
          <div
            className="news-content"
            dangerouslySetInnerHTML={{
              __html: newsInfo.content,
            }}
            style={{ borderTop: "solid 1px #ddd", margin: "0 24px" }}
          />
        </div>
      )}
    </>
  );
}
