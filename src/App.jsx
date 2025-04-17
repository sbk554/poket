import './App.css'
import Poket from './components/poket'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 전체 개수 넘지 않도록
  const [nameMap , setNameMap ] = useState({});
    
  const typeColor = {
    grass: {
        name: "풀",
        color: "#42bf24",
        type:"grass"
    },
    fire: {
        name: "불꽃",
        color: "#ff612c",
        type:"fire"
    },
    water: {
        name: "물",
        color: "#2992ff",
        type:"water"
    },
    flying: {
        name: "비행",
        color: "#95c9ff",
        type:"flying"
    },
    poison:{
        name: "독",
        color: "#994dcf",
        type:"poison"
    },
    bug:{//6
        name: "벌레",
        color: "#9fa424",
        type:"bug"
    },
    normal:{
        name: "노말",
        color: "#999999",
        type:"normal"
    },
    electric:{
        name: "전기",
        color: "#ffdb00",
        type:"electric"
    },
    ground:{
        name: "땅",
        color: "#ab7939",
        type:"ground"
    },
    fairy:{
        name: "페어리",
        color: "#ffb1ff",
        type:"fairy"
    },
    fighting:{
        name: "격투",
        color: "#ffa202",
        type:"fighting"
    },
    psychic:{
        name: "에스퍼",
        color: "#ff637f",
        type:"psychic"
    },
    rock:{
        name: "바위",
        color: "#bcb889",
        type:"rock"
    },
    steel:{
        name: "강철",
        color: "#6aaed3",
        type:"steel"
    },
    ice:{
        name: "얼음",
        color: "#42d8ff",
        type:"ice"
    },
    ghost:{
        name: "고스트",
        color: "#6e4570",
        type:"ghost"
    },
    dragon:{
        name: "드래곤",
        color: "#5462d6",
        type:"dragon"
    },
    dark:{
        name: "악",
        color: "#4f4747",
        type:"dark"
    },
  }

  const handleToggleClick = (id) => {
    setPokemonData(prevData =>
      prevData.map(pokemon =>
        pokemon.id === id ? { ...pokemon, isShiny: !pokemon.isShiny } : pokemon
      )
    );
  };

  const mapAdd = async() => {
    let pokemonList = [];
    const listResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1025`);
    pokemonList = listResponse.data.results;
    console.log("pokemonList :: ",pokemonList)
    const newNameMap = {};
    pokemonList.map(async (pokemon) => {
      const detail = await axios.get(pokemon.url);
      const species = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${detail.data.id}`);
      const koreanNameObj = species.data.names.find(n => n.language.name === 'ko');
      
      newNameMap[koreanNameObj.name] = detail.data.name;
    });
    setNameMap(newNameMap);
  }

  const fetchMorePokemon = useCallback(async (searchText = '',isSearch = false) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    mapAdd();
    try {
      if (isSearch) {
        setPokemonData([]);// 검색 시 기존 목록 초기화
        setOffset(0);// offset 초기화
        setHasMore(true);// 검색 후 다시 로딩 가능하도록
      }
      const currentOffset = isSearch ? 0 : offset;
      const englishName = nameMap[searchText];
      
      let pokemonList = [];

      if (searchText && (isSearch && /^\d+$/.test(searchText))) {
        pokemonList = [{ name: searchText, url: `https://pokeapi.co/api/v2/pokemon/${searchText}/` }];
      }else if(searchText == '' || searchText == undefined || searchText == null){
        const listResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=30&offset=${currentOffset}`);
        pokemonList = listResponse.data.results;
  
        if (pokemonList.length === 0) {
          setHasMore(false);
          return;
        }
      } else {
        pokemonList = [{ name: englishName, url: `https://pokeapi.co/api/v2/pokemon/${englishName}/` }];
      }
      
      const allData = await Promise.all(
        pokemonList.map(async (pokemon) => {
          const detail = await axios.get(pokemon.url);
          const species = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${detail.data.id}`);
          const koreanNameObj = species.data.names.find(n => n.language.name === 'ko');
          const poketType = detail.data.types
          
          return {
            id: detail.data.id,
            name: koreanNameObj ? koreanNameObj.name : detail.data.name,
            image: detail.data.sprites.front_default,
            irochiImage : detail.data.sprites.front_shiny,
            types: poketType,
            isShiny: false
          };
        })
      );
      setPokemonData(prev => [...prev, ...allData]);
      setOffset(prev => prev + 30);
    } catch (error) {
      console.error('포켓몬 데이터를 불러오는 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  }, [offset, isLoading, hasMore]);

  // 스크롤 이벤트 감지
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight
      ) {
        fetchMorePokemon();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchMorePokemon]);

  // 초기 1회 호출
  useEffect(() => {
    fetchMorePokemon();
  }, []);

  const renderPokemonList = () => {
    const groups = [];
    for (let i = 0; i < pokemonData.length; i += 6) {
      groups.push(pokemonData.slice(i, i + 6));
    }
    
    return groups.map((group, groupIndex) => (
      <div key={groupIndex} className='poketmon-group'>
        {group.map((pokemon) => (
          <div key={pokemon.id} className='poketmon-item'>
            <div className='poketmon-images-wrap'>
              <img src={pokemon.isShiny ? pokemon.irochiImage : pokemon.image} alt={pokemon.name} className='poketmon-images' />
            </div>
            <div className="toggle-btn">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={pokemon.isShiny}
                  onChange={() => handleToggleClick(pokemon.id)}
                />
                <span className="slider round"></span>
              </label>
              <span className="toggle-label">
                  {pokemon.isShiny ? '일반' : '이로치'}
                </span>
            </div>
            <p class="paketmon_num">No.{pokemon.id}</p>
            <h3 class="paketmon_name">{pokemon.name}</h3>
            <div className='type-wrap'>
                {pokemon.types.map((type, idx) => {
                    const typeKey = type.type.name;
                    const backgroundColor = typeColor[typeKey]?.color || '#ccc';
                    return <p key={idx} style={{ backgroundColor, textAlign: "center", color: '#fff', padding: '5px 6px', borderRadius: '6px', display: 'inline-block', marginRight: '4px' }}>{typeColor[typeKey].name}</p>;
                })}
            </div>
          </div>
        ))}
      </div>
    ));
  };

  return (
  <>
    <Header fetchMorePokemon={fetchMorePokemon}/>
        <div className='poketmon-wrap'>
          <Poket renderPokemonList={renderPokemonList} isLoading={isLoading} hasMore={hasMore}/>
        </div>
    <Footer/>
  </>
  )
}

export default App
