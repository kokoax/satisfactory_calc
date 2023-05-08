"use client"
import { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react'
import ItemDropdown from "@/app/component/Dropdown"

type Textarea = {
  recipeName: string;
  inName: Map<string, string | number>;
  inAmount: Map<string, string | number>;
  outName: Map<string, string | number>;
  outAmount: Map<string, string | number>;
};

type InCount = {
  num: Number[];
};

type OutCount = {
  num: Number[];
};

type ItemList = {
  id: number;
  name: string;
};

type RecipeList = {
  id: number;
  name: string;
};

export default function Recipe() {
  const [selectedItem, setSelectedItem] = useState("");
  const [searchItemQuery, setSearchItemQuery] = useState("");
  const [recipeList, setRecipeList] = useState<RecipeList[]>([]);
  const [itemList, setItemList] = useState<ItemList[]>([]);
  const [inCount, setInCount] = useState<InCount>({ num: [1] });
  const [outCount, setOutCount] = useState<OutCount>({ num: [1] });
  const [textarea, setTextarea] = useState<Textarea>({
    recipeName: "",
    inName: new Map([["in-name-1", ""]]),
    inAmount: new Map([["in-amount-1", 0]]),
    outName: new Map([["out-name-1", ""]]),
    outAmount: new Map([["out-amount-1", 0]])
  });

  const setMapObject = (mapObject: Map<string, string | number>, key: string, value: string | number) => {
    mapObject.set(key, value);
    return mapObject;
  }

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    const regexInName= /in-name-[0-9]+/;
    const regexInAmount= /in-amount-[0-9]+/;
    const regexOutName = /out-name-[0-9]+/;
    const regexOutAmount= /out-amount-[0-9]+/;

    if(id === "recipe-name") {
      setTextarea((prev) => ({...prev, recipeName: value}));
    } else if(regexInName.exec(id)) {
      setTextarea((prev) => ({...prev, inName: setMapObject(new Map(prev.inName), id, value)}));
    } else if(regexInAmount.exec(id)) {
      setTextarea((prev) => ({...prev, inAmount: setMapObject(new Map(prev.inAmount), id, Number(value))}));
    } else if(regexOutName.exec(id)) {
      setTextarea((prev) => ({...prev, outName: setMapObject(new Map(prev.outName), id, value)}));
    } else if(regexOutAmount.exec(id)) {
      setTextarea((prev) => ({...prev, outAmount: setMapObject(new Map(prev.outAmount), id, Number(value))}));
    }
  };

  const clickInPlus = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newInCount = [...inCount.num];
    newInCount.push(inCount.num.length+1);
    setInCount((prev) => ({...prev, num: newInCount}));
  };

  const clickOutPlus = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newOutCount = [...outCount.num];
    newOutCount.push(outCount.num.length+1);
    setOutCount((prev) => ({...prev, num: newOutCount}));
  };

  const submitRecipe = () => {
    fetch('/api/recipe/create', {
      method: "POST",
      headers: {
        'Contents-Type': 'application/json'
      },
      body: JSON.stringify(textarea, (k, v) => {
        if(v instanceof Map) {
          return {
            dataType: "Map",
            value: [...v]
          }
        }
        return v;
      })
    })
  };

  const filteredItemList =
    searchItemQuery === ''
      ? itemList
      : itemList.filter((item) => {
        return item.name.includes(searchItemQuery);
      });

  useEffect(() => {
    fetch('/api/item/read')
      .then((res) => res.json())
      .then((json) => setItemList(json.body))

    fetch('/api/recipe/read')
      .then((res) => res.json())
      .then((json) => setRecipeList(json.body))
  }, []);

  console.log(textarea);

  return (
    <>
      <p>name</p>
      <textarea id="recipe-name" onChange={handleTextareaChange} />

      <p>入力アイテム</p>
      {inCount.num.map((value) => (<div key={"in-parent"+value}>
        <ItemDropdown id={"in-name-"+value} onChange={handleTextareaChange} />
        <input type="number" min="0" id={"in-amount-"+value} onChange={handleTextareaChange} /><br />
      </div>))}
      <button type="button" onClick={clickInPlus}>+</button>

      <p>出力アイテム</p>
      {outCount.num.map((value) => (<div key={"out-parent"+value}>
        <ItemDropdown id={"out-name-"+value} onChange={handleTextareaChange} />
        <input type="number" min="0" id={"out-amount-"+value} onChange={handleTextareaChange} /><br />
      </div>))}
      <button type="button" onClick={clickOutPlus}>+</button>

      <br />
      <button type="button" onClick={submitRecipe}>登録</button>

      {recipeList.map((recipe) => (<p key={recipe.name}><a href={"/recipe/"+recipe.id}>{recipe.name}</a></p>))}
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
