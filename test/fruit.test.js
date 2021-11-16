const assert = require('assert');
const factoryFun = require('../fruitFactory')

const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgres://tebza:12345@localhost:5432/mybasket';

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

    const from = await (await pool.query ('SELECT * FROM fruit_basket')).rows[0];

    assert.equal(from.fruit, 'Pear');
    assert.equal(from.quantity, 20);
    assert.equal(from.unit_price, 5);

    const from2 = await (await pool.query ('SELECT * FROM fruit_basket')).rows[1];

    assert.equal(from2.fruit, 'Banana');
    assert.equal(from2.quantity, 10);
    assert.equal(from2.unit_price, 25);
})
it('it should find all the fruit baskets for a given fruit type BANANA', async function(){
    await factoryBasket.CreateBasket('Pear', 20, 5)
    await factoryBasket.CreateBasket('Banana', 15, 25)
    await factoryBasket.CreateBasket('Banana', 30, 25)

    const from = await factoryBasket.FindFruit('Banana');

    assert.equal(from[0].fruit, 'Banana');
    assert.equal(from[0].quantity, 15);
    assert.equal(from[0].unit_price, 25);

    const from2 = await factoryBasket.FindFruit('Banana');

    assert.equal(from2[1].fruit, 'Banana');
    assert.equal(from2[1].quantity, 30);
    assert.equal(from2[1].unit_price, 25);
})

});
