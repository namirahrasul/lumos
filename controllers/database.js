const mysql = require('mysql');
const {user} = require('./database-objects')
const utility = require('../server/utility')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'system',
    database: 'ibadah',
    charset: 'utf8mb4', // Set the character set to UTF-8
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// الافترايفكتس و البريمير و الافد ميدا كومبوزر و السموك و برامج اخرى كثيرة

function checkCredentials(email, password, callback) {
    const sqlCredentials = `SELECT *
                            FROM credentials
                            WHERE EMAIL = ${pool.escape(email)}
                              and PASSWORD_HASH = SHA2(${pool.escape(password)}, 256);`;

    const sqlProfile = `SELECT *
                        FROM PROFILE
                        WHERE USER_ID = ?`;

    pool.query(sqlCredentials, (err, results) => {
        if (err) {
            return console.log(err.sql);
        }
        if (!results.length) {
            if (callback) return callback(0);
        }
        ({USER_ID: user.userID, EMAIL: user.email} = results[0]);
        pool.query(sqlProfile, results[0].USER_ID, (err, results) => {
            if (err) {
                return console.log(err.sql);
            }
            const {GENDER, COUNTRY, FIRST_NAME, LAST_NAME} = results[0];
            user.userName = FIRST_NAME + (LAST_NAME ? LAST_NAME : "");
            user.gender = GENDER === 0 || null ? "Female" : "Male"
            user.country = COUNTRY
            if (callback) callback(1);
        });
    });
}

function verifyMail(email, callback) {

    let MAIL_HAS_BEEN_FOUND = true

    const sql = `SELECT USER_ID
                 FROM credentials
                 WHERE EMAIL = ${pool.escape(email)};`;
    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            MAIL_HAS_BEEN_FOUND = false;
        }
        if (!results.length) {//mail not found
            MAIL_HAS_BEEN_FOUND = false;
        }
        callback(MAIL_HAS_BEEN_FOUND)
    });
}

function insertUser(name, password, email, callback) {
    const sqlCredentials = `INSERT INTO credentials (EMAIL, PASSWORD_HASH)
                            VALUES (${pool.escape(email)},
                                    SHA2(${pool.escape(password)}, 256))`;

    const sqlProfile = `INSERT INTO profile (USER_ID, FIRST_NAME)
                        VALUES (?,
                                ${pool.escape(name)})`;

    pool.query(sqlCredentials, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            if (callback) return callback(err)
        } else {
            pool.query(sqlProfile, results.insertId, (err) => {
                if (err) {
                    console.log(err.sqlMessage + '\n' + err.sql);
                }
                if (callback) return callback(err)
            })
        }
    });
}

function updatePassword(email, password, callback) {
    const sql = `UPDATE CREDENTIALS
                 SET PASSWORD_HASH = SHA2(${pool.escape(password)}, 256)
                 WHERE EMAIL = ${pool.escape(email)}`;
    pool.query(sql, (err) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        callback(1);
    });
}

function updatePersonalInfo(userID, name, gender, country, callback) {
    name = pool.escape(name)
    gender = gender === "Male" ? 1 : 0
    country = pool.escape(country)
    let SUCCESSFULLY_UPDATED = true

    const sql = `UPDATE profile
                 SET FIRST_NAME = ${name},
                     GENDER     = ${gender},
                     COUNTRY    = ${country}
                 WHERE USER_ID = ${pool.escape(userID)}`;
    pool.query(sql, (err) => {
        if (err) {
            SUCCESSFULLY_UPDATED = false
            console.log(err.sqlMessage + '\n' + err.sql);
        }
        return callback(SUCCESSFULLY_UPDATED);
    });
}

function updateEmail(userID, email, callback) {
    email = pool.escape(email)

    let SUCCESSFULLY_UPDATED = true

    const sql = `UPDATE credentials
                 SET EMAIL = ${email}
                 WHERE USER_ID = ${pool.escape(userID)}`;
    pool.query(sql, (err) => {
        if (err) {
            SUCCESSFULLY_UPDATED = false
            console.log(err.sqlMessage + '\n' + err.sql);
        }
        return callback(SUCCESSFULLY_UPDATED);
    });
}

function loadClasses(callback) {
    const sql = `SELECT POST_ID,
                        USER_ID,
                        TOPIC,
                        TEACHER,
                        DATE_FORMAT(DATE, '%M %d, %Y') AS DATE,
                        TIME_FORMAT(TIME, '%h:%i %p')  AS TIME,
                        ONLINE,
                        ADDRESS
                 FROM CLASSES
                 ORDER BY DATE, TIME`;

    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        callback(results);
    });
}

function deleteCLass(postID, callback) {
    const sql = `DELETE
                 FROM CLASSES
                 WHERE POST_ID = ${pool.escape(postID)}`;

    pool.query(sql, (err) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        callback(1);
    });
}

function loadDuas(callback) {
    const sql = `SELECT dua_id,
                        title,
                        dua_text,
                        meaning,
                        source
                 FROM dua
                 where cat_id = 2
                 order by dua_id`;


    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        callback(results);
    });
}

function loadPost(callback) {
    const sql = `SELECT p.post_id,
                        p.user_name,
                        p.topic,
                        p.date,
                        p.time,
                        com.user_name,
                        com.comment_text,
                        com.date,
                        com.time
                 FROM posts p,
                      comments com
                 where p.post_id = com.post_id
                 order by post_id desc`;


    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        callback(results);
    });
}


function loadPosts(callback) {
    const sql = `
        SELECT p.post_id,
               p.user_id,
               p.user_name                        AS post_user_name,
               p.topic,
               DATE_FORMAT(p.date, '%M %d, %Y')   AS post_date,
               TIME_FORMAT(p.time, '%h:%i %p')    AS post_time,
               com.user_name                      AS comment_user_name,
               com.comment_text,
               DATE_FORMAT(com.date, '%M %d, %Y') AS comment_date,
               TIME_FORMAT(com.time, '%h:%i %p')  AS comment_time
        FROM posts p
                 LEFT JOIN comments com ON p.post_id = com.post_id
        ORDER BY p.post_id DESC, com.date ASC, com.time ASC`;

    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        } else {
            // Create an object to store posts and comments
            const posts = [];
            let currentPost = null;

            for (const row of results) {
                if (!currentPost || currentPost.post_id !== row.post_id) {
                    // Start a new post
                    currentPost = {
                        post_id: row.post_id,
                        user_id: row.user_id,
                        user_name: row.post_user_name,
                        topic: row.topic,
                        date: row.post_date,
                        time: row.post_time,
                        comments: [],
                    };
                    posts.push(currentPost);
                }

                // Add the comment to the current post
                if (row.comment_user_name) {
                    currentPost.comments.push({
                        user_name: row.comment_user_name,
                        comment_text: row.comment_text,
                        date: row.comment_date,
                        time: row.comment_time,
                    });
                }
            }
            callback(posts);
        }
    });
}


function insertNewClasses(userID, topic, teacher, medium, address, date, time, callback) {
    if (medium === "Online") medium = 1; else medium = 0;

    const sql = `INSERT INTO classes(user_id, topic, teacher, online, address, date, time)
                 VALUES (${pool.escape(userID)}, ${pool.escape(topic)}, ${pool.escape(teacher)},
                         ${pool.escape(medium)},
                         ${pool.escape(address)}, ${pool.escape(date)}, ${pool.escape(time)})`;
    pool.query(sql, (err) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        callback(1);
    });
}

function loadAllTasks(userID, callback) {
    const sql = `SELECT TASK_ID,
                        TASK_NAME,
                        DESCRIPTION,
                        DATE_FORMAT(DATE, '%M %d, %Y')      as DATE,
                        TIME_FORMAT(START_TIME, '%h:%i %p') as START_TIME,
                        TIME_FORMAT(END_TIME, '%h:%i %p')   as END_TIME
                 FROM DAILY_PLANS
                 WHERE USER_ID = ${pool.escape(userID)}`;
    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        callback(results);
    });
}

function insertNewTask(task_name, description, date, start_time, end_time, callback) {

    const sql = `INSERT INTO daily_plans(user_id, task_name, description, date, start_time, end_time)
                 VALUES (${pool.escape(user.userID)}, ${pool.escape(task_name)}, ${pool.escape(description)},
                         ${pool.escape(date)}, ${pool.escape(start_time)}, ${pool.escape(end_time)})`;
    pool.query(sql, (err) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        callback(1);
    });
}

function deleteTask(task_id, callback) {
    const sql = `DELETE
                 FROM DAILY_PLANS
                 WHERE TASK_ID = ${pool.escape(task_id)}`;
    pool.query(sql, (err) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        callback(1);
    });
}


function insertNewPosts(topic, callback) {
    const id_user = user.userID;
    const name_user = user.userName;


    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const time = new Date().toISOString().split('T')[1].split('.')[0]; // HH:MM:SS


    const sql = `INSERT INTO posts(user_id, user_name, topic, date, time)
                 VALUES (${pool.escape(id_user)}, ${pool.escape(name_user)}, ${pool.escape(topic)},
                         ${pool.escape(date)}, ${pool.escape(time)})`;
    pool.query(sql, (err) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        callback(1);
    });
}

function insertNewComments(postID, topic, callback) {
    const id_user = user.userID;
    const name_user = user.userName;


    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const time = new Date().toISOString().split('T')[1].split('.')[0]; // HH:MM:SS


    const sql = `INSERT INTO comments(post_id, user_id, user_name, comment_text, date, time)
                 VALUES (${pool.escape(postID)}, ${pool.escape(id_user)}, ${pool.escape(name_user)},
                         ${pool.escape(topic)},
                         ${pool.escape(date)}, ${pool.escape(time)})`;
    pool.query(sql, (err) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        callback(1);
    });
}

function loadDuaByCategory(category, callback) {
    const query = `SELECT dua_id, title, dua_text, meaning, source
                   from dua
                   WHERE cat_id = ${pool.escape(category)}
                   order by dua_id asc`;
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Database query error: ' + err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

function loadNotifications(userID, callback) {
    const query = `SELECT *
                   FROM NOTIFICATIONS
                   WHERE USER_ID = ${pool.escape(userID)}
                   ORDER BY TIME DESC`;
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Database query error: ' + err);
            callback(null);
        } else {
            callback(results);
        }
    });
}

function verifyNotification(date, notificationType, callback) {
    const query = `SELECT EXISTS(SELECT *
                                 FROM NOTIFICATIONS
                                 WHERE DATE(TIME) = DATE(${pool.escape(utility.formattedDate(date))})
                                   AND WHAT_FOR = ${pool.escape(notificationType)}
                                 ORDER BY TIME DESC) AS FOUND`;
    let x = pool.query(query, (err, results) => {
        console.log(x.sql)
        if (err) {
            console.error('Database query error: ' + err);
            callback(null);
        } else {
            callback(results[0].FOUND);
        }
    });
}

function insertNewNotification(notificationType, callback) {
    const query = `
        INSERT INTO notifications (USER_ID, WHAT_FOR, TIME)
        SELECT USER_ID, ${pool.escape(notificationType)}, NOW()
        FROM PROFILE;
    `;

    let x = pool.query(query, (err, results) => {
        // console.log(x.sql)
        if (err) {
            console.error('Database query error: ' + err);
            callback(null);
        } else {
            callback(results);
        }
    });
}

function loadDashClasses(callback) {
    const sql = `SELECT post_id,
                        topic,
                        teacher,
                        DATE_FORMAT(date, '%M %d, %Y') as date,
                        TIME_FORMAT(time, '%h:%i %p')  as time,
                        online,
                        address
                 FROM classes order by time asc, date asc limit 2`;


    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        // console.log(results);
        callback(results);
    });
}

function deletePost(postID, callback) {
    const sql = `DELETE FROM POSTS WHERE POST_ID = ${pool.escape(postID)}`;

    pool.query(sql, (err) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(0);
        }
        callback(1);
    });
}

module.exports = {
    checkCredentials,
    insertUser,
    verifyMail,
    updatePassword,
    loadClasses,
    insertNewClasses,
    updatePersonalInfo,
    updateEmail,
    loadAllTasks,
    insertNewTask,
    insertNewPosts,
    loadPosts,
    insertNewComments,
    loadDuas,
    loadDuaByCategory,
    deleteTask,
    loadNotifications,
    verifyNotification,
    insertNewNotification,
    deleteCLass,
    loadDashClasses,
    deletePost
}
