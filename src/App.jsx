import { useState } from "react";

function App() {
  const [formula, setFormula] = useState("ohm");
  const [valores, setValores] = useState({});
  const [resultado, setResultado] = useState(null);

  const cambiarValor = (campo, valor) => {
    setValores((prev) => ({ ...prev, [campo]: valor }));
  };

  const calcular = async () => {
    try {
      const respuesta = await fetch("https://calculadora-electronica-backend.vercel.app/calcular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formula, valores }),
      });

      const data = await respuesta.json();
      if (data.resultado !== undefined) {
        setResultado(`Resultado: ${data.resultado.toFixed(3)}`);
      } else {
        setResultado("Error: " + (data.error || "verifica los valores"));
      }
    } catch (error) {
      setResultado("Error de conexión con el servidor");
    }
  };

  // Campos dinámicos según la fórmula
  const campos = {
    ohm: ["I", "R"],
    potencia: ["V", "I"],
    res_serie: ["R1", "R2"],
    res_paralelo: ["R1", "R2"],
    divisor: ["Vin", "R1", "R2"],
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>⚡ Calculadora Electrónica</h1>

      <label>Selecciona una fórmula:</label>
      <select value={formula} onChange={(e) => { setFormula(e.target.value); setValores({}); setResultado(null); }}>
        <option value="ohm">Ley de Ohm (V = I × R)</option>
        <option value="potencia">Potencia (P = V × I)</option>
        <option value="res_serie">Resistencias en serie</option>
        <option value="res_paralelo">Resistencias en paralelo</option>
        <option value="divisor">Divisor de tensión</option>
      </select>

      <div style={{ marginTop: "20px" }}>
        {campos[formula].map((c) => (
          <input
            key={c}
            type="number"
            placeholder={c}
            value={valores[c] || ""}
            onChange={(e) => cambiarValor(c, e.target.value)}
            style={{ margin: "5px" }}
          />
        ))}
      </div>

      <button onClick={calcular} style={{ marginTop: "10px" }}>Calcular</button>

      {resultado && <h2 style={{ marginTop: "20px" }}>{resultado}</h2>}
    </div>
  );
}

export default App;
