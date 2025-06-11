import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
// LoginPage.jsx
function LoginPage() {
  const [lgnId, setUserId] = useState("");
  const [pwd, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("로그인 시도:", { lgnId, pwd });
    // 이후 axios.post로 로그인 API 연동 가능
    try {
		const response = await axios.post('/api/login', {
			lgnId, 
			pwd,
		});
		if(response.data.result === 'S') {
			const token = response.data.loginResult.accessToken;
			localStorage.setItem("jwt", token); 
			window.location.href = "/game";             // 이동
			alert("로그인 성공");
		} else {
			alert("로그인에 실패했습니다. ");
		}
	} catch(error) {
	    console.error("로그인 실패:", error.response?.data || error.message);
        alert("로그인 실패: " + (error.response?.data?.message || "서버 오류"));
	}
    
  };
  
  return (
    <div className="login-wrapper">
      <h2>ODICA <u>BACK OFFICE</u> SYSTEM</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="아이디"
          value={lgnId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={pwd}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="login-actions">
          <button type="button" onClick={() => alert("ID/PW 찾기 이동 예정")}>
            아이디/비밀번호 찾기
          </button>
        </div>
        <button type="submit">로그인</button>
      </form>
      <div className="register-link">
        <span>회원이 아니시라구요? </span>
        <button type="button" onClick={() => navigate("/register")}>
          회원가입
        </button>
      </div>
    </div>
  );
}
export default LoginPage;