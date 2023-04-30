"use client"
import {useState, useEffect} from 'react';

type FormData = {
  itemName: string;
};

export default function Item() {
  const [formData, setFormData] = useState<FormData>({itemName: ''});
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if(formData.itemName == '') {
      setErrorMessage('not allowed text area empty');
      return;
    }

    event.preventDefault();
    const res = await fetch('/api/item/create', {
      method: 'POST',
      headers: {
        'Contents-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    if(res.ok) {
      console.log('item create success');
    } else {
      console.log('item create failed');
      setErrorMessage('item create failed');
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {name, value} = event.target;
    console.log(name);
    console.log(value);
    setFormData((prev) => ({...prev, [name]: value}));
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea className={errorMessage ? 'error' : ''} name="itemName" value={formData.itemName} onChange={handleChange}></textarea>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button className="btn btn-blue" type="submit">登録</button>
    </form>
  )
}
