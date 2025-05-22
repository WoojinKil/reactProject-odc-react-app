import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
// LoginPage.jsx
function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("로그인 시도:", { userId, password });
    // 이후 axios.post로 로그인 API 연동 가능
  };
  
  return (
    <div className="login-wrapper">
      <h2>ODICA <u>BACK OFFICE</u> SYSTEM</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
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