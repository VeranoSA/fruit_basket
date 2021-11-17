module.exports = function FruitBasket(pool){

    //creating a new fruit basket for a given fruit type, qty & fruit price
async function CreateBasket(fruit, qty, price){
    await pool.query('INSERT INTO fruit_basket (fruit, quantity, unit_price) VALUES ($1, $2, $3)', [fruit, qty, price]);

}
    //find all the fruit baskets for a given fruit type,
async function FindFruit(fruit){
   return await (await pool.query('SELECT * FROM fruit_basket Where fruit = $1', [fruit])).rows;
}
    //update the number of fruits in a given basket,
async function UpdateFruitNum(fruitsName, qty){
    await pool.query('UPDATE fruit_basket SET quantity = quantity + $2 WHERE fruit = $1', [fruitsName, qty])
} 
    //show the total price for a given fruit basket,
async function BasketTotalPrice(totalprice){
   const prices = await pool.query('SELECT fruit, (quantity * unit_price) AS total FROM fruit_basket WHERE fruit = $1',[totalprice]);
    return prices.rows[0];
}
//show the sum of the total of the fruit baskets for a given fruit type.
async function SumTotalBasket(totalprice){
    const prices = await pool.query('SELECT fruit, (quantity * unit_price) AS sum FROM fruit_basket WHERE fruit = $1',[totalprice]);
     return prices.rows[0];
 }

return {
    CreateBasket,
    FindFruit,
    UpdateFruitNum,
    BasketTotalPrice,
    SumTotalBasket
}
}