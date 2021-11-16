'use strict'

const assert = require('assert');
const factoryFun = require('../fruitFactory')

const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://tebogo:12345@localhost:5432/my_database';;

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

const factoryBasket = factoryFun(pool);

describe('Fruit Basket', function(){
    beforeEach(async function(){
        await pool.query('delete from fruit_basket;');
    });

it('it should insert/create new basket', async function(){
    await factoryBasket.CreateBasket('Pear', 20, 5)
    const from = await (await pool.query ('SELECT * FROM fruit_basket')).rows[0];

    assert.equal(from.fruit, 'Pear');
    assert.equal(from.quantity, 20);
    assert.equal(from.unit_price, 5);
})

});
