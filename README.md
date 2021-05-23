## Introduction

An opinionated generic API in AWS Lambda (ExpressJS) & DynamoDB to support CRUD operations of frontend applications out-of-the-box.

## Instructions
1. Install & configure serverless

2. Change the `stage` to whatever you need in `serverless.yml`

3. Execute the following:

```bash
npm i
serverless deploy
```
4. Create new table in DynamoDB in the following format `prefix_name_stage`. And `primaryKey` & `type` as the Partition Key & Sort Key respectively (both Strings). Example `mycompany_mytable_dev`

## APIS
The table names convert to API path:

`mycompany_mytable_dev` is `/dev/mycompany/mytable` where `dev` is the stage in `serverless.yml`.

#### Check the Postman Collection: 
Company is `pp`, Name is `products`, Stage is `dev`. Hence, the relevant table name is `pp_products_dev`

