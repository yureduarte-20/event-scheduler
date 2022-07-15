import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', table => {
        table.increments('id', { primaryKey:true })
        table.string('name', 30).notNullable();
        table.string('email', 60).notNullable().unique();
        table.string('password').notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
   return knex.schema.dropTableIfExists('users');
}

