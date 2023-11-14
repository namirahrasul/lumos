const fs = require('fs') // Import the fs module
const mysql = require('mysql2')
const { v4: uuidv4 } = require('uuid') // Import the UUID library
const path = require('path')
const multer = require('multer')
// const upload = multer({ dest: 'uploads/' });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'todo',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})



function insertCampaign(
  req,
  email,
  title,
  city,
  state,
  type,
  tagline,
  description,
  campaign_img,
  campaign_video,
  feature,
  feature_img,
  goal_amount,
  goal_date,
  bsb,
  account,
  bkash,
  rocket,
  nagad,
  upay,
  perk_title,
  perk_description,
  perk_img,
  perk_price,
  perk_retail_price,
  perk_date,
  nid_front,
  nid_back,
  passport,
  fb_url,
  twitter_url,
  yt_url,
  website_url,
  is_prelaunch,
  is_personal,
  is_business,
  callback
) {
  console.log(req.file)
  console.log(req.body)

  // Get a connection from the pool
  pool.getConnection((connectionErr, connection) => {
    if (connectionErr) {
      callback(connectionErr)
      return
    }
   

    // SQL query to insert user information and unique image path
    const sql2 =
      'INSERT INTO campaigns ( email, title, city, state, type, tagline, description, campaign_img,campaign_video, feature, feature_img, goal_amount, goal_date, bsb, account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date,nid_front, nid_back, passport, fb_url, twitter_url, yt_url, website_url, is_prelaunch,is_personal,is_business) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

    // Execute the query with user information and unique image path
    connection.query(
      sql2,
      [
        email,
        title,
        city,
        state,
        type,
        tagline,
        description,
        campaign_img,
        campaign_video,
        feature,
        feature_img,
        goal_amount,
        goal_date,
        bsb,
        account,
        bkash,
        rocket,
        nagad,
        upay,
        perk_title,
        perk_description,
        perk_img,
        perk_price,
        perk_retail_price,
        perk_date,
        nid_front,
        nid_back,
        passport,
        fb_url,
        twitter_url,
        yt_url,
        website_url,
        is_prelaunch,
        is_personal,
        is_business,
      ],
      (queryErr, result) => {
        // Release the connection whether there was an error or not
        connection.release()

        if (queryErr) {
          callback(queryErr)
          return
        }

        callback(null, result)
      }
    )
  })
}

function insertBusiness(
  req,
  email,
  bid,
  business_plan,
  project_budget,
  product_prototype,
  legal_entity_verification,
  financial_statements,
  intellectual_property,
  permits,
  contracts,
  extras,
  callback
) {
  console.log(req.file)
  console.log(req.body)

  // Get a connection from the pool
  pool.getConnection((connectionErr, connection) => {
    if (connectionErr) {
      callback(connectionErr)
      return
    }
   

    // SQL query to insert user information and unique image path
    const sql2 =
      'INSERT INTO docs (email, bid, business_plan, project_budget, product_prototype,legal_entity_verification, financial_statements, intellectual_property, permits, contracts,extras) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

    // Execute the query with user information and unique image path
    connection.query(
      sql2,
      [
        email,
        bid,
        business_plan,
        project_budget,
        product_prototype,
        legal_entity_verification,
        financial_statements,
        intellectual_property,
        permits,
        contracts,
        extras
      ],
      (queryErr, result) => {
        // Release the connection whether there was an error or not
        connection.release()

        if (queryErr) {
          callback(queryErr)
          return
        }

        callback(null, result)
      }
    )
  })
}
module.exports = {
  // insertUserWithUniqueImagePath,
  // insertPrelaunch,
  // insertBusinessCampaign,
  insertCampaign,
  insertBusiness
}