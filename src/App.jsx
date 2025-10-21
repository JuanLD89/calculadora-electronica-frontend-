import { useState } from "react";
import divisor from './assets/divisor.png';
import serie from './assets/res_serie.png';
import paralelo from './assets/res_paralelo.png';
import potencia from './assets/potencia.png';
import ohm from './assets/ohm.jpg';

function App() {
  const [formula, setFormula] = useState("ohm");
  const [valores, setValores] = useState({});
  const [resultado, setResultado] = useState(null);
  const [subformula, setSubformula] = useState("");


  const cambiarValor = (campo, valor) => {
    setValores((prev) => ({ ...prev, [campo]: valor }));
  };

  const calcular = async () => {
    let data = {};
  
    if (formula === "ohm") {
      if (subformula === "voltaje") {
        data = {
          formula: "ohm_voltaje",
          valores: { I: valores.I, R: valores.R },
        };
      } else if (subformula === "corriente") {
        data = {
          formula: "ohm_corriente",
          valores: { V: valores.V, R: valores.R },
        };
      } else if (subformula === "resistencia") {
        data = {
          formula: "ohm_resistencia",
          valores: { V: valores.V, I: valores.I },
        };
      } else {
        alert("Selecciona qué deseas calcular");
        return;
      }
    } else {
      data = { formula, valores };
    }
  
    try {
      console.log("Payload a enviar:", JSON.stringify(data));

      const response = await fetch("https://calculadora-electronica-backend.vercel.app/calcular", {

          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
  
      const result = await response.json();
      if (result.resultado !== undefined) {
        setResultado(`Resultado: ${result.resultado.toFixed(3)}`);
      } else {
        setResultado("Error: " + (result.error || "verifica los valores"));
      }
    } catch (error) {
      setResultado("Error de conexión con el servidor");
    }
  };
  
  

  // Campos dinámicos según la fórmula
  // Campos dinámicos según la fórmula y subfórmula
  const campos = {
    ohm:
      subformula === "voltaje"
        ? ["I", "R"]
        : subformula === "corriente"
        ? ["V", "R"]
        : subformula === "resistencia"
        ? ["V", "I"]
        : [], // si no se ha seleccionado subfórmula
    potencia: ["V", "I"],
    res_serie: ["R1", "R2"],
    res_paralelo: ["R1", "R2"],
    divisor: ["Vin", "R1", "R2"],
  };


  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1> Calculadora Electrónica</h1>

      <label>Selecciona una fórmula:</label>
      <select value={formula} onChange={(e) => { setFormula(e.target.value); setValores({}); setResultado(null); }}>
        <option value="ohm">Ley de Ohm (V = I × R)</option>
        <option value="potencia">Potencia (P = V × I)</option>
        <option value="res_serie">Resistencias en serie</option>
        <option value="res_paralelo">Resistencias en paralelo</option>
        <option value="divisor">Divisor de tensión</option>
      </select>

      {/* Si la fórmula seleccionada es la Ley de Ohm, mostrar opciones */}
      {formula === "ohm" && (
        <div style={{ marginTop: "10px" }}>
          <label>¿Qué deseas calcular?</label>
          <select
            value={subformula || ""}
            onChange={(e) => setSubformula(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="">Selecciona una opción</option>
            <option value="voltaje">Voltaje (V = I × R)</option>
            <option value="corriente">Corriente (I = V / R)</option>
            <option value="resistencia">Resistencia (R = V / I)</option>
          </select>
        </div>
      )}


      {formula && (
        <div style={{ marginTop: '1rem' }}>
          <img 
            src={
              formula === 'divisor'
                ? divisor
                : formula === 'res_serie'
                ? serie
                : formula === 'res_paralelo'
                ? paralelo
                : formula === 'potencia'
                ? potencia
                : formula === 'ohm'
                ? ohm
                : null
            }
            alt={formula}
            style={{ width: '50%', borderRadius: '20px', marginTop: '1rem' }}
          />
        </div>
      )}


      <div style={{ marginTop: "20px" }}>
        {(campos[formula] || []).map((c) => (
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
