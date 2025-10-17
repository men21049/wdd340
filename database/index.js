const { Pool } = require('pg');
require('dotenv').config();

/* *****************
 *
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * ****************** */

let pool;

if(process.env.NODE_ENV == 'development') {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        // Enable SSL in development (required by many hosted DBs)
        ssl: {
            rejectUnauthorized: false,
        },
    })

 // Added for troubleshooting queries
 // during development

 module.exports = {
    async query(text, params) {
        try {
            const res = await pool.query(text, params);
            console.log("executed query", { text, params });
            return res;
        } catch(error){
            console.error("error in query", { text});
            throw error;
        }
    },
 }
} else{
    pool = new Pool({
        connectionString: process.env.DATABASE_URL
    })
    module.exports = pool;
}
