import React, { memo } from 'react';
import { useState } from "react";
import { Handle, Position } from 'react-flow-renderer';
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const getInItemByRecipeId = (costList, recipeId) => {
  return costList.filter((cost) => {
    return cost.recipe.id === recipeId && cost.in_out === "in"
  }).map((cost) => {
    return { id: cost.item.id, name: cost.item.name, amount: cost.amount }
  });
};

const getOutItemByRecipeId = (costList, recipeId) => {
  return costList.filter((cost) => {
    return cost.recipe.id === recipeId && cost.in_out === "out"
  }).map((cost) => {
    return { id: cost.item.id, name: cost.item.name, amount: cost.amount }
  });
};

const getByItemNameFromOutItem = (costList, itemName) => {
  return costList.filter((cost) => {
    return cost.name === itemName
  }).map((cost) => {
    return { id: cost.id, name: cost.name , amount: cost.amount };
  });
}

const createNewObject = ({id, itemList, recipeList, costList}, itemName, recipeName, amount) => {
  const recipe = recipeList.filter((recipe) => recipe.name === recipeName)[0]
  const inItem = getInItemByRecipeId(costList, recipe.id);
  const outItem = getOutItemByRecipeId(costList, recipe.id);
  const targetItem = getByItemNameFromOutItem(outItem, itemName)[0];

  var count = 0;
  const newNodes = inItem.map((item) => {
    count = count + 1;
    const newId = id + count.toString();
    const isTerminated = costList.filter((cost) => cost.in_out === "out" && cost.item.name === item.name).length === 0;
    return {
      id: newId,
      type: isTerminated ? "menuNodeOutput" : "menuNodeDefault",
      data: {
        id: newId,
        parent: id,
        amount: (item.amount / targetItem.amount) * amount,
        itemName: item.name,
        recipeName: recipe.name,
        itemList: itemList,
        recipeList: recipeList,
        costList: costList
      }
    };
  });

  const newEdges = newNodes.map((node) => {
    return {
      id: "edge-" + id + "-to-" + node.data.id,
      source: node.data.parent,
      target: node.data.id,
      animated: true
    };
  });

  return { newNodes: newNodes, newEdges: newEdges };
};


const MenuNodeInput = memo(function MenuNodeInput({ data, isConnectable, setNodes, setEdges }) {
  const [selectedItem, setSelectedItem]     = useState<string>("");
  const [queryItem, setQueryItem]           = useState<string>("");
  const [selectedRecipe, setSelectedRecipe] = useState<string>("");
  const [queryRecipe, setQueryRecipe]       = useState<string>("");
  const [amount, setAmount]                 = useState<number>(0);

  const filteredItem = queryItem === "" ? data.itemList : data.itemList.filter((item) => {
    return item.name.includes(queryItem);
  });

  const filteredCost = data.costList.filter((cost) => {
    return cost.in_out === "out" && cost.item.name === selectedItem
  });

  const onSelectedRecipe = (selectedRecipeName) => {
    setSelectedRecipe(selectedRecipeName);
    setNodes((prev) => {
      prev[0].data.itemName = selectedItem;
      prev[0].data.recipeName = selectedRecipeName;
      prev[0].data.amount = Number(amount);

      return [...prev];
    });

    const { newNodes, newEdges } = createNewObject(data, selectedItem, selectedRecipeName, amount);
    setNodes((prev) => [...prev, ...newNodes]);
    setEdges((prev) => [...prev, ...newEdges]);
  };

  const onChangeAmount = (event) => {
    setAmount(event.target.value);
  };

  return (
    <>
      <div style={ { width: "220px", height: "88px", borderRadius: "5px", border: "5px solid #000" } }>
        <Combobox value={selectedItem} onChange={setSelectedItem}>
          <Combobox.Input placeholder="アイテム名" onChange={ (event) => setQueryItem(event.target.value) } />
          <Combobox.Button>
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
          <Combobox.Options>
            { filteredItem.map((item) => (
              <Combobox.Option key={ item.name } value={ item.name }>
                { item.name }
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>

        <Combobox value={ selectedRecipe } onChange={ onSelectedRecipe }>
          <Combobox.Input placeholder="レシピ名" onChange={ (event) => setQueryRecipe(event.target.value) } />
          <Combobox.Button>
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>

          <Combobox.Options>
            { filteredCost.map((cost) => (
              <Combobox.Option key={cost.recipe.name} value={cost.recipe.name}>
                {cost.recipe.name}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>

        <input type="number" min="0" step="1" value={amount} onChange={ onChangeAmount } />
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
        />
      </div>
    </>
  );
});

const MenuNodeDefault = memo(function MenuNodeDefault({ data, isConnectable, setNodes, setEdges }) {
  const [selectedRecipe, setSelectedRecipe] = useState<string>("");
  const [queryRecipe, setQueryRecipe] = useState<string>("");

  const onSelectedRecipe = (selectedRecipeName) => {
    setSelectedRecipe(selectedRecipeName);

    const { newNodes, newEdges } = createNewObject(data, data.itemName, selectedRecipeName, data.amount);
    setNodes((prev) => [...prev, ...newNodes]);
    setEdges((prev) => [...prev, ...newEdges]);
  };

  const filteredCost = data.costList.filter((cost) => {
    return cost.in_out === "out" && cost.item.name === data.itemName
  });

  return (
    <>
      <div style={ { width: "220px", height: "88px", borderRadius: "5px", border: "1px solid #eee" } }>
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
        />
        <div>
          <center>{data.itemName}</center>
        </div>
        <Combobox value={ selectedRecipe } onChange={ onSelectedRecipe }>
          <Combobox.Input placeholder="レシピ名" onChange={(event) => setQueryRecipe(event.target.value)} />
          <Combobox.Button>
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
          <Combobox.Options>
            { filteredCost.map((cost) => (
              <Combobox.Option key={cost.recipe.name} value={cost.recipe.name}>
                {cost.recipe.name}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
        />
      </div>
    </>
  );
});

const MenuNodeOutput = memo(function menuNodeOutput({ data, isConnectable }) {
  return (
    <>
      <div style={ { width: "220px", height: "88px", borderRadius: "5px", border: "1px solid #eee" } }>
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
        />
        <div>
          <center>{data.itemName}</center>
        </div>
      </div>
    </>
  );
});

export { MenuNodeInput, MenuNodeDefault, MenuNodeOutput };
