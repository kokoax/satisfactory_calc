type Item = {
  id: number;
  name: string;
};

type Recipe = {
  id: number;
  name: string;
};

type Cost = {
  id: number;
  recipe_id: number;
  recipe: Recipe;
  item_id: number;
  item: Item;
  amount: number;
  in_out: string;
};

export { Item, Recipe, Cost };
