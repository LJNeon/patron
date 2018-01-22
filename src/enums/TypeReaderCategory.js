/**
 * The type reader categories.
 * @enum {Symbol}
 * @readonly
 */

const TypeReaderCategory = {
  /** Global type readers. */
  Global: Symbol(),
  /** Library-specific type readers. */
  Library: Symbol(),
  /** User-made type readers. */
  User: Symbol()
};

module.exports = TypeReaderCategory;
