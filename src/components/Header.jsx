import React, { useState} from 'react';
import main_logo from '../images/main_logo.png';
import icon_ball_b from '../images/icon_ball_b.png';
import '../css/Header.css'

export default function Header({fetchMorePokemon}){
    const [searchText, setSearchText] = useState('');

    const handleSearch = () => {
        fetchMorePokemon(searchText.trim(), true);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return(
        <header className="poket-header">
            <div className='main-logo'>
                <a href="/poket">
                    <img src={main_logo} alt="포켓몬"/>
                </a>
            </div>
            <div className='search-wrap'>
                <h2 className='h2-color-wt flex-wrap'>
                    <img src={icon_ball_b}/>
                    포켓몬 도감
                </h2>
                <div className='search-item'>
                    <input type="text" 
                        placeholder="포켓몬 이름(한글,영문 전체 입력해주세요.) 또는 번호를 입력해주세요."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <button type='button' className='btn-search' onClick={handleSearch}>
                        <p className='sr-only'>검색</p>
                    </button>
                </div>
            </div>
        </header>
    )
}