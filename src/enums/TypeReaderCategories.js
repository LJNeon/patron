/**
 * The type reader categories.
 * @enum {number}
 * @readonly
 */

const TypeReaderCategories = {
  /** Global type readers. */
  Global: Symbol(),
  /** Library-specific type readers. */
  Library: Symbol(),
  /** User-made type readers. */
  User: Symbol()
};

module.exports = TypeReaderCategories;
