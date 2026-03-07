/**
 * Migration: Rename transcript plugin UID
 *
 * Updates Strapi internal metadata after migrating from the standalone
 * `yt-transcript-strapi-plugin` to the ai-sdk extension `ai-sdk-yt-transcripts`.
 *
 * Handles two possible source UIDs:
 * 1. plugin::yt-transcript-strapi-plugin.transcript (original standalone)
 * 2. plugin::ai-sdk-transcripts.transcript (intermediate rename)
 *
 * The actual `transcript` table stays the same (collectionName is unchanged).
 * Only the content-manager configuration key and its embedded UID need updating.
 */

const TARGET_UID = 'plugin::ai-sdk-yt-transcripts.transcript';
const TARGET_KEY = `plugin_content_manager_configuration_content_types::${TARGET_UID}`;

const OLD_UIDS = [
  'plugin::yt-transcript-strapi-plugin.transcript',
  'plugin::ai-sdk-transcripts.transcript',
];

export async function up(knex) {
  // Check if target already exists
  const existing = await knex('strapi_core_store_settings')
    .where('key', TARGET_KEY)
    .first();

  if (existing) {
    console.log(`[migration] Target key already exists (${TARGET_KEY}), skipping.`);
    return;
  }

  // Try each old UID
  for (const oldUid of OLD_UIDS) {
    const oldKey = `plugin_content_manager_configuration_content_types::${oldUid}`;
    const row = await knex('strapi_core_store_settings')
      .where('key', oldKey)
      .first();

    if (row) {
      const updatedValue = row.value.replaceAll(oldUid, TARGET_UID);

      await knex('strapi_core_store_settings')
        .where('key', oldKey)
        .update({
          key: TARGET_KEY,
          value: updatedValue,
        });

      console.log(`[migration] Renamed transcript plugin UID: ${oldUid} → ${TARGET_UID}`);
      return;
    }
  }

  console.log(`[migration] No existing transcript plugin config found, skipping.`);
}

export async function down(knex) {
  // Revert to the intermediate name (ai-sdk-transcripts)
  const revertUid = 'plugin::ai-sdk-transcripts.transcript';
  const revertKey = `plugin_content_manager_configuration_content_types::${revertUid}`;

  const row = await knex('strapi_core_store_settings')
    .where('key', TARGET_KEY)
    .first();

  if (!row) return;

  const revertedValue = row.value.replaceAll(TARGET_UID, revertUid);

  await knex('strapi_core_store_settings')
    .where('key', TARGET_KEY)
    .update({
      key: revertKey,
      value: revertedValue,
    });

  console.log(`[migration] Reverted transcript plugin UID: ${TARGET_UID} → ${revertUid}`);
}
