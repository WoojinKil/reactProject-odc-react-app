import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Product.css";
function Product() {
  const [products, setGames] = useState([]);
  const [searchGame, setSearchGame] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [useYn, setUseYn] = useState("");
  // API에서 데이터 가져오기
  useEffect(() => {
	 
	 
	 
  }, []);
  const handleSearch = () => {
  const token = localStorage.getItem("jwt"); // 로그인 때 저장한 토큰
  axios.post("/api/game/selectProductList",
      {
        searchGame,
        searchProduct,
        useYn,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((response) => {
      setGames(response.data);
    }).catch((error) => {
      console.error("데이터 불러오기 실패:", error);
    });
  };
  return (
 <div className="container">
  <h1>게임별 상품 관리</h1>

  {/* 🔍 검색 영역 */}
  <div className="search">
    <input
      className="input-game"
      type="text"
      placeholder="게임코드 / 게임명"
      value={searchGame}
      onChange={(e) => setSearchGame(e.target.value)}
    />
    <input
      className="input-product"
      type="text"
      placeholder="상품코드 / 상품명"
      value={searchProduct}
      onChange={(e) => setSearchProduct(e.target.value)}
    />
    <select
      className="select-use-yn"
      value={useYn}
      onChange={(e) => setUseYn(e.target.value)}
    >
      <option value="">전체</option>
      <option value="Y">사용</option>
      <option value="N">미사용</option>
    </select>
    <button onClick={handleSearch}>조회</button>
    <button className="register" >상품 등록</button>
  </div>

  {/* 📦 상품 목록 */}
  <table className="product-table">
    <thead>
      <tr>
        <th>게임명</th>
        <th>상품코드</th>
        <th>상품명</th>
        <th>구분</th>
        <th>사용여부</th>
        <th>등록일자</th>
      </tr>
    </thead>
    <tbody>
      {products.map((product, index) => (
        <tr key={index}>
          <td>{product.gmeCd}</td>
          <td>
            <a href={`/products/${product.productCd}`} className="link">
              {product.productCd}
            </a>
          </td>
          <td>{product.productNm}</td>
          <td>{product.productType}</td>
          <td>{product.useYn === 'Y' ? '사용' : '미사용'}</td>
          <td>{product.crtDttm}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
}
export default Product;  // default export 추가