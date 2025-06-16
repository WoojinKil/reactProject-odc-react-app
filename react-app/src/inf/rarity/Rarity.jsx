import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Rarity.css";
function Rarity() {
  const [rarities, setRarities] = useState([]);
  const [krGmeNm, prdCd]= useState([]);

  // API에서 데이터 가져오기
  useEffect(() => {
	  const token = localStorage.getItem("jwt"); // 로그인 때 저장한 토큰
	  console.log(token);
    axios
      .post("/api/game/selectRarityList",   {
	    krGmeNm: '11',
	    prdCd: 'prdCdSearch'
	  },
	  {
	    headers: {
	      Authorization: `Bearer ${token}`
	    }
	  }
	  ) 
      .then((response) => {
        setRarities(response.data); // 받아온 데이터를 상태에 저장
      })
      .catch((error) => {
        console.error("데이터 불러오기 실패:", error);
      });
  }, []);

  return (
    <div className="container">
      <h1>레어도 관리</h1>
      <div className="search">
        <input className="krGmeNm" type="text" placeholder="코드/게임명" />
        <input className="prdCd" type="text" placeholder="레어도 코드/회사명" />
        <select className="useYn">
          <option>전체</option>
          <option>사용</option>
          <option>미사용</option>
        </select>
        <button>조회</button>
        <button className="register">레어도 등록</button>
      </div>
      <table className="rarity-table">
        <thead>
          <tr>
            <th>게임명</th>
            <th>레어코드</th>
            <th>레어도</th>
            <th>설명</th>
            <th>사용여부</th>
            <th>등록일자</th>
          </tr>
        </thead>
        <tbody>
          {rarities.map((rarity, index) => (
            <tr key={index}>
              <td>{rarity.gmeCd}</td>
              <td>{rarity.rrtyCd}</td>
              <td className="rarity-name">{rarity.rrtyNm}</td>
              <td>{rarity.rrtyDesc}</td>
              <td>{rarity.useYn}</td>
              <td>{rarity.crtDttm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Rarity;  // default export 추가