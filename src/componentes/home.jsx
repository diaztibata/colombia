import React, { useEffect, useState } from "react";

function Home() {
  const [departamentos, setDepartamentos] = useState(null);
  const [capitales, setCapitales] = useState(null);
  const [modo, setModo] = useState("departamentos");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const urlDpt =
      "https://gist.githubusercontent.com/diaztibata/fe3d238ee6b59ef71c8001654441a9f6/raw/4974a1b1cab3ac606dd96aa2d34d6e7c8e007daf/departamentosglobal.json";
    const urlCpt =
      "https://gist.githubusercontent.com/diaztibata/fe3d238ee6b59ef71c8001654441a9f6/raw/4974a1b1cab3ac606dd96aa2d34d6e7c8e007daf/capitalesglobal.json";

    const fetchJson = async (url, setter) => {
      try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Error al cargar JSON: " + resp.status);
        const json = await resp.json();
        setter(json);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchJson(urlDpt, setDepartamentos);
    fetchJson(urlCpt, setCapitales);
  }, []);

  const getListaMostrar = () => {
    if (modo === "departamentos" && departamentos) {
      return departamentos.data?.dpt ?? [];
    }
    if (modo === "capitales" && capitales) {
      return capitales.data?.cpt ?? [];
    }
    return [];
  };

  const lista = getListaMostrar();

  const listaFiltrada = lista.filter((item) =>
    item.nm.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>

      <div>
        <button onClick={() => setModo("departamentos")}>
          Mostrar Departamentos
        </button>
        <button onClick={() => setModo("capitales")}>Mostrar Capitales</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div>
        {lista.length === 0 ? (
          <p>Cargando datos...</p>
        ) : listaFiltrada.length === 0 ? (
          <p>No se encontraron resultados</p>
        ) : (
          <ul>
            {listaFiltrada.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.nm}</strong> — Total de votos:{" "}
                  {item.tvv ?? "N/A"}
                </div>
                {item.cdt && (
                  <div>
                    <p>Candidatos:</p>
                    <ul>
                      {item.cdt.map((cand) => (
                        <li key={cand.id}>
                          {cand.nm} — votos: {cand.tv}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home;
