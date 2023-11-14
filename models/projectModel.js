// models/campaignModel.js
const mysql = require('mysql2/promise') // Use 'mysql2' with promises

// Configure your MySQL connection
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


async function getPersonalById(campaignId) {
  try {
    const sql= `SELECT id,email,title,city,state,type,tagline, description, campaign_img, campaign_video, feature, feature_img, goal_amount,  DATE_FORMAT(goal_date,  '%d %M %Y')  as goal_d, bsb,account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date, fb_url,twitter_url,yt_url, website_url,amount_raised,is_prelaunch,is_business,is_personal,is_approved, no_followers,no_donors FROM campaigns WHERE id = ?`
    const [rows, fields] = await pool.execute(
      sql,
      [campaignId]
    )
    if (rows.length === 1) {
      return rows[0]
    } else {
      throw new Error('Campaign not found')
    }
  } catch (error) {
    throw error
  }
}


async function getCampaignsPersonal() {
  try {
    const sql=`SELECT id,email,title,city,state,type,tagline, description, campaign_img, campaign_video, feature, feature_img, goal_amount,  DATE_FORMAT(goal_date, '%d %M %Y')  as goal_d , bsb,account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date, fb_url,twitter_url,yt_url, website_url,amount_raised,is_prelaunch,is_business,is_personal,is_approved, no_followers,no_donors FROM campaigns`

    const [rows, fields] = await pool.execute(sql) // Replace 'campaigns' with your table name
    return rows
  } catch (error) {
    throw error
  }
}

async function searchCampaign(search) {
  try {
    const [rows, fields] = await pool.execute(
      // 'SELECT * FROM campaigns WHERE title LIKE ?',
      // ['%' + search + '%']
      `SELECT id,email,title,city,state,type,tagline, description, campaign_img, campaign_video, feature, feature_img, goal_amount,  DATE_FORMAT(goal_date, '%d %M %Y')  as goal_d , bsb,account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date, fb_url,twitter_url,yt_url, website_url,amount_raised,is_prelaunch,is_business,is_personal,is_approved, no_followers,no_donors FROM campaigns WHERE LOWER(title) LIKE LOWER(?)`,
      ['%' + search.toLowerCase() + '%']
    )
    return rows
  }
  catch (error) {
    throw error
  }
}
async function sortCampaignAmount() {
  try {
    const [rows, fields] = await pool.execute(
 
      `SELECT id,email,title,city,state,type,tagline, description, campaign_img, campaign_video, feature, feature_img, goal_amount,  DATE_FORMAT(goal_date, '%d %M %Y')  as goal_d , bsb,account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date, fb_url,twitter_url,yt_url, website_url,amount_raised,is_prelaunch,is_business,is_personal,is_approved, no_followers,no_donors FROM campaigns WHERE is_prelaunch = 0 ORDER BY amount_raised DESC`
    )
    return rows
  }
  catch (error) {
    throw error
  }
}

async function sortCampaignFollowers() {
  try {
    const [rows, fields] = await pool.execute(`SELECT id,email,title,city,state,type,tagline, description, campaign_img, campaign_video, feature, feature_img, goal_amount,  DATE_FORMAT(goal_date, '%d %M %Y')  as goal_d , bsb,account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date, fb_url,twitter_url,yt_url, website_url,amount_raised,is_prelaunch,is_business,is_personal,is_approved, no_followers,no_donors FROM campaigns ORDER BY no_followers DESC`
    )
    return rows
  }
  catch (error) {
    throw error
  }
}

async function sortCampaignBackers(){
  try {
    const [rows, fields] = await pool.execute( `SELECT id,email,title,city,state,type,tagline, description, campaign_img, campaign_video, feature, feature_img, goal_amount,  DATE_FORMAT(goal_date, '%d %M %Y')  as goal_d , bsb,account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date, fb_url,twitter_url,yt_url, website_url,amount_raised,is_prelaunch,is_business,is_personal,is_approved, no_followers,no_donors FROM campaigns WHERE is_prelaunch=0 ORDER BY no_donors DESC`
    )
    return rows
  }
  catch (error) {
    throw error
  }
}

async function sortCampaignDeadline() {
  try {
    const [rows, fields] = await pool.execute(
      `SELECT id,email,title,city,state,type,tagline, description, campaign_img, campaign_video, feature, feature_img, goal_amount,  DATE_FORMAT(goal_date, '%d %M %Y')  as goal_d , bsb,account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date, fb_url,twitter_url,yt_url, website_url,amount_raised,is_prelaunch,is_business,is_personal,is_approved, no_followers,no_donors FROM campaigns WHERE is_prelaunch=0 ORDER BY goal_date DESC`
    )
    return rows
  }
  catch (error) {
    throw error
  }
}

async function getMaxFollowers() {
  try {
    const res = await pool.execute(
      'SELECT MAX(no_followers) from campaigns'
    )
    return res
  }
  catch (error) {
    throw error
  }
}

async function getMaxAmountRaised() {
  try {
    const res= await pool.execute(
      'SELECT MAX(amount_raised) from campaigns'
    )
    return res
  }
  catch (error) {
    throw error
  }
}

async function getMaxBackers() {
  try {
    const res = await pool.execute(
      'SELECT MAX(no_donors) from campaigns'
    )
    return res
  }
  catch (error) {
    throw error
  }
}

async function filterCampaignCategory(is_prelaunch,is_personal,is_business, minFollowers, maxFollowers, minAmountRaised, maxAmountRaised, minBackers, maxBackers) {
  try { 
    var sql1 = `SELECT id,email,title,city,state,type,tagline, description, campaign_img, campaign_video, feature, feature_img, goal_amount,  DATE_FORMAT(goal_date, '%d %M %Y')  as goal_d , bsb,account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date, fb_url,twitter_url,yt_url, website_url,amount_raised,is_prelaunch,is_business,is_personal,is_approved, no_followers,no_donors FROM campaigns WHERE `;
    var sql2 = '(is_prelaunch = ? AND is_personal = ? AND is_business = ?) AND '
    var sql3 = 'no_followers >= ? AND no_followers <= (?) AND amount_raised >= ? AND amount_raised <= (?) AND no_donors >= ?  AND no_donors <= (?)'
    var stmt;
    var params=[]
    if (!(is_prelaunch && is_personal && is_business)) {
      stmt = sql1 + sql2 + sql3;
      params = [is_prelaunch,is_personal,is_business, minFollowers, maxFollowers, minAmountRaised, maxAmountRaised, minBackers, maxBackers]
    }
    else {
      stmt = sql1 + sql3;
      params = [minFollowers, maxFollowers, minAmountRaised, maxAmountRaised, minBackers, maxBackers]
    }
    const [rows, fields] = await pool.execute(
      stmt,
      params
    )
    return rows
  }
  catch (error) {
    throw error
  }
}


module.exports = {
  getPersonalById,
  getCampaignsPersonal,
  searchCampaign,
  sortCampaignAmount,
  sortCampaignFollowers,
  sortCampaignBackers,
  sortCampaignDeadline,
  filterCampaignCategory,
  getMaxFollowers,
  getMaxAmountRaised,
  getMaxBackers,
}
