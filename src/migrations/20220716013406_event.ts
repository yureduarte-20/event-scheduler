import { Knex } from "knex";
import { USER_TABLE } from "../model/user.model";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('events', table =>{
        table.increments('id', { primaryKey:true })
        table.string('name').notNullable();
        table.datetime('starts_at').notNullable();
        table.datetime('ends_at').notNullable();

        table.integer('place_id')
        table.integer('user_id')
        table.timestamps()

        table.foreign('user_id').references('id').inTable(USER_TABLE);
        table.foreign('place_id').references('id').inTable('places');
    })
}


export async function down(knex: Knex): Promise<void> {
}

