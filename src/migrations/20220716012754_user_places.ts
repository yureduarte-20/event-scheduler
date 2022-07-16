import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('user_places', table =>{
        table.increments("id", {  primaryKey:true});
        table.integer('user_id')
        table.integer('place_id')

        table.foreign('user_id').references('id').inTable('users')
        table.foreign('place_id').references('id').inTable('places')
    })
}


export async function down(knex: Knex): Promise<void> {
}

