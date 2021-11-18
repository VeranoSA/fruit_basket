const assert = require('assert');
const factoryFun = require('../fruitFactory')

const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:12345@localhost:5432/mybasket';

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

const factoryBasket = factoryFun(pool);

describe('Fruit Basket', function(){
    beforeEach(async function(){
        await pool.query('DELETE FROM fruit_basket;');
    });

it('it should insert/create new basket', async function(){
    await factoryBasket.CreateBasket('Pear', 20, 5)
    await factoryBasket.CreateBasket('Banana', 10, 25)

    const from = await factoryBasket.SelectAll();

    assert.equal(from.fruit, 'Pear');
    assert.equal(from.quantity, 20);
    assert.equal(from.unit_price, 5);

})
it('it should find all the fruit baskets for a given fruit type BANANA', async function(){
    await factoryBasket.CreateBasket('Pear', 20, 5)
    await factoryBasket.CreateBasket('Banana', 15, 25)
    await factoryBasket.CreateBasket('Banana', 30, 25)

    const findFruit= await factoryBasket.FindFruit('Banana');

    assert.equal(findFruit[0].fruit, 'Banana');
    assert.equal(findFruit[0].quantity, 15);
    assert.equal(findFruit[0].unit_price, 25);

    const findFruit2 = await factoryBasket.FindFruit('Banana');

    assert.equal(findFruit2[1].fruit, 'Banana');
    assert.equal(findFruit2[1].quantity, 30);
    assert.equal(findFruit2[1].unit_price, 25);
})

it('it should update fruit baskets quantity for a given fruit type fruit', async function(){

    await factoryBasket.CreateBasket('Banana', 30, 15);
    await factoryBasket.UpdateFruitNum('Banana', 20);

    const findFruit = await factoryBasket.FindFruit('Banana');

    assert.equal(findFruit[0].fruit, 'Banana');
    assert.equal(findFruit[0].quantity, 50);

})

it('it should show the total price for a given fruit basket,', async function(){
 
    await factoryBasket.CreateBasket('Peach', 10, 3);

    assert.deepEqual(await factoryBasket.BasketTotalPrice('Peach'), {fruit: 'Peach', total: 30});

})

it('it should show the sum of the total of the fruit baskets for a given fruit type.', async function(){
 
    await factoryBasket.CreateBasket('Peach', 10, 3);
    
    assert.deepEqual(await factoryBasket.SumTotalBasket('Peach'), 10);

})


after(function(){
    pool.end();
});

});
