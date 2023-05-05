"use client"
import { useState, useEffect } from 'react';

type Item = {
  id:   number;
  name: string;
};

type Recipe = {
  id:   number;
  name: string;
};

type Cost = {
  id:        number;
  recipe_id: number;
  item_id:   number;
  amount:    number;
  in_out:    string;
  recipe:    Recipe;
  item:      Item;
};

export default function DetailRecipe({ params }) {
  const [recipe, setRecipe] = useState<Recipe>({id: 0, name: ""});
  const [cost, setCost] = useState<Cost[]>([]);
  const { recipeId } = params;

  useEffect(() => {
    fetch('/api/recipe/read/'+recipeId)
      .then((res) => res.json())
      .then((json) => setRecipe(json.body));

    fetch('/api/cost/read/'+recipeId)
      .then((res) => res.json())
      .then((json) => setCost(JSON.parse(json.body)));
  }, []);

  console.log(typeof cost);
  console.log(cost);
  const inCost = cost.filter((c) => c.in_out === "in");
  const outCost = cost.filter((c) => c.in_out === "out");

  return (
    <>
      <p>レシピ名</p>
      <p>- {recipe.name}</p>
      <p>入力アイテム</p>
      {inCost.map((c) => (<p key={c.item.name}>- {c.item.name}: {c.amount}</p>))}
      <p>出力アイテム</p>
      {outCost.map((c) => (<p key={c.item.name}>- {c.item.name}: {c.amount}</p>))}
    </>
  );
}
/* 需要があればそのうちアイテム入力をComboboxを使うように修正しても良い
      <Combobox value={ selectedItem } onChange={ setSelectedItem }>
        <Combobox.Input onChange={ (event) => setSearchItemQuery(event.target.value) } />
        <Combobox.Options>
          {filteredItemList.map((item) => (
            <Combobox.Option key={ item.id } value={ item.name }>{ item.name }</Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
*/
