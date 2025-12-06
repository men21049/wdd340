const pool = require("../database/");


async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

async function getInventoryById(inventory_id){
    try{
        const data = await pool.query(
            `SELECT * FROM public.inventory WHERE inv_id = $1`,
            [inventory_id]
        );
        return data.rows;
    }
    catch(error){
        throw error;
    }   
}

async function getInventoryByClassificationId(classification_id){
    try{
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1`,
            [classification_id]
        );
        return data.rows;
    }
    catch(error){
        console.log("getclassificationid error "+ error);
        throw error;
    }
}

async function detailByInventoryId(inventory_id){
    try{
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.inv_id = $1`,
            [inventory_id]
        );
        return data.rows;
    }
    catch(error){
        console.log("detailByInventoryId error "+ error);
        throw error;
    }
}

async function addNewClassification(classificationName) {
    try {
        const sql = 'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *';
        const values = [classificationName];
        const result = await pool.query(sql, values);
        return result.rows[0];
    } catch (error) {
        console.error('addNewClassification error: ', error);
        return error;
    }
}   

async function addNewInventory(classification_id,inv_make,inv_model,inv_description,inv_image,inv_thumbnail,inv_price,inv_year,inv_miles,inv_color) {
    try {
        const sql = `INSERT INTO public.inventory
        (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
        const values = [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id];
        const result = await pool.query(sql, values);
        return result.rows[0];
    }
    catch (error) {
        console.error('addNewInventory error: ', error);
        throw error;
    }
}

async function updateInventory(inv_id, classification_id,inv_make,inv_model,inv_description,inv_image,inv_thumbnail,inv_price,inv_year,inv_miles,inv_color) {
        try {
        const sql = `update public.inventory
        set inv_make = $3,
            inv_model = $4,
            inv_description = $5,
            inv_image = $6,
            inv_thumbnail = $7,
            inv_price = $8,
            inv_year = $9,
            inv_miles = $10,
            inv_color = $11,
            classification_id = $2
        where 
            inv_id = $1 RETURNING *`;
        const values = [inv_id, classification_id,inv_make,inv_model,inv_description,inv_image,inv_thumbnail,inv_price,inv_year,inv_miles,inv_color];
        const result = await pool.query(sql, values);
        return result.rows[0];
    }
    catch (error) {
        console.error('model error: ', error);
        throw error;
    }
}

async function deleteInventory(inv_id) {
    try {
        const sql = 'DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *';   
        const values = [inv_id];
        const result = await pool.query(sql, values);
        return result.rows[0];
    }
    catch (error) {
        console.error('deleteInventory error: ', error);
        throw error;
    }
}

module.exports = {
    getClassifications,
    getInventoryById,
    getInventoryByClassificationId,
    detailByInventoryId,
    addNewClassification,
    addNewInventory,
    updateInventory,
    deleteInventory
};