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

type NodeData = {
  id: string;
  parent: string;
  amount: number;
  itemName: string;
  recipeName: string;
  setNodes: any;
  setEdges: any;
  itemList: Item[];
  recipeList: Recipe[];
  costList: Cost[];

};

export { Item, Recipe, Cost };
