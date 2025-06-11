import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Game.css";
function Game() {
  const [games, setGames] = useState([]);
  const [krGmeNm, prdCd]= useState([]);

  // API에서 데이터 가져오기
  useEffect(() => {
	  const token = localStorage.getItem("jwt"); // 로그인 때 저장한 토큰
	  console.log(token);
    axios
      .post("/api/game/selectGameList",   {
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
        setGames(response.data); // 받아온 데이터를 상태에 저장
      })
      .catch((error) => {
        console.error("데이터 불러오기 실패:", error);
      });
  }, []);

  return (
    <div className="container">
      <h1>게임 관리</h1>
      <div className="search">
        <input className="krGmeNm" type="text" placeholder="코드/게임명" />
        <input className="prdCd" type="text" placeholder="회사 코드/회사명" />
        <select className="useYn">
          <option>전체</option>
          <option>사용</option>
          <option>미사용</option>
        </select>
        <button>조회</button>
        <button className="register">게임 등록</button>
      </div>
      <table className="game-table">
        <thead>
          <tr>
            <th>코드</th>
            <th>게임명</th>
            <th>제작사</th>
            <th>유통사</th>
            <th>등록일자</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => (
            <tr key={index}>
              <td>{game.gmeCd}</td>
              <td className="game-name">{game.krGmeNm}</td>
              <td>{game.prdCd}</td>
              <td>{game.dstbtrCd}</td>
              <td>{game.crtDttm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Game;  // default export 추가