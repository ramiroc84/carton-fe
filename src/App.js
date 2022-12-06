// import Navbar from 'react-bootstrap/Navbar';
// import Nav from 'react-bootstrap/Nav';
//import Jumbotron from 'react-bootstrap/Jumbotron'
// import NavDropdown from 'react-bootstrap/NavDropdown';
// import Form from 'react-bootstrap/Form';
// import FormControl from 'react-bootstrap/FormControl';
// import Button from 'react-bootstrap/Button';
import Dropbox from './componentes/Dropbox'
import Carton from './componentes/Carton'
import React, { useState } from 'react'
import Footer from './componentes/Footer'
import Alerta from './componentes/Alerta'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'

// import generarCarton from './utils/CartonGenerator';
// import axios from 'axios';
// const FileDownload = require('js-file-download');

function App() {
  // data es el objeto proveniente del dropbox -> Dicomreader
  const [data, setData] = useState({})
  const [mostrarMsj, setMostrarMsj] = useState(false)
  const [dataMsj, setDataMsj] = useState({})

  //const [path, setPath] = useState('');
  // function mensaje() {}
  function handleCallbackMsj(childData) {
    setMostrarMsj(true)
    setDataMsj(childData)

    // setMostrarMsj(true);
  }
  // function handleCallbackMsjCarton(childData) {
  //   setMostrarMsj(true);
  //   setDataMsj(childData);
  //   console.log('DESDE APP->>>>', childData);
  //   // setMostrarMsj(true);
  // }

  function generarCarton() {
    if (data.hc) {
      const datos = JSON.stringify(data)

      // console.log(datos);
      // console.log(datos.replaceAll('{', '%7B').replaceAll('}', '%7D'));
      if (datos.length < 3500) {
        // window.open(
        //   `http://127.0.0.1:3000/carton?datos=${datos
        //     .replaceAll('{', '%7B')
        //     .replaceAll('}', '%7D')}`
        // );
        window.open(
          `/carton?datos=${datos
            .replaceAll('{', '%7B')
            .replaceAll('}', '%7D')
            .replaceAll('#', '%23')}`
        )
        setMostrarMsj(false)
      } else {
        setDataMsj({
          mostrar: true,
          tipoAlerta: 'danger',
          titulo: 'Error en Payload',
          tipoBoton: 'outline-danger',
          leyendaBoton: 'Cerrar',
          leyenda: 'Intente con un archivo mas pequeño',
        })
        setData({})
      }
    }
    // setMostrarMsj(false);
  }

  function cerrarAlerta() {
    setMostrarMsj(false)
  }
  /*const popover = (
    <Popover id='popover-basic'>
      <Popover.Title as='h3'>Para tener en cuenta</Popover.Title>
      <Popover.Content>
        - Utilice archivos válidos.
        <br />- Al momento de imprimir verifique que el tamaño de hoja del visor
        de .pdf sea <strong>A4</strong> y desactive cualquier opción de tipo{' '}
        <strong>fit page, shrink</strong> o similar.
        <br />
        *Para los usuarios de Eclipse*
        <br />- En el paciente utilice como ID1 el id y como{' '}
        <strong>ID2 el Nº de HC</strong>.
        <br />- Escriba la región a tratar en el campo <strong>Name</strong> de
        las propiedades del Plan. De omitirlo se utilizará el nombre del Plan
        como región a tratar.
        <br />- Utilice 2 cpos de SU (ANT y LAT). Al{' '}
        <strong>aprobar el plan</strong>, las DFPs se verán reflejadas en el
        cartón. <br />- SIEMPRE VERIFIQUE QUE LOS DATOS IMPRESOS SEAN LOS
        CORRECTOS ANTES DE UTILIZAR EL CARTON.
      </Popover.Content>
    </Popover>
  )*/

  const popover = (
    <Popover id='popover-basic'>
      <Popover.Header as='h3'>Para tener en cuenta</Popover.Header>
      <Popover.Body>
        - Utilice archivos válidos.
        <br />- Al momento de imprimir verifique que el tamaño de hoja del visor
        de .pdf sea <strong>A4</strong> y desactive cualquier opción de tipo{' '}
        <strong>fit page, shrink</strong> o similar.
        <br />
        *Para los usuarios de Eclipse*
        <br />- En el paciente utilice como ID1 el id y como{' '}
        <strong>ID2 el Nº de HC</strong>.
        <br />- Escriba la región a tratar en el campo <strong>Name</strong> de
        las propiedades del Plan. De omitirlo se utilizará el nombre del Plan
        como región a tratar.
        <br />- Utilice 2 cpos de SU (ANT y LAT). Al{' '}
        <strong>aprobar el plan</strong>, las DFPs se verán reflejadas en el
        cartón. <br />- SIEMPRE VERIFIQUE QUE LOS DATOS IMPRESOS SEAN LOS
        CORRECTOS ANTES DE UTILIZAR EL CARTON.
      </Popover.Body>
    </Popover>
  )

  return (
    <>
      <div
        style={{
          margin: '50px',
          backgroundColor: '#ffffff',
          opacity: 1,
          background:
            'repeating-linear-gradient( 45deg, #45f7c022, #45f7c022 2px, #ffffff22 2px, #ffffff22 10px )',
        }}
      >
        <h1 style={{ color: 'black', margin: '10px' }}>
          Generador de Cartones de VCM
        </h1>
        <p style={{ color: 'black', margin: '10px' }}>
          Esta aplicación le permitirá generar un archivo .pdf de un cartón de
          tratamiento.
        </p>

        <OverlayTrigger trigger='click' placement='right' overlay={popover}>
          <Button variant='primary' style={{ color: 'black', margin: '10px' }}>
            Recomendaciones
          </Button>
        </OverlayTrigger>
      </div>

      {/*<Jumbotron>
        <h1>Generador de Cartones de VCM</h1>
        <p>Esta aplicación le permitirá generar un archivo .pdf de un cartón de tratamiento.</p>
        <p>
          <OverlayTrigger trigger="click" placement="right" overlay={popover}>
            <Button variant="primary">Recomendaciones</Button>
          </OverlayTrigger>
        </p>
  </Jumbotron>*/}
      {/* https://dev.to/pnkfluffy/passing-data-from-child-to-parent-with-react-hooks-1ji3 */}
      <Dropbox cargar={(datos) => setData(datos)} mensaje={handleCallbackMsj} />
      {data.hc && (
        <Carton
          datos={data}
          // mensaje={handleCallbackMsj}
          cargarDatosNuevo={(datos) => setData(datos)}
        />
      )}
      {/* tipoAlerta: success o danger */}
      {/* tipoBoton: outline-success o outline-danger */}

      {mostrarMsj && (
        <Alerta
          mostrar={dataMsj.mostrar}
          tipoAlerta={dataMsj.tipoAlerta}
          titulo={dataMsj.titulo}
          tipoBoton={dataMsj.tipoBoton}
          leyendaBoton={dataMsj.leyendaBoton}
          leyenda={dataMsj.leyenda}
          generar={generarCarton}
          cerrar={cerrarAlerta}
        ></Alerta>
      )}
      <Footer />
    </>
  )
}

export default App
