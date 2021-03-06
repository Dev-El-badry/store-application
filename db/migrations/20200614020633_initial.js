const Knex = require('knex');
const tableNames = require('../../src/constants/tableNames');
const {
    addDefaultColumns,
    createNameTable,
    references,
    url,
    email
} = require('../../src/lib/tabletUtils');


exports.up = async (knex) => {

    await Promise.all([
        knex.schema.createTable(tableNames.user, (table) => {
            table.increments().notNullable();
            email(table, 'email').notNullable().unique();
            table.string('password', 127).notNullable();
            table.string('name', 254).notNullable();
            table.datetime('last_login');

            addDefaultColumns(table);
        }),
        createNameTable(knex, tableNames.item_type),

        createNameTable(knex, tableNames.shape),

        knex.schema.createTable(tableNames.country, (table) => {
            table.increments().notNullable();
            table.string('name', 254);
            table.string('code');
            addDefaultColumns(table);
        }),


        knex.schema.createTable(tableNames.location, (table) => {
            table.increments().notNullable();
            table.text('description', 1000);
            url(table, 'image_url');
            addDefaultColumns(table);
        })
    ]);

    await knex.schema.createTable(tableNames.state, (table) => {
            table.increments().notNullable();
            table.string('name', 254);
            table.string('code');
           
            references(table, tableNames.country, false);
            addDefaultColumns(table);
        }),


        await knex.schema.createTable(tableNames.address, (table) => {
            table.increments().notNullable();
            table.string('street_address_1', 50).notNullable();
            table.string('street_address_2', 50);
            table.string('city', 50).notNullable();
            table.string('zipcode', 15).notNullable();
            table.float('latitude').notNullable();
            table.float('longitude').notNullable();
            references(table, tableNames.state);
            addDefaultColumns(table);

        });

    await knex.schema.createTable(tableNames.manufacture, (table) => {
        table.increments().notNullable();
        table.string('name').notNullable();
        url(table, 'logo_url');
        table.string('description', 1000);
        url(table, 'website_url');
        email(table, 'email');
        references(table, 'address');
        addDefaultColumns(table);

    });


};

exports.down = async (knex) => {

    await Promise.all([
        tableNames.user,
        tableNames.item_type,
        tableNames.shape,
        tableNames.location,
        tableNames.country,
        tableNames.manufacture,
        tableNames.address,
        tableNames.state,
    ].map(tablename => knex.schema.dropTable(tablename)));


    await knex.schema.dropTable(tableNames.user);

};