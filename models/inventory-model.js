const pool = require("../database/");


async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
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
        throw error;
    }
}   

async function addNewInventory(inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) {
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


module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    detailByInventoryId,
    addNewClassification,
};