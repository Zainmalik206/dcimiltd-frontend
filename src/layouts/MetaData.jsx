// src/components/MetaData.js
import React from "react";
import { Helmet } from "react-helmet";

const MetaData = ({ title }) => {
  return (
    <Helmet>
      <title>{`DC IMI LTD - ${title}`}</title>
      <meta name="description" content={`DC IMI LTD ${title} page`} />
    </Helmet>
  );
};

export default MetaData;
