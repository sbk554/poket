import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";

import '../css/Login.css'

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let naviate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
          signInWithEmailAndPassword(auth, email, password);
          naviate("/poket");
        } catch (error) {
          console.log("오류", error.message);
        }
    
        console.log(email, password);
      };

    return (
        <div className='container'>
            <div className="auth-card">
                <h2 className="auth-title">로그인</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                    <label htmlFor="username">이메일</label>
                    <input id="email" 
                            type="email" 
                            placeholder="이름을 입력하세요"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required />
                    </div>
                    <div className="form-group">
                    <label htmlFor="password">비밀번호</label>
                    <input id="password" 
                            type="password" 
                            placeholder="비밀번호" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required />
                            
                    </div>
                    <button type="submit" className="btn-primary">로그인</button>
                </form>
                <p className="auth-switch">
                    아직 계정이 없으신가요? <Link to="/sign">회원가입</Link>
                </p>
            </div>
        </div>
      );
}