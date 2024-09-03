require("dotenv").config();
const { Client } = require("@elastic/elasticsearch");

const client = new Client({ node: process.env.ELASTICSEARCH_NODE });

const logError = async (error) => {
  try {
    await client.index({
      index: "errors",
      body: {
        timestamp: new Date(),
        error: error.message,
      },
    });
  } catch (err) {
    console.error("Failed to log error to Elasticsearch:", err);
  }
};

module.exports = { logError };
