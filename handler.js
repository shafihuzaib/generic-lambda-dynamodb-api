const express = require("express");
const serverless = require("serverless-http");

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const REGION = process.env.region; //e.g. "us-east-1"
const ddbClient = new DynamoDBClient({ region: REGION });
const ddbDocClient = DynamoDBDocument.from(ddbClient);

const app = express();
app.use(express.json());

app.get("/:company/:table/:pkey?/:skey?", async function (req, res) {

  let operation = "scan"; // default operation
  const params = {
    TableName: req.params.company + "_" + req.params.table + "_" + req.requestContext.stage
  }

  if(req.params.skey) {
    operation = "get";
    params['Key'] = {
      "primaryKey": req.params.pkey,
      "type": req.params.skey
    }
  }
  else if(req.params.pkey) {
    operation = "query";
    params['KeyConditionExpression'] = "primaryKey = :pkey",
    params['ExpressionAttributeValues'] = {
      ":pkey": req.params.pkey
    }
  }

  try {
    const  Items  = await ddbDocClient[operation](params);
    if (Items) {
      res.json({"items":Items, operation: operation});
    } else {
      res
        .status(404)
        .json({ error: 'Could not find data with provided "query"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive data" });
  }
});


/**
 * Create New Item or Update an existing Item (based on the values of primaryKey & type)
 */
app.post("/:company/:table", async function(req, res) {
  const params = {
        TableName: req.params.company + "_" + req.params.table + "_" + req.requestContext.stage,
        Item : req.body,
        ReturnItemCollectionMetrics: "SIZE"
  }

  try {
    const  Item  = await ddbDocClient.put(params);
    if (Item) {
      res.json(Item);
    } else {
      res
        .status(404)
        .json({ error: 'Could not find data with provided "query"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive data" });
  }
});

app.delete("/:company/:table/:pkey/:skey", async function (req, res) {
  const params = {
    TableName: req.params.company + "_" + req.params.table + "_" + req.requestContext.stage,
    Key: {
      "primaryKey": req.params.pkey,
      "type": req.params.skey
    }
  }

  try {
    const  Item  = await ddbDocClient.put(params);
    if (Item) {
      res.json(Item);
    } else {
      res
        .status(404)
        .json({ error: 'Could not find data with provided "query"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive data" });
  }
});


app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
