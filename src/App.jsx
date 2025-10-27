import { useState } from "react";
import divisor from './assets/divisor.png';
import serie from './assets/res_serie.png';
import paralelo from './assets/res_paralelo.png';
import potencia from './assets/potencia.png';
import ohm from './assets/Ohm.jpg';
import divisorCorriente from './assets/divisor_corriente.png';

function App() {
  const [numResistenciasParalelo, setNumResistenciasParalelo] = useState(2);
  const [resistenciasParalelo, setResistenciasParalelo] = useState(["", ""]);
  const [numResistenciasSerie, setNumResistenciasSerie] = useState(2);
  const [resistenciasSerie, setResistenciasSerie] = useState(["", ""]);
  const [numResistenciasDivisor, setNumResistenciasDivisor] = useState(2);
  const [resistenciasDivisor, setResistenciasDivisor] = useState(["", ""]);
  
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
        alert("Selecciona qué deseas calcular (Ley de Ohm)");
        return;
      }
    } else if (formula === "potencia") {
      if (subformula === "potencia") {
        data = { formula: "potencia", valores: { V: valores.V, I: valores.I } };
      } else if (subformula === "voltaje") {
        data = { formula: "potencia_voltaje", valores: { P: valores.P, I: valores.I } };
      } else if (subformula === "corriente") {
        data = { formula: "potencia_corriente", valores: { P: valores.P, V: valores.V } };
      } else {
        alert("Selecciona qué deseas calcular (Potencia)");
        return;
      }
    } else if (formula === "res_serie") {
      data = {
        formula: "res_serie",
        valores: Object.fromEntries(
          resistenciasSerie.map((r, i) => [`R${i + 1}`, r])
        ),
      };
    } else if (formula === "res_paralelo") {
      data = {
        formula: "res_paralelo",
        valores: Object.fromEntries(
          resistenciasParalelo.map((r, i) => [`R${i + 1}`, r])
        ),
      };
    } else if (formula === "divisor_corriente") {
      const valoresObj = { It: valores.It };
    
      resistenciasDivisor.forEach((r, i) => {
        valoresObj[`R${i + 1}`] = r; // R1, R2, ...
      });
    
      data = {
        formula: "divisor_corriente",
        valores: valoresObj,
      };
    } else {
      // resto de fórmulas ya existentes (resistencias, divisor...)
      data = { formula, valores };
    }
    

  
    try {
      console.log("Payload a enviar:", JSON.stringify(data));

      const response = await fetch("https://calculadora-electronica-backend.vercel.app/calcular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Respuesta del backend:", result);

      if (result.error) {
        setResultado("⚠️ Error: " + result.error);
        return;
      }

      const r = result.resultado;

      if (typeof r === "string") {
        // texto (como divisor de corriente)
        setResultado(r);
      } else if (typeof r === "number") {
        // número (como resistencia equivalente)
        setResultado(`Resultado: ${r.toFixed(3)}`);
      } else if (typeof r === "object" && r !== null) {
        // objeto JSON (por si en el futuro devuelves datos estructurados)
        setResultado(JSON.stringify(r, null, 2));
      } else {
        setResultado("Resultado desconocido");
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
    potencia:
      subformula === "potencia"
        ? ["V", "I"]
        : subformula === "voltaje"
        ? ["P", "I"]
        : subformula === "corriente"
        ? ["P", "V"]
        : [],
  
    res_serie: ["R1", "R2"],
    res_paralelo: ["R1", "R2"],
    divisor: ["Vin", "R1", "R2"],
    divisor_corriente: ["It", "R1", "R2"],
  };
  

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "40px",
        backgroundColor: "#f2f2f2", // fondo general, cámbialo si quieres otro color
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <h1>Calculadora Electrónica</h1>
  
      <label>Selecciona una fórmula:</label>
      <select
        value={formula}
        onChange={(e) => {
          setFormula(e.target.value);
          setValores({});
          setResultado(null);
        }}
        style={{ marginLeft: "10px" }}
      >
        <option value="ohm">Ley de Ohm</option>
        <option value="potencia">Ley de Watt</option>
        <option value="res_serie">Resistencias en serie</option>
        <option value="res_paralelo">Resistencias en paralelo</option>
        <option value="divisor">Divisor de tensión</option>
        <option value="divisor_corriente">Divisor de corriente</option>

      </select>
  
      {/* Subfórmulas Ohm */}
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
  
      {/* Subfórmulas Potencia */}
      {formula === "potencia" && (
        <div style={{ marginTop: "10px" }}>
          <label>¿Qué deseas calcular?</label>
          <select
            value={subformula || ""}
            onChange={(e) => setSubformula(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="">Selecciona una opción</option>
            <option value="potencia">Potencia (P = V × I)</option>
            <option value="voltaje">Voltaje (V = P / I)</option>
            <option value="corriente">Corriente (I = P / V)</option>
          </select>
        </div>
      )}
  
      {/* Imagen ilustrativa */}
      {formula && (
        <div style={{ marginTop: "1rem" }}>
          <img
            src={
              formula === "divisor"
                ? divisor
                : formula === "res_serie"
                ? serie
                : formula === "res_paralelo"
                ? paralelo
                : formula === "potencia"
                ? potencia
                : formula === "ohm"
                ? ohm
                : formula === "divisor_corriente"
                ? divisorCorriente
                : null
            }
            alt={formula}
            style={{
              width: "50%",
              borderRadius: "10px",
              marginTop: "1rem",
            }}
          />
        </div>
      )}
  
      {/* Campos dinámicos */}
      <div style={{
        marginTop: "15px",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px",
        maxWidth: "600px",
        margin: "15px auto",
      }}>
        {formula === "res_serie" ? (
          <>
            <label>
              Número de resistencias:
              <input
                type="number"
                min="2"
                max="15"
                value={numResistenciasSerie}
                onChange={(e) => {
                  const n = parseInt(e.target.value);
                  setNumResistenciasSerie(n);
                  const nuevas = [...resistenciasSerie];
                  if (n > nuevas.length) {
                    while (nuevas.length < n) nuevas.push("");
                  } else {
                    nuevas.length = n;
                  }
                  setResistenciasSerie(nuevas);
                }}
                style={{ width: "60px", marginLeft: "10px" }}
              />
            </label>

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "10px",
                maxWidth: "600px",
                margin: "15px auto",
              }}
            >
              {resistenciasSerie.map((valor, i) => (
                <input
                  key={i}
                  type="number"
                  placeholder={`R${i + 1}`}
                  value={valor}
                  onChange={(e) => {
                    const nuevas = [...resistenciasSerie];
                    nuevas[i] = e.target.value;
                    setResistenciasSerie(nuevas);
                  }}
                  style={{
                    width: "100px",
                    padding: "5px",
                    textAlign: "center",
                  }}
                />
              ))}
            </div>
          </>
        ) : formula === "res_paralelo" ? (
          <>
            <label>
              Número de resistencias:
              <input
                type="number"
                min="2"
                max="15"
                value={numResistenciasParalelo}
                onChange={(e) => {
                  const n = parseInt(e.target.value);
                  setNumResistenciasParalelo(n);
                  const nuevas = [...resistenciasParalelo];
                  if (n > nuevas.length) {
                    while (nuevas.length < n) nuevas.push("");
                  } else {
                    nuevas.length = n;
                  }
                  setResistenciasParalelo(nuevas);
                }}
                style={{ width: "60px", marginLeft: "10px" }}
              />
            </label>

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "10px",
                maxWidth: "600px",
                margin: "15px auto",
              }}
            >
              {resistenciasParalelo.map((valor, i) => (
                <input
                  key={i}
                  type="number"
                  placeholder={`R${i + 1}`}
                  value={valor}
                  onChange={(e) => {
                    const nuevas = [...resistenciasParalelo];
                    nuevas[i] = e.target.value;
                    setResistenciasParalelo(nuevas);
                  }}
                  style={{
                    width: "100px",
                    padding: "5px",
                    textAlign: "center",
                  }}
                />
              ))}
            </div>
          </>
        ) : formula === "divisor_corriente" ? (
          <>
            <label>
              It(corriente total):
              <input
                type="number"
                value={valores.It || ""}
                onChange={(e) => cambiarValor("It", e.target.value)}
                style={{ width: "80px", marginLeft: "10px", marginRight: "10px" }}
              />
            </label>
      
            <label>
              Número de resistencias:
              <input
                type="number"
                min="2"
                max="10"
                value={numResistenciasDivisor}
                onChange={(e) => {
                  const n = parseInt(e.target.value);
                  setNumResistenciasDivisor(n);
                  const nuevas = [...resistenciasDivisor];
                  if (n > nuevas.length) {
                    while (nuevas.length < n) nuevas.push("");
                  } else {
                    nuevas.length = n;
                  }
                  setResistenciasDivisor(nuevas);
                }}
                style={{ width: "80px", marginLeft: "10px" }}
              />
            </label>
      
            <div
              style={{
                marginTop: "15px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "10px",
                maxWidth: "600px",
                margin: "15px auto",
              }}
            >
              {resistenciasDivisor.map((valor, i) => (
                <input
                  key={i}
                  type="number"
                  placeholder={`R${i + 1}`}
                  value={valor}
                  onChange={(e) => {
                    const nuevas = [...resistenciasDivisor];
                    nuevas[i] = e.target.value;
                    setResistenciasDivisor(nuevas);
                  }}
                  style={{
                    width: "80px",
                    padding: "5px",
                    textAlign: "center",
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          (campos[formula] || []).map((c) => (
            <input
              key={c}
              type="number"
              placeholder={c}
              value={valores[c] || ""}
              onChange={(e) => cambiarValor(c, e.target.value)}
              style={{ margin: "5px" }}
            />
          ))
        )}

      </div>
  
      <button onClick={calcular} style={{ marginTop: "10px" }}>
        Calcular
      </button>
  
      {resultado && (
        <pre
          style={{
            marginTop: "20px",
            whiteSpace: "pre-wrap",
            textAlign: "left",
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          {resultado}
        </pre>
      )}

    </div>
  );
  
}

export default App;
