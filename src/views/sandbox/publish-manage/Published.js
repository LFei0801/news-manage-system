import React from "react";
import NewsPublishTable from "../../../components/NewsPublishTable";
import usePublish from "../../../hooks/usePublish";

export default function Published() {
  const { dataSource, handleSunset } = usePublish(2);

  return (
    <NewsPublishTable
      dataSource={dataSource}
      type={3}
      handleSunset={handleSunset}
    />
  );
}
