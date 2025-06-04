import React, { useState } from "react";
import axios from "axios";
import "./RegisterPage.css";
import { useNavigate } from 'react-router-dom';
function RegisterPage() {
  const [form, setForm] = useState({
    usrNm: "",
    lgnId: "",
    pwd: "",
    confirmPassword: "",
    email: "",
    emailCode: "",
    phone: "",
    address: "",
    roleType: "",
    addressDetail :""
  });

  const [errors, setErrors] = useState({});
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [idVerified, setIdVerified] = useState(false);
  const navigate = useNavigate();
  // 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 유효성 검사
  const validate = () => {
    if (!form.usrNm.trim()) {
      alert("이름을 입력해주세요.");
      return false;
    }
    if (!form.lgnId.trim()) {
      alert("아이디를 입력해주세요.");
      return false;
    }
    if (form.pwd !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return false;
    }
    if (!form.address.trim()) {
      alert("주소를 입력해주세요.");
      return false;
    }
    return true;
  };


  
	// 이메일 중복체크
  const checkDupEmail = async () => {
	  try {
		  //인증코드 하기전에 중복체크 
	    const res = await axios.post("/api/join/selectEmailDupCheck", {
	      email: form.email
	    });
	    if(res.data.result === 'S') {
		  if(res.data.emailDupCheck === 'D') {
			  alert("중복된 이메일입니다.");
		  }else {
			 sendEmailCode();
		  }
		}
	  } catch (err) {
	    alert(err.response.data.message || "오류가 발생했습니다.");
	  }
  };
  
  	// 아이디 중복체크
  const checkDupId = async () => {
	  try {
		  
	    const res = await axios.post("/api/join/selectIdDupCheck", {
	      lgnId: form.lgnId
	    });
	    if(res.data.result === 'S') {
		  if(res.data.idDupCheck === 'D') {
			  alert("중복된 아이디입니다.");
		  }else if (res.data.idDupCheck === 'N') {
			  alert("사용가능한 아이디입니다.");
			  setIdVerified(true);
		  }
		}
	  } catch (err) {
	    alert(err.response.data.message || "오류가 발생했습니다.");
	  }
  };
  const sendEmailCode = async() => {
	 try {
		  //인증코드 하기전에 중복체크 
	    const res = await axios.post("/api/join/sendEmailCode", {
	      email: form.email
	    });
	    if(res.data.result == "S") {
		  
		 
		}
	  } catch (err) {
	    alert(err.response.data.message || "오류가 발생했습니다.");
	  }
  }
	
  // 이메일 인증 확인
  const verifyEmailCode = async () => {
    const res = await axios.post("/api/join/selectVerifyEmailCode", {
      email: form.email,
      code: form.emailCode,
    });
    if (res.data.currectResult === "S") {
      setEmailVerified(true);
      alert("이메일 인증이 완료되었습니다.");
    } else {
      alert("인증코드가 올바르지 않습니다.");
    }
  };

  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    if (!idVerified) {
      alert("아이디 중복확인을 완료해주세요.");
      return;
    }

    if (!emailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    try {
	  console.log(form.addressDetail);
      const fullAddress = `${form.address} ${form.addressDetail}`.trim();
	  const submitData = {
         ...form,
         address: fullAddress
      };
      const res = await axios.post("/api/join/saveUser", submitData);
      if (res.data.result === "S") {
        if (window.confirm("회원가입이 완료되었습니다.\n관리자의 승인을 기다려 주십시오.\n로그인 화면으로 이동하시겠습니까?")) {
        // 로그인 페이지로 이동
         window.location.href = "/login";  // 라우팅 방식에 따라 수정 가능
        }
      } else {
        alert("회원가입에 실패했습니다. ");
      }
      // navigate('/login');
    } catch (err) {
      alert("회원가입에 실패했습니다.  " + err.response?.data?.message);
    }
  };
  const openDaumPostcode = () => {
  new window.daum.Postcode({
    oncomplete: function (data) {
      // 최종 주소 조합
      let fullAddr = data.address;
      let extraAddr = "";

      if (data.addressType === "R") {
        if (data.bname !== "") extraAddr += data.bname;
        if (data.buildingName !== "") {
          extraAddr += extraAddr !== "" ? `, ${data.buildingName}` : data.buildingName;
        }
        if (extraAddr !== "") fullAddr += ` (${extraAddr})`;
      }

      // 주소 상태 반영
      setForm((prev) => ({ ...prev, address: fullAddr }));
    },
  }).open();
};


  return (
    <form onSubmit={handleSubmit}>
	  <table className="register-dual-table">
	    <tbody>
	      <tr>
	        <th><span className="required">*</span>이름</th>
	        <td>
	          <input name="usrNm" value={form.usrNm} onChange={handleChange} />
	          {errors.usrNm && <p className="error">{errors.usrNm}</p>}
	        </td>

	        <th><span className="required">*</span>아이디</th>
	        <td>
	          <input name="lgnId" maxLength={7} value={form.lgnId} disabled={idVerified} onChange={handleChange} />
	          <button type="button" onClick={checkDupId} disabled={idVerified}>{idVerified ? "중복확인 완료" : "중복확인"}</button>
	          {errors.lgnId && <p className="error">{errors.lgnId}</p>}
	        </td>
	      </tr>
	      <tr>
	        <th><span className="required">*</span>비밀번호</th>
	        <td>
	          <input type="password" name="pwd" value={form.pwd} onChange={handleChange} />
	          {errors.pwd && <p className="error">{errors.pwd}</p>}
	        </td>

	        <th><span className="required">*</span>비밀번호 확인</th>
	        <td>
	          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
	          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
	        </td>
	      </tr>
	      <tr>
	        <th><span className="required">*</span>이메일</th>
	        <td>
	          <input  name="email" value={form.email} onChange={handleChange} readOnly={emailVerified}/>
	          <button type="button" onClick={checkDupEmail}>인증요청</button>
	          {emailVerified && <span className="verified">✔ 인증 완료</span>}
	        </td>
	        <th><span className="required">*</span>인증코드</th>
	        <td>
	          <input name="emailCode" value={form.emailCode} onChange={handleChange} />
	          <button type="button" onClick={verifyEmailCode} disabled={emailVerified}>{emailVerified ? "인증확인 완료" : "인증확인"}</button>
	        </td>
	      </tr>
	      <tr>
	        <th><span className="required">*</span>휴대폰 번호<br/>(- 제외)</th>
	        <td>
	          <input name="phone"
					  value={form.phone}
					  onChange={(e) => {
					    const onlyNums = e.target.value.replace(/[^0-9]/g, "");
					    setForm((prev) => ({ ...prev, phone: onlyNums }));
					  }}
					  maxLength={11}
					  placeholder="숫자만 입력하세요"
					/>

	          {errors.phone && <p className="error">{errors.phone}</p>}
	        </td>

	        <th><span className="required">*</span>관리자 유형</th>
	        <td>
	          <select name="roleTp" value={form.roleTp} onChange={handleChange}>
			    <option value="">-- 선택하세요 --</option>
			      <option value="SYSTEM_ADMIN">시스템관리자</option>
			      <option value="ADMIN">일반관리자</option>
			      <option value="VIEWER">조회전용관리자</option> {/* 향후 추가 가능 */}
			    </select>
            </td>
	      </tr>
	      <tr>
	        <th><span className="required">*</span>주소</th>
	        <td >
	          <div className="address-group">
	          	<input name="address" value={form.address} readOnly placeholder="주소를 검색해주세요."/>
	          	<button type="button"  onClick={openDaumPostcode}>주소검색</button>
	          	<input name="addressDetail" value={form.addressDetail} onChange={handleChange} placeholder="상세주소를 입력해주세요."/>
	          </div>
	          {errors.address && <p className="error">{errors.address}</p>}
	        </td>
	      </tr>
	     

	    </tbody>
	  </table>
	
	  <div className="submit-btn-wrap">
	    
	    <button type="submit">가입하기</button>
	    <button type="button"    onClick={() => navigate('/login')} className="back-login-btn"> 로그인 화면으로 돌아가기
        </button>
	  </div>
	</form>

  );
}

export default RegisterPage;
