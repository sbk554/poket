import '../css/Poket.css';

export default function Poket({renderPokemonList, isLoading, hasMore}) {
  return (
    <div className="poket-container">
      {renderPokemonList()}
      {isLoading && <p style={{ textAlign: 'center' }}>불러오는 중...</p>}
      {!hasMore && <p style={{ textAlign: 'center' }}>모든 포켓몬을 불러왔습니다!</p>}
    </div>
  );
}