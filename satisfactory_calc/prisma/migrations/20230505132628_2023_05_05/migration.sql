/*
  Warnings:

  - You are about to alter the column `amount` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `amount` on the `Cost` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "item_id" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    CONSTRAINT "Product_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("amount", "id", "item_id", "name") SELECT "amount", "id", "item_id", "name" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_Cost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recipe_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "in_out" TEXT NOT NULL,
    CONSTRAINT "Cost_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Cost_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cost" ("amount", "id", "in_out", "item_id", "recipe_id") SELECT "amount", "id", "in_out", "item_id", "recipe_id" FROM "Cost";
DROP TABLE "Cost";
ALTER TABLE "new_Cost" RENAME TO "Cost";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
