"use client"
import { useState, useEffect, useCallback } from "react";
import dagre from 'dagre';
import ReactFlow, { useNodesState, useEdgesState, ReactFlowProvider } from "react-flow-renderer";

import { MenuNodeInput, MenuNodeDefault, MenuNodeOutput } from "@/app/component/reactflow/nodetype/MenuNode";

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

export default function Product() {
  const [itemList, setItemList]     = useState<Item[]>([]);
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const [costList, setCostList]     = useState<Cost[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeTypes, setNodeTypes] = useState({
    menuNodeInput: (props) => <MenuNodeInput
      setNodes={ setNodes }
      setEdges={ setEdges }
      {...props} />,
    menuNodeDefault: (props) => <MenuNodeDefault
      setNodes={ setNodes }
      setEdges={ setEdges }
      {...props} />,
    menuNodeOutput: MenuNodeOutput,
  });

  useEffect(() => {
    (async () => {
      const initialItemList = (await (await fetch('/api/item/read')).json()).body;
      const initialRecipeList = (await (await fetch('/api/recipe/read')).json()).body;
      const initialCostList = (await (await fetch('/api/cost/read')).json()).body;
      setItemList(initialItemList);
      setRecipeList(initialRecipeList);
      setCostList(initialCostList);

      setNodes([
        {
          id: "1",
          type: "menuNodeInput",
          data: {
            id: "1",
            parent: null,
            amount: 0,
            itemName: "",
            recipeName: "",
            itemList: initialItemList,
            recipeList: initialRecipeList,
            costList: initialCostList,
          },
        }
      ]);
    })();
  }, []);

  const dagreGraph = new dagre.graphlib.Graph();
  const nodeWidth = 220;
  const nodeHeight = 88;
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB"});

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = 'top';
    node.sourcePosition = 'bottom';

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  const onSubmit = (event) => {
    console.log(itemCount);
    const savedNodes = nodes.map((node) => {
      return {
        id: node.id,
        parent: node.data.parent,
        amount: node.data.amount,
        itemName: node.data.itemName,
        recipeName: node.data.recipeName
      };
    });
    const savedEdges = edges.map((edge) => {
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: edge.animated
      };
    });
  };

  return (
    <>
      <button onClick={onSubmit}>登録</button>
      <ReactFlowProvider>
        <div style={{width: "1920px", height: "1080px"}}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
          >
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </>
  );
}
