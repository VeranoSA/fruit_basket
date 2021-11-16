module.exports = function FruitBasket(pool){

    //creating a new fruit basket for a given fruit type, qty & fruit price
async function CreateBasket(fruit, qty, price){
    await pool.query('INSERT INTO fruit_basket (fruit, quantity, unit_price) VALUES ($1, $2, $3)', [fruit, qty, price]);

}
    //find all the fruit baskets for a given fruit type,
async function FindFruit(fruit){
   return await (await pool.query('SELECT * FROM fruit_basket Where fruit = $1', [fruit])).rows;
}
return {
    CreateBasket,
    FindFruit
}
}