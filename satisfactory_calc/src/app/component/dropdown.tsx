import { useState, useEffect } from "react";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Item } from '@/app/component/model/Type'

export default function ItemDropdown(props) {
  const [itemList, setItemList] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    fetch('/api/item/read')
      .then((res) => res.json())
      .then((json) => setItemList(json.body))
  }, []);

  const filteredItem = itemList === ""
    ? itemList
    : itemList.filter((item) => item.name.includes(query));

  const onSelectChange = (selectedItemName) => {
    setSelectedItem(selectedItemName);
    props.onChange({target: { id: props.id, value: selectedItemName } });
  };

  return (
    <Combobox value={ selectedItem } onChange={ onSelectChange }>
      <Combobox.Input placeholder="アイテム名" onChange={(event) => setQuery(event.target.value)} />
      <Combobox.Button>
        <ChevronUpDownIcon
          className="h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </Combobox.Button>
      <Combobox.Options className="absolute">
        { filteredItem.map((item) => (
          <Combobox.Option
              key={ item.name }
              value={ item.name }
              className={ (active) => active ? 'bg-teal-600 text-white' : 'text-gray–900' }
          >
            { item.name }
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
}
