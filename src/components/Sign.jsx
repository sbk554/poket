import { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase-config";

import '../css/Sign.css'

export default function Sign() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
          alert("비밀번호가 일치하지 않습니다.");
          return;
        }
        
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          const user = userCredential.user;

          await updateProfile(user, {
            displayName: name,
          });
          console.log("회원가입성공", userCredential.user);
          navigate("/poket");
        } catch (error) {
          console.log("회원가입 오류", error.message);
        }
        
      };

    return(
        <div className='container'>
            <div className="auth-card">
                <h2 className="auth-title">회원가입</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                    <label htmlFor="new-username">트레이너 이름</label>
                    <input id="new-username" 
                        type="text" 
                        placeholder="이름을 입력하세요" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required />
                    </div>
                    <div className="form-group">
                    <label htmlFor="email">이메일</label>
                    <input id="email" 
                            type="email" 
                            placeholder="예: you@pokemon.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}  
                            required />
                    </div>
                    <div className="form-group">
                    <label htmlFor="new-password">비밀번호</label>
                    <input id="new-password" 
                            type="password" 
                            placeholder="비밀번호" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required />
                    </div>
                    <div className="form-group">
                    <label htmlFor="confirm-password">비밀번호 확인</label>
                    <input id="confirm-password" 
                            type="password" 
                            placeholder="비밀번호 재입력" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required />
                    </div>
                    <button type="submit" className="btn-primary">가입하기</button>
                </form>
                <p className="auth-switch">
                    이미 계정이 있으신가요? <Link to="/login">로그인</Link>
                </p>
            </div>
        </div>
    );
}