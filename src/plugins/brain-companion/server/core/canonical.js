'use strict';

// JSON with every object's keys sorted, for comparing stored values. Postgres `jsonb` does not keep
// key order (it sorts keys by length, then bytes), so a value read back from prod can list its keys
// differently from the one written, and a plain JSON.stringify compare calls them different.

function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, sortKeys(value[k])]));
  }
  return value;
}

// undefined stays undefined, as with JSON.stringify, so a missing field still differs from null.
const canonical = (value) => JSON.stringify(sortKeys(value));
const sameValue = (a, b) => canonical(a) === canonical(b);

module.exports = { canonical, sameValue, sortKeys };
