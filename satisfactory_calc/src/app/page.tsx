'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const redirectProduct = () => {
    router.push("/product/");
  }
  const redirectItem = () => {
    router.push("/item/");
  };
  const redirectRecipe = () => {
    router.push("/recipe/");
  };
  const getProduct = () => {
  }
  return (
    <main>
      <button onClick={redirectProduct} className="btn btn-blue">製作物登録</button>
      <button onClick={redirectItem} className="btn btn-blue">アイテム登録</button>
      <button onClick={redirectRecipe} className="btn btn-blue">レシピ登録</button>

      <table className="table-auto">
        <thead>
          <tr><th>クラフト名</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>ターボモータ</td>
          </tr>
          <tr>
            <td>水晶発信機</td>
          </tr>
        </tbody>
      </table>
    </main>
  )
}
