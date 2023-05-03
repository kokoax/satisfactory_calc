"use client"
import { useState, useEffect } from 'react';

type FormData = {
  itemName: string;
};

type ItemList = {
  id: number;
  name: string;
}

export default function Item() {
  const [formData, setFormData] = useState<FormData>({itemName: ''});
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [itemList, setItemList] = useState<ItemList[]>([]);

  const postItemCreate = async (formData: FormData) => {
    return await fetch('/api/item/create', {
      method: 'POST',
      headers: {
        'Contents-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
  }

  const getItemAll = () => {
    return fetch('/api/item/read')
  };

  const postItemDelete = (id: int) => {
    fetch
  };

  const handleDeleteClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    return await fetch('/api/item/delete/' + event.target.id, {
      method: 'POST',
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if(formData.itemName == '') {
      setErrorMessage('not allowed text area empty');
      return;
    }


    const postItemCreateResponse = await postItemCreate(formData);
    if(postItemCreateResponse.ok) {
      console.log('item create success');
    } else {
      console.log('item create failed');
      setErrorMessage('item create failed');
    }

    const itemAllResponse = getItemAll();
    if(itemAllResponse.ok) {
      itemAllResponse
        .then(r => r.json())
        .then(j => setItemList(j.body));
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {name, value} = event.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  useEffect(() => {
    const itemAllResponse = getItemAll();
    itemAllResponse
      .then(r => r.json())
      .then(j => setItemList(j.body));
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <textarea className={errorMessage ? 'error' : ''} name="itemName" value={formData.itemName} onChange={handleChange}></textarea>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="btn btn-blue" type="submit">登録</button>
        <h1>登録されているアイテム</h1>
        <ul>
          {
            itemList.map((value) =>
              (
                <li key={value.name}>
                  {value.name} <button onClick={handleDeleteClick} key={value.id} id={value.id}>Delete</button>
                </li>
              )
            )
          }
        </ul>
      </form>
    </>
  )
}
