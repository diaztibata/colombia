import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AppContext } from './contexto';

function Detalle() {
  const { depto, municipio } = useParams();
  const [municipioData, setMunicipioData] = useState(null);
  
  const { favoritos, setFavoritos } = useContext(AppContext);
  
  // Verificar si el municipio está en favoritos comparando municipio y depto
  const esFavorito = favoritos.some(p => p.municipio === municipio && p.depto === depto);

  useEffect(() => {
    if (!depto || !municipio) return;

    const url = `https://gist.githubusercontent.com/diaztibata/fe3d238ee6b59ef71c8001654441a9f6/raw/225cef5e16b3997317e205a08a64985c9903f3c7/municipios-${encodeURIComponent(depto)}.json`;

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json(); // data.mun es el array

        const encontrado = data.mun.find((item) => item.id === municipio);

        if (!encontrado) {
          console.warn(`Municipio con id "${municipio}" no encontrado.`);
        }

        setMunicipioData(encontrado);
      } catch (error) {
        console.error("Error al cargar el JSON:", error);
      }
    };

    fetchData();
  }, [depto, municipio]);

  const toggleFavorito = (nombreMun) => {
    const addfavorito = { municipio, depto, nombreMun };
    
    if (esFavorito) {
      // Si es favorito, lo eliminamos de la lista
      setFavoritos(favoritos.filter(p => p.municipio !== municipio || p.depto !== depto));
    } else {
      // Si no es favorito, lo agregamos a la lista
      setFavoritos([...favoritos, addfavorito]);
    }
  };

  if (!municipioData) return <p>Cargando municipio...</p>;

  return (
    <div>
      <h1>{municipioData.nm}</h1>
      <p>ID: {municipioData.id}</p>
      <p>TVN: {municipioData.tvn}</p>
      <p>PVN: {municipioData.pvn}</p>
      <p>VNM: {municipioData.vnm}</p>
      <p>{municipioData.pcb}</p>

      <button onClick={() => toggleFavorito(municipioData.nm)}>
        {esFavorito ? '❤️' : '🤍'}
      </button>
    </div>
  );
}

export default Detalle;
