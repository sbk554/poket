import './App.css'
import Poket from './components/poket'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Modal from './components/Modal.jsx'
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 전체 개수 넘지 않도록
  const [nameMap , setNameMap ] = useState({});
  const [selectedGen, setSelectedGen] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
    
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
      prevData.map(group =>
        group.map(pokemon =>
          pokemon.id === id ? { ...pokemon, isShiny: !pokemon.isShiny } : pokemon
        )
      )
    );
  };

  const mapAdd = async(num) => {
    let pokemonGeneration = [];
    const listResponse = await axios.get(`https://pokeapi.co/api/v2/generation`);
    const allGenerations = listResponse.data.results;
    pokemonGeneration = [allGenerations[num]];
    
    const newNameMap = {};
    pokemonGeneration.map(async (generation) => {
      const poketmonUrl = await axios.get(generation.url);
      const poketmonList = poketmonUrl.data.pokemon_species
      poketmonList.map(async (pokemon) => {
        const detail = await axios.get(pokemon.url);
        const species = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${detail.data.id}`);
        const koreanNameObj = species.data.names.find(n => n.language.name === 'ko');
        
        newNameMap[koreanNameObj.name] = detail.data.name;
      });
    });
    setNameMap(newNameMap);
  }

  const fetchMorePokemon = useCallback(async (searchText = '',isSearch = false, num = 0) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    mapAdd(num);
    try {
      if (isSearch) {
        setPokemonData([]);// 검색 시 기존 목록 초기화
        setHasMore(true);// 검색 후 다시 로딩 가능하도록
      }
      const englishName = nameMap[searchText];
      
      let pokemonGeneration = [];

      if (searchText && (isSearch && /^\d+$/.test(searchText))) {

        pokemonGeneration = [{ name: searchText, url: `https://pokeapi.co/api/v2/pokemon/${searchText}/`}];

      }else if(searchText == '' || searchText == undefined || searchText == null){
        const listResponse = await axios.get(`https://pokeapi.co/api/v2/generation`);
        const allGenerations = listResponse.data.results;
    
        pokemonGeneration = [allGenerations[num]];

        if (pokemonGeneration.length === 0) {
          setHasMore(false);
          return;
        }
      } else {
        pokemonGeneration = [{ name: englishName, url: `https://pokeapi.co/api/v2/pokemon/${englishName}/` }];
      }
      
      const allData = await Promise.all(
        pokemonGeneration.map(async (generation) => {
          const poketmonUrl = await axios.get(generation.url);
          const poketmonList = poketmonUrl.data.pokemon_species;

          if (!poketmonList || poketmonList.length === 0) {
              console.log(poketmonUrl)
              const species = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${poketmonUrl.data.id}`);
              const koreanNameObj = species.data.names.find(n => n.language.name === 'ko');
              const arr = [
                {
                  id: poketmonUrl.data.id,
                  name: koreanNameObj ? koreanNameObj.name : poketmonUrl.data.name,
                  image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poketmonUrl.data.id}.png`,
                  irochiImage: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${poketmonUrl.data.id}.png`,
                  isShiny: false,
                  types : poketmonUrl.data.types
                }
              ]
              return arr;
          }
      
          const data = await Promise.all(
            poketmonList.map(async (pokemon) => {
              const detail = await axios.get(pokemon.url);
              const species = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${detail.data.id}`);
              const typeUrl = await axios.get(`https://pokeapi.co/api/v2/pokemon/${detail.data.id}`);
              // console.log(" species ::: ",species)
              // console.log(" typeUrl ::: ",typeUrl)
              const koreanNameObj = species.data.names.find(n => n.language.name === 'ko');
              const poketType = typeUrl.data.types
              
              return {
                id: detail.data.id,
                name: koreanNameObj ? koreanNameObj.name : detail.data.name,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${detail.data.id}.png`,
                irochiImage: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${detail.data.id}.png`,
                isShiny: false,
                types:poketType,

              };
            })
          );
      
          const sortedData = data.sort((a, b) => a.id - b.id);
          return sortedData;
        })
      );
      setPokemonData(prev => [...prev, ...allData]);
    } catch (error) {
      console.error('포켓몬 데이터를 불러오는 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore]);

  // 초기 1회 호출
  useEffect(() => {
    fetchMorePokemon();
  }, []);

  const renderPokemonList = (num) => {
    num = num == undefined ? 0 : num
    const groups = [];

    if (pokemonData.length > 0 && pokemonData[0]?.length > 0) {
      for (let i = 0; i < pokemonData[0].length; i += 6) {
        groups.push(pokemonData[0].slice(i, i + 6));
      }
    }

    return groups.map((group, groupIndex) => (
      
      <div key={groupIndex} className='poketmon-group'>
        {group.map((pokemon) => (
          <div key={pokemon.id} className='poketmon-item' onClick={() => listSetting(pokemon)}>
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

  const listSetting = (pokemon) => {
    console.log(pokemon)
    setModalContent({
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
      title: pokemon.name,
      text: `NO.${pokemon.id}`,
      type: pokemon.types,
      
    });
    setIsModalOpen(true);
  };
  
  const clickFunction = (e) =>{
    const num = Number(e.target.getAttribute("data-num"));
    setSelectedGen(num);
    setPokemonData([]);      
    setHasMore(true);   
    fetchMorePokemon('', true, num);
  }

  return (
  <>
    <Header fetchMorePokemon={fetchMorePokemon}/>
        <div className='poketmon-wrap'>
          <div class="gen_menu_wrap" id="genMenuWrap">
            {[...Array(9)].map((_, i) => (
              <button
                key={i}
                type="button"
                className={`genBtn ${selectedGen === i ? 'on' : ''}`}
                data-num={i}
                onClick={clickFunction}
              >
                {i + 1}세대
              </button>
            ))}
          </div>
          <Poket renderPokemonList={renderPokemonList} isLoading={isLoading} hasMore={hasMore}/>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          content={modalContent}
        />
  </>
  )
}

export default App
