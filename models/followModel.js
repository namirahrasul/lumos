const mysql = require('mysql2/promise')
const path = require('path')

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

// Async function to insert data into the follow table
async function insertFollowData(follower, cid) {
  try {
    // Define the SQL query
    const sql = 'INSERT INTO follow (follower, cid) VALUES (?, ?)';

    // Execute the SQL query with the provided data using pool.query
    const [rows] = await pool.query(sql, [follower, cid])

    // Return the inserted row
    return rows
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Handle duplicate key error
      console.error(`Duplicate key error: ${follower} already exists.`);
      return null; // You can return null or some other value to indicate the error
    }
    console.error('Error inserting data into follow table:', error)
    throw error
}
}

async function updateCampaignFollowersById(id) {
  try {


    // Define the SQL update query
    const sql = 'UPDATE campaigns SET no_followers = no_followers + 1 WHERE id = ?';

    // Execute the update query with the provided uniqueId
    const [rows, fields] = await pool.query(sql, [id]);

    return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
}




// Async function to retrieve data from the tables for notification
async function getNotifById(notif) {
  try {
    const [rows, fields] = await pool.execute(`SELECT
    f.fid,
    u.name,
    b.title,
    b.email,
    TIME(f.ftime) as tt,
    CONCAT(
      DATE_FORMAT(f.ftime, '%D'), 
      DATE_FORMAT(f.ftime, ' %M')
    ) as dd
  FROM follow as f
  JOIN campaigns as b ON f.cid = b.id
  JOIN users as u ON f.follower = u.email
  where b.email=(?)
  ORDER BY ftime`,[notif]) 
    return rows
  } catch (error) {
    throw error
  }
}

async function getMyCampaign(myCamp){
  try {
     const sql=`SELECT id,email,title,city,state,type,tagline, description, campaign_img, campaign_video, feature, feature_img, goal_amount,  DATE_FORMAT(goal_date, '%d %M %Y')  as goal_d , bsb,account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date, fb_url,twitter_url,yt_url, website_url,amount_raised,is_prelaunch,is_business,is_personal,is_approved, no_followers,no_donors FROM campaigns`
    const [rows, fields] = await pool.execute(sql,[myCamp]) 
    return rows
  } catch (error) {
    throw error
  }
}

async function getMyFollow(myFollow){
  try {
    const sql = `select f.follower, f.cid, id,email,title,city,state,type,tagline, description, campaign_img, campaign_video, feature, feature_img, goal_amount,  DATE_FORMAT(goal_date, '%d %M %Y')  as goal_d , bsb,account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date, fb_url,twitter_url,yt_url, website_url,amount_raised,is_prelaunch,is_business,is_personal,is_approved, no_followers,no_donors FROM follow as f join campaigns on f.cid=id where f.follower=(?)`;

    const [rows, fields] = await pool.execute(sql,[myFollow]) 
    return rows
  } catch (error) {
    throw error
  }
}


module.exports = {
  insertFollowData,
  getNotifById,
  getMyCampaign,
  getMyFollow, 
  updateCampaignFollowersById,
}