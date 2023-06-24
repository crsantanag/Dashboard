
const inputText = document.getElementById("inputText");
const botonImacec = document.getElementById("botonImacec");
const botonTpm = document.getElementById("botonTpm");
const botonUf = document.getElementById("botonUf");
const botonIpc = document.getElementById("botonIpc");
const botonDolar = document.getElementById("botonDolar");
const botonEuro = document.getElementById("botonEuro");

const imacec = document.getElementById("imacec");
const tpm = document.getElementById("tpm");
const uf = document.getElementById("uf");
const ipc = document.getElementById("ipc");
const dolar = document.getElementById("dolar");
const euro = document.getElementById("euro");

var colorActual = document.getElementById("botonImacec").style.backgroundColor;
var indicador = "imacec";

const urlDatos = `https://mindicador.cl/api`;

const obtenerDatos = async () => {
  const urlIndicadores = `https://mindicador.cl/api`;
  const respIndicadores = await fetch(urlIndicadores);
  const dataIndicadores = await respIndicadores.json();

  console.log(dataIndicadores);

  imacec.innerHTML = `Índice Mensual de Actividad Económica ${dataIndicadores.imacec.valor}%`;
  tpm.innerHTML = `Tasa de Política Monetaria ${dataIndicadores.tpm.valor}%`;
  uf.innerHTML = `Valor Unidad de Fomento $${dataIndicadores.uf.valor.toLocaleString()}`;
  ipc.innerHTML = `Índice de Precios al Consumidor ${dataIndicadores.ipc.valor}%`;
  dolar.innerHTML = `Valor del Dólar Observado $${dataIndicadores.dolar.valor.toLocaleString()}`;
  euro.innerHTML = `Valor del Euro $${dataIndicadores.euro.valor.toLocaleString()}`;
};

obtenerDatos();

botonImacec.addEventListener("click", (e) => {
  e.preventDefault();
  coloresBoton(indicador, colorActual, "Imacec")
  indicador = "imacec"
  traeDatosSerie(indicador, 'Índice Mensual de Actividad Económica', 'Indicador Mensual - Valor Porcentual', 'MES', 'PORCENTAJE');

});

botonTpm.addEventListener("click", (e) => {
  e.preventDefault();
  coloresBoton(indicador, colorActual, "Tpm")
  indicador = "tpm"
  traeDatosSerie(indicador, 'Tasa de Política Monetaria', 'Indicador Diario - Valor Porcentual', 'DÍA', 'PORCENTAJE');
  
});

botonUf.addEventListener("click", (e) => {
  e.preventDefault();
  coloresBoton(indicador, colorActual, "Uf")
  indicador = "uf";
  traeDatosSerie(indicador, 'Valor Unidad de Fomento', 'Indicador Diario - Valor en pesos (CLP)', 'DÍA', 'PORCENTAJE');
});

botonIpc.addEventListener("click", (e) => {
  e.preventDefault();
  coloresBoton(indicador, colorActual, "Ipc")
  indicador = "ipc";
  traeDatosSerie(indicador,'Índice de Precios al Consumidor', 'Indicador Mensual - Valor Porcentual', 'MES', 'PORCENTAJE');
});

botonDolar.addEventListener("click", (e) => {
  e.preventDefault();
  coloresBoton(indicador, colorActual, "Dolar")
  indicador = "dolar";
  traeDatosSerie(indicador, 'Valor del Dólar Observado', 'Indicador Diario - Valor en pesos (CLP)', 'DÍA', 'PORCENTAJE');
});

botonEuro.addEventListener("click", (e) => {
  e.preventDefault();
  coloresBoton(indicador, colorActual, "Euro")
  indicador = "euro";
  traeDatosSerie(indicador, 'Valor del Euro', 'Indicador Diario - Valor en pesos (CLP)', 'DÍA', 'PORCENTAJE');
});

// Función asíncrona que trae los datos de la serie solicitada
async function traeDatosSerie(indicador, titulo, subTitulo, ejeX, ejeY) {
  
  const urlSerie = `https://mindicador.cl/api/${indicador}`
  const respSerie = await fetch(urlSerie);
  const dataSerie = await respSerie.json();

  console.log(dataSerie);
  dataSerie.serie.reverse();
  createGraph(dataSerie, titulo, subTitulo, ejeX, ejeY); 
};

// Creación del Gráfico
const createGraph = (dataSerie,titulo, subTitulo, ejeX, ejeY) => {

  const color = dataSerie.serie.map((elemento) => 'blue');

  const grafico = document.getElementById("grafico");

  if (grafico.chart) {
    // Si hay un gráfico existente, éste se debe destruir antes de crear uno nuevo
    grafico.chart.destroy();
  }

  const ctx = grafico.getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dataSerie.serie.map((elemento) => elemento.fecha.substring(0,10)),
      datasets: [
        { label: dataSerie.nombre,
          data: dataSerie.serie.map((elemento) => elemento.valor),
          borderColor: 'blue',
        },
      ],
    },
    options: {
      resposive: true,
      plugins: {
        subtitle: {
          display: true,
          text: subTitulo
        }, 
        title: {
          display: true,
          text: titulo
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: ejeX
          }
        },
        y: {
          title: {
            display: true,
            text: ejeY
          }
        }
      }
    }
    })
  // Asigno el nuevo gráfico al canvas
  grafico.chart = chart;
}

function coloresBoton (viejoIndicador, colorActual, nuevoIndicador) {
  viejoIndicador = viejoIndicador.charAt(0).toUpperCase() + viejoIndicador.slice(1);

  const viejoElementoPorId = document.getElementById(`boton${viejoIndicador}`);
  viejoElementoPorId.style.backgroundColor = colorActual;
  viejoElementoPorId.innerText = "Graficar Serie";
  
  const nuevoElementoPorId = document.getElementById(`boton${nuevoIndicador}`);
  nuevoElementoPorId.style.backgroundColor = 'blue';
  nuevoElementoPorId.innerText = "Graficando ...";
}

