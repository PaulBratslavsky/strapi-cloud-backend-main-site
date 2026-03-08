/**
 * Migration: Rename yt-embeddings plugin UID
 *
 * Updates Strapi internal metadata after migrating from the standalone
 * `yt-embeddings-strapi-plugin` to the ai-sdk extension `ai-sdk-yt-embeddings`.
 *
 * This plugin has no Strapi content types (uses direct Neon tables),
 * so only admin_permissions need updating.
 */

const OLD_UID = 'plugin::yt-embeddings-strapi-plugin';
const NEW_UID = 'plugin::ai-sdk-yt-embeddings';

export async function up(knex) {
  // Update RBAC permissions (e.g. plugin::yt-embeddings-strapi-plugin.read → plugin::ai-sdk-yt-embeddings.read)
  const updated = await knex('admin_permissions')
    .where('action', 'like', `${OLD_UID}.%`)
    .update({
      action: knex.raw(`REPLACE(action, ?, ?)`, [OLD_UID, NEW_UID]),
    });

  console.log(`[migration] Updated ${updated} admin_permissions: ${OLD_UID} → ${NEW_UID}`);

  // Update strapi_core_store_settings if any config references exist
  const rows = await knex('strapi_core_store_settings')
    .where('key', 'like', `%yt-embeddings-strapi-plugin%`)
    .select('id', 'key', 'value');

  for (const row of rows) {
    const newKey = row.key.replace(/yt-embeddings-strapi-plugin/g, 'ai-sdk-yt-embeddings');
    const newValue = row.value.replace(/yt-embeddings-strapi-plugin/g, 'ai-sdk-yt-embeddings');

    await knex('strapi_core_store_settings')
      .where('id', row.id)
      .update({ key: newKey, value: newValue });

    console.log(`[migration] Updated core_store key: ${row.key} → ${newKey}`);
  }
}

export async function down(knex) {
  const updated = await knex('admin_permissions')
    .where('action', 'like', `${NEW_UID}.%`)
    .update({
      action: knex.raw(`REPLACE(action, ?, ?)`, [NEW_UID, OLD_UID]),
    });

  console.log(`[migration] Reverted ${updated} admin_permissions: ${NEW_UID} → ${OLD_UID}`);

  const rows = await knex('strapi_core_store_settings')
    .where('key', 'like', `%ai-sdk-yt-embeddings%`)
    .select('id', 'key', 'value');

  for (const row of rows) {
    const newKey = row.key.replace(/ai-sdk-yt-embeddings/g, 'yt-embeddings-strapi-plugin');
    const newValue = row.value.replace(/ai-sdk-yt-embeddings/g, 'yt-embeddings-strapi-plugin');

    await knex('strapi_core_store_settings')
      .where('id', row.id)
      .update({ key: newKey, value: newValue });
  }
}
