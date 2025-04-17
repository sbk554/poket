import '../css/Poket.css';
import loading from '../images/loading.gif'

export default function Poket({renderPokemonList, isLoading, hasMore}) {
  return (
    <div className="poket-container">
      {renderPokemonList()}
      {isLoading && 
          <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={loading}
                style={{ width: '60px', height: '60px', marginRight: '8px' }}
              />
              <p style={{ margin: 0 ,fontSize:'30px', fontWeight:'700'}}>불러오는 중...</p>
          </div>
        }
      {!hasMore && 
        <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ margin: 0 ,fontSize:'30px', fontWeight:'700' }}>모든 포켓몬을 불러왔습니다!</p>
        </div>
      }
    </div>
  );
}