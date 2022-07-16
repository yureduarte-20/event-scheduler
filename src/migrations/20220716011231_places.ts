import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('places', table =>{
        table.increments('id', { primaryKey:true });
        table.string('name', 60).notNullable();
        table.string('neighborhood');
        table.string('street');
        table.string('city').notNullable();
        table.string('cep', 20);
        table.string('state').notNullable();
        table.string('country').notNullable();
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('places');
}

