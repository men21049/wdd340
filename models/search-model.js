const pool = require("../database/");

async function searchInventory(search_criteria) {
    try {
        console.log('model:'+search_criteria);
        if (!search_criteria || search_criteria.trim() === '') {
            return [];
        }

        const searchTerm = search_criteria.trim();
        
        const sql = `
            SELECT i.*, c.classification_name
            FROM public.inventory i
            JOIN public.classification c ON i.classification_id = c.classification_id
            WHERE inv_make ILIKE $1
               OR inv_model ILIKE $1
               OR inv_description ILIKE $1
               or inv_year::text ILIKE $1
               or inv_color ILIKE $1
               or inv_price::text ILIKE $1
               or inv_miles::text ILIKE $1
               or classification_name::text ILIKE $1
            ORDER BY inv_make ASC
        `;
        
        const values = [`%${searchTerm}%`];
        const result = await pool.query(sql, values);
        return result.rows;
    } catch (error) {
        console.error('searchInventory error: ', error);
        throw error;
    }
}

async function saveSearchHistory(account_id, search_criteria, results_count) {
    try {
        const sql = `
            INSERT INTO public.search_history (account_id, search_criteria,search_date, results_count)
            VALUES ($1, $2, CURRENT_TIMESTAMP,$3)
            RETURNING *
        `;
        const values = [account_id, search_criteria, results_count];
        const result = await pool.query(sql, values);
        return result.rows[0];
    } catch (error) {
        console.error('saveSearchHistory error: ', error);
        throw error;
    }
}

async function getPopularSearches(limit = 10) {
    try {
        const sql = `
            SELECT *
            FROM POPULAR_SEARCH
            ORDER BY search_count DESC
            LIMIT $1
        `;
        const values = [limit];
        const result = await pool.query(sql, values);
        return result.rows;
    } catch (error) {
        console.error('getPopularSearches error: ', error);
        throw error;
    }
}

module.exports = {
    searchInventory,
    saveSearchHistory,
    getPopularSearches,
};