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

module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    detailByInventoryId
};