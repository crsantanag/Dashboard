
const inputText = document.getElementById("inputText");
const botonImacec = document.getElementById("botonImacec");
const botonTpm = document.getElementById("botonTpm");
const botonUf = document.getElementById("botonUf");
const botonIpc = document.getElementById("botonIpc");
const botonDolar = document.getElementById("botonDolar");
const botonEuro = document.getElementById("botonEuro");

const yearSeleccionado = document.getElementById('seleccionaYear');

const imacec = document.getElementById("imacec");
const tpm = document.getElementById("tpm");
const uf = document.getElementById("uf");
const ipc = document.getElementById("ipc");
const dolar = document.getElementById("dolar");
const euro = document.getElementById("euro");

const urlDatos = `https://mindicador.cl/api`;

var colorActual = document.getElementById("botonImacec").style.backgroundColor;
var indicador = "imacec";
var año = "2024"

obtenerDatos(urlDatos);

yearSeleccionado.addEventListener('change', function (e) {
  e.preventDefault();
  año = yearSeleccionado.value;
  const viejoIndicador = indicador.charAt(0).toUpperCase() + indicador.slice(1);

  const viejoElementoPorId = document.getElementById(`boton${viejoIndicador}`);
  viejoElementoPorId.style.backgroundColor = colorActual;
  viejoElementoPorId.innerText = "Graficar Serie";
});

botonImacec.addEventListener("click", function (e) {
  e.preventDefault();
  coloresBoton(indicador, colorActual, "Imacec")
  indicador = "imacec";
  traeDatosSerie(urlDatos+"/"+indicador+"/"+año, 'Índice Mensual de Actividad Económica', 'Indicador Mensual - Valor Porcentual', 'MES', 'PORCENTAJE');

});

botonTpm.addEventListener("click", function (e) {
  e.preventDefault();
  coloresBoton(indicador, colorActual, "Tpm")
  indicador = "tpm"
  traeDatosSerie(urlDatos+"/"+indicador+"/"+año, 'Tasa de Política Monetaria', 'Indicador Diario - Valor Porcentual', 'DÍA', 'PORCENTAJE');
  
});

botonUf.addEventListener("click", function(e) {
  e.preventDefault();
  coloresBoton(indicador, colorActual, "Uf")
  indicador = "uf";
  traeDatosSerie(urlDatos+"/"+indicador+"/"+año, 'Valor Unidad de Fomento', 'Indicador Diario - Valor en pesos (CLP)', 'DÍA', 'PORCENTAJE');
});

botonIpc.addEventListener("click",  function (e) {
  e.preventDefault();
  coloresBoton(indicador, colorActual, "Ipc")
  indicador = "ipc";
  traeDatosSerie(urlDatos+"/"+indicador+"/"+año,'Índice de Precios al Consumidor', 'Indicador Mensual - Valor Porcentual', 'MES', 'PORCENTAJE');
});

botonDolar.addEventListener("click", function (e) {
  e.preventDefault();
  coloresBoton(indicador, colorActual, "Dolar")
  indicador = "dolar";
  traeDatosSerie(urlDatos+"/"+indicador+"/"+año, 'Valor del Dólar Observado', 'Indicador Diario - Valor en pesos (CLP)', 'DÍA', 'PORCENTAJE');
});

botonEuro.addEventListener("click", function (e) {
  e.preventDefault();
  coloresBoton(indicador, colorActual, "Euro")
  indicador = "euro";
  traeDatosSerie(urlDatos+"/"+indicador+"/"+año, 'Valor del Euro', 'Indicador Diario - Valor en pesos (CLP)', 'DÍA', 'PORCENTAJE');
});

// Función asíncrona que trae los indicadores del día
async function obtenerDatos (urlIndicadores) {
  const respIndicadores = await fetch(urlIndicadores);
  
  try {
    const dataIndicadores = await respIndicadores.json();

    imacec.innerHTML = `Índice Mensual de Actividad Económica ${dataIndicadores.imacec.valor}%`;
    tpm.innerHTML = `Tasa de Política Monetaria ${dataIndicadores.tpm.valor}%`;
    uf.innerHTML = `Valor Unidad de Fomento $${dataIndicadores.uf.valor.toLocaleString()}`;
    ipc.innerHTML = `Índice de Precios al Consumidor ${dataIndicadores.ipc.valor}%`;
    dolar.innerHTML = `Valor del Dólar Observado $${dataIndicadores.dolar.valor.toLocaleString()}`;
    euro.innerHTML = `Valor del Euro $${dataIndicadores.euro.valor.toLocaleString()}`;
  }
  
  catch (error) {
    alert ("Error al recuperar indices! ", error)
  }

};

// Función asíncrona que trae los datos de la serie solicitada
async function traeDatosSerie(urlSerie, titulo, subTitulo, ejeX, ejeY) {
  
  const respSerie = await fetch(urlSerie);
  try {
    const dataSerie = await respSerie.json();

    dataSerie.serie.reverse();
    createGraph(dataSerie, titulo, subTitulo, ejeX, ejeY); 
    window.location.href = "#grafico";
  }
  
  catch (error) {
    alert ("Error al recuperar serie! ", error)
  }

};

// Creación del Gráfico
const createGraph = (dataSerie,titulo, subTitulo, ejeX, ejeY) => {

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

