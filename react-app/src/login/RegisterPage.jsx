import React, { useState } from "react";
import axios from "axios";
import "./RegisterPage.css";

function RegisterPage() {
  const [form, setForm] = useState({
    userName: "",
    userId: "",
    password: "",
    confirmPassword: "",
    email: "",
    emailCode: "",
    phoneNumber: "",
    address: "",
    roleType: "",
  });

  const [errors, setErrors] = useState({});
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 유효성 검사
  const validate = () => {
    if (!form.userName.trim()) {
      alert("이름을 입력해주세요.");
      return false;
    }
    if (!form.userId.trim()) {
      alert("아이디를 입력해주세요.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return false;
    }
    if (!form.address.trim()) {
      alert("주소를 입력해주세요.");
      return false;
    }
    return true;
  };

  // 아이디 중복 확인
  const checkUserId = async () => {
    const res = await axios.get(`/api/check-id?userId=${form.userId}`);
    alert(res.data.available ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다.");
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
  const sendEmailCode = async() => {
	 try {
		  //인증코드 하기전에 중복체크 
	    const res = await axios.post("/join/sendEmailCode", {
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
    const res = await axios.post("//verify-code", {
      email: form.email,
      code: form.emailCode,
    });
    if (res.data.verified) {
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

    if (!emailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    try {
      await axios.post("/api/register", form);
      alert("회원가입 완료!");
      // navigate('/login');
    } catch (err) {
      alert("회원가입 실패: " + err.response?.data?.message);
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
	          <input name="userName" value={form.userName} onChange={handleChange} />
	          {errors.userName && <p className="error">{errors.userName}</p>}
	        </td>

	        <th><span className="required">*</span>아이디</th>
	        <td>
	          <input name="userId" value={form.userId} onChange={handleChange} />
	          <button type="button" onClick={checkUserId}>중복확인</button>
	          {errors.userId && <p className="error">{errors.userId}</p>}
	        </td>
	      </tr>
	      <tr>
	        <th><span className="required">*</span>비밀번호</th>
	        <td>
	          <input type="password" name="password" value={form.password} onChange={handleChange} />
	          {errors.password && <p className="error">{errors.password}</p>}
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
	          <button type="button" onClick={verifyEmailCode}>인증확인</button>
	          {errors.emailCode && <p className="error">{errors.emailCode}</p>}
	        </td>
	      </tr>
	      <tr>
	        <th><span className="required">*</span>휴대폰 번호<br/>(- 제외)</th>
	        <td>
	          <input name="phoneNumber"
					  value={form.phoneNumber}
					  onChange={(e) => {
					    const onlyNums = e.target.value.replace(/[^0-9]/g, "");
					    setForm((prev) => ({ ...prev, phoneNumber: onlyNums }));
					  }}
					  maxLength={11}
					  placeholder="숫자만 입력하세요"
					/>

	          {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
	        </td>

	        <th><span className="required">*</span>관리자 유형</th>
	        <td>
	          <select name="roleType" value={form.roleType} onChange={handleChange}>
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
	          	<input name="address" value={form.addressDetail} placeholder="상세주소를 입력해주세요."/>
	          </div>
	          {errors.address && <p className="error">{errors.address}</p>}
	        </td>
	      </tr>
	     

	    </tbody>
	  </table>
	
	  <div className="submit-btn-wrap">
	    <button type="submit">가입하기</button>
	  </div>
	</form>

  );
}

export default RegisterPage;
