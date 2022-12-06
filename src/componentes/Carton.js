import React, { useState, useEffect } from 'react';
// import Table from 'react-bootstrap/Table';
import styled from 'styled-components';
import img from '../utils/imgs/carton2.jpg';
import bfix from '../utils/imgs/bodyfix.png';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const celdaChicaAlto = 1.19;
const celdaGrandeAlto = 2.6;
const anchoCelda = 5;
const anchoCeldaAsim = 2.3; // celdas de tam asim;

const separacionHor = 0.7;
const separacionVert = 0.25;

const margenIzq = 11.4;
const margenSup = 3.4;
const margenInf = 15.9; //ums

const Contenedor = styled.div`
  /* border-width: 2px;
  border-radius: 1px;
  border-color: #000000;
  border-style: solid; */
  /* background-image: url(${img}); */
  /* background-position: center; Center the image */
  /* background-repeat: no-repeat; Do not repeat the image */
  /* background-size: contain; Resize the background image to cover the entire container */
  /* overflow-y: scroll; */
  /* overflow-x: scroll; */
  display: flex;
  @media (min-width: 1400px) {
    justify-content: center;
  }
`;

const ContIzq = styled.div`
  display: inline-block;
  height: 55rem;
  display: flex;
  position: relative;
  -webkit-box-shadow: 5px 5px 30px -7px #bbbbbb;
  box-shadow: 5px 5px 30px -7px #bbbbbb;
  margin: 3rem 1rem;
`;
const ContDer = styled.div`
  margin: 3rem 0;
  height: 55rem;
  /* background-color: grey; */
  width: 15rem;
  -webkit-box-shadow: 5px 5px 30px -7px #bbbbbb;
  box-shadow: 5px 5px 30px -7px #bbbbbb;
  border-radius: 0.5rem;

  padding-left: 1rem;
`;

const CeldaChica = styled.input`
  width: ${anchoCelda}rem;
  height: ${celdaChicaAlto}rem;
  /* background-color: orangered; */
  position: absolute;
  /* border: none; */
  border: 1px solid orangered;
  border-radius: 0.2rem;
  text-align: center;
`;
const CeldaGrande = styled.input`
  width: ${anchoCelda}rem;
  height: ${celdaGrandeAlto}rem;
  /* background-color: greenyellow; */
  position: absolute;
  /* border: none; */
  border: 1px solid orangered;
  border-radius: 0.2rem;
  text-align: center;
`;

const Imagen = styled.img`
  /* visibility: hidden; */
  display: inline-block;
  height: 56rem;
`;
const Imagen2 = styled.img`
  /* visibility: hidden; */
  position: absolute;
  height: 30rem;
  /* display: inline-block; */
  right: 1.95rem;
  top: 5.5rem;
`;

// const Celda = styled.td`
//   text-align: center;
// `;
// const Campos = styled.div``;
const Columna = styled.div``;
const Celdas = styled.div`
  display: flex;
  align-items: center;
  /* border-style: solid;
  border-width: 2px;
  border-radius: 1px;
  border-color: #000000;
  border-style: solid; */
`;

function Carton(props) {
  const [form, setForm] = useState({});
  const [init, setInit] = useState(true);
  console.log('CARTON', props.datos);
  // const nroCols = [1, 2, 3, 4, 5, 6, 7];

  useEffect(() => {
    props.cargarDatosNuevo(form);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleButtonClick = (e) => {
    // console.log(form);
    props.cargarDatosNuevo(form);
  };

  const handleCheckBoxChange = (e) => {
    // console.log('checkBox', e);
    const aux = form['bfix'];
    setForm({ ...form, bfix: !aux });
    // console.log(form);
  };

  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    // console.log(target);

    // console.log(form);
    setForm({
      ...form,
      [name]: value,
    });
    // setForm(form);
    // console.log(name, value);

    // props.cargarDatosNuevo(form);
  };

  const inicializar = () => {
    // console.log('init', init);

    if (init) {
      // console.log('datos', props.datos);
      const objInit = {};
      objInit['bfix'] = false;
      objInit['campostto'] = 0;
      objInit['hc'] = `${props.datos.hc ? props.datos.hc : '-'} (id:${props.datos.id ? props.datos.id : '-'})`;
      objInit['elemfij'] = `${props.datos.elemfij}`;
      objInit['pos'] = `${props.datos.pos}`;
      objInit['dfp'] = `${props.datos.dfp}`;
      objInit['region'] = `${props.datos.region}`;
      objInit['dtotal'] = `${
        props.datos.dosis && !isNaN(props.datos.dosis) && props.datos.dosis !== 0 && props.datos.dosis !== ''
          ? Math.round(props.datos.dosis * 100)
          : ''
      }`;
      objInit['ddiaria'] = `${objInit['dtotal'] !== '' ? Math.round((props.datos.dosis * 100) / props.datos.fracciones) : ''}`;
      // console.log(props.datos);

      // objInit['maquina'] = `MAQUINA: ${props.datos.maquina}`; // Tira error
      objInit['maquina'] = `MAQUINA: ${props.datos.maq_0}`;
      for (let i = 0; i < props.datos.camposTto; i += 1) {
        if (
          // props.datos.campos[i].tipoCampo === 'TREATMENT' &&
          !props.datos['campon_' + i].startsWith('s') &&
          !props.datos['campon_' + i].startsWith('S')
        ) {
          objInit['campostto'] += 1;
          objInit['campon_' + i] = props.datos['campon_' + i];
          objInit['e_' + i] = props.datos['haz_' + i] === 'PHOTON' ? `${props.datos['e_' + i]}MV` : `${props.datos['e_' + i]}MeV`;

          /* --------------------------------- POR ACA -------------------------------- */

          if (!props.datos['gtyfinal_' + i]) {
            objInit['gty_' + i] = `${props.datos['gty_' + i]}°`;
            objInit['gtyinicial_' + i] = `-`;
            objInit['gtyfinal_' + i] = `-`;
          } else {
            objInit['gty_' + i] = `-`;

            objInit['gtyinicial_' + i] = `${props.datos['gty_' + i]}°`;
            objInit['gtyfinal_' + i] = `${props.datos['gtyfinal_' + i]}°`;
          }

          objInit['col_' + i] = `${props.datos['col_' + i] < 0.1 ? 0 : Math.round(props.datos['col_' + i])}°`;
          objInit['cam_' + i] = `${Math.round(props.datos['cam_' + i]) === 360 ? 0 : Math.round(props.datos['cam_' + i])}°`;
          objInit['incid_' + i] = `${props.datos['incid_' + i]}`;
          objInit['obs_' + i] = '-';
          objInit['wedge_' + i] = props.datos['cuId_' + i] ? props.datos['cuId_' + i] : '-';
          objInit['bolus_' + i] = props.datos['bolus_' + i] ? 'BOLUS' : '-';

          if (props.datos['cono_' + i]) {
            objInit['cono_' + i] = `${props.datos['cono_' + i]}`;
          } else {
            objInit['cono_' + i] = `-`;
          }

          // objInit['ums_' + i] = !props.datos['split_' + i] || props.datos['nroSplit_' + i] > 3 ? `${Math.round(props.datos['ums_' + i])}` : ``;
          //SI NO ES UN ARCO, ESTA SPLITEADO Y NO TIENE JT
          if (!props.datos['gtyfinal_' + i] && props.datos['split_' + i] && props.datos['nroSplit_' + i] < 4) {
            //SI SPLITEADO EN 2
            if (props.datos['nroSplit_' + i] === 2) {
              // objInit['ums_' + i] = `2 splits`;

              objInit['ums_' + i] = `${Math.round(props.datos['ums_' + i] * props.datos['f1_' + i])}   ${Math.round(
                props.datos['ums_' + i] - props.datos['ums_' + i] * props.datos['f1_' + i]
              )}`;
            }
            //SI SPLITEADO EN 3
            if (props.datos['nroSplit_' + i] === 3) {
              objInit['ums_' + i] = `CARGAR`;
            }
          } else {
            objInit['ums_' + i] = `${Math.round(props.datos['ums_' + i])}`;
          }

          const y = props.datos['y_' + i].split('\\');
          const x = props.datos['x_' + i].split('\\');

          if (props.datos['split_' + i] && props.datos['nroSplit_' + i] > 3) {
            //JT
          } else {
            if (props.datos['haz_' + i] !== 'ELECTRON') {
              if (props.datos['yTipo_' + i] === 'Y' && props.datos['xTipo_' + i] === 'X') {
                objInit['tamsim_' + i] = `${Math.round(-1 * y[0] + 1 * y[1]) / 10} x ${Math.round(-1 * x[0] + 1 * x[1]) / 10}`;
              } else {
                objInit['tamsim_' + i] = '-';
                // console.log(x);
                // console.log(y);
                let valorxf = (0.1 * parseFloat(x[1])).toFixed(1);
                if (props.datos['xf_' + i]) {
                  const xf = props.datos['xf_' + i].split('\\');
                  valorxf = (0.1 * parseFloat(xf[1])).toFixed(1);
                }
                objInit['tamsimy1_' + i] = `${(-0.1 * parseFloat(y[0])).toFixed(1)}`;
                objInit['tamsimy2_' + i] = `${(0.1 * parseFloat(y[1])).toFixed(1)}`;
                objInit['tamsimx1_' + i] = `${(-0.1 * parseFloat(x[0])).toFixed(1)}`;
                objInit['tamsimx2_' + i] = `${valorxf}`;
              }
            }
          }
        }
      }

      setInit(false); // HAY QUE DESCOMENTARLO
      setForm(objInit);

      // props.cargarDatosNuevo(form);
    }
  };

  const nroCols = [1, 2, 3, 4, 5, 6, 7];
  inicializar();
  const items = nroCols.map((number) => (
    <Columna key={number}>
      <CeldaChica
        style={{
          top: `${margenSup + separacionVert}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
        }}
        name={`campon_${number - 1}`}
        value={form[`campon_${number - 1}`]}
        onChange={handleChange}
      ></CeldaChica>
      <CeldaChica
        style={{
          top: `${margenSup + 1 * celdaChicaAlto + 2 * separacionVert}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
        }}
        name={`e_${number - 1}`}
        value={form[`e_${number - 1}`]}
        onChange={handleChange}
      ></CeldaChica>

      {number > props.datos.campostto && (
        <>
          <CeldaGrande
            style={{
              top: `${margenSup + 2 * celdaChicaAlto + 3 * separacionVert}rem`,
              left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
              textAlign: 'center',
            }}
            name={`region_${number - 1}`}
            value={form[`region_${number - 1}`]}
            onChange={handleChange}
            // name={`region`}
            // value={form[`region`]}
          ></CeldaGrande>
          <CeldaChica
            style={{
              top: `${margenSup + 5 * celdaChicaAlto + celdaGrandeAlto + 7 * separacionVert}rem`,
              left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
              textAlign: 'center',
            }}
            name={`dtotal_${number - 1}`}
            value={form[`dtotal_${number - 1}`]}
            onChange={handleChange}
            // name={`dtotal`}
            // value={form[`dtotal`]}
            // onChange={handleChange}
          ></CeldaChica>
          <CeldaGrande
            style={{
              top: `${margenSup + 6 * celdaChicaAlto + celdaGrandeAlto + 8 * separacionVert}rem`,
              left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
              textAlign: 'center',
            }}
            name={`ddiaria_${number - 1}`}
            value={form[`ddiaria_${number - 1}`]}
            onChange={handleChange}

            // name={`ddiaria`}
            // value={form[`ddiaria`]}
            // onChange={handleChange}
          ></CeldaGrande>
          <CeldaChica
            style={{
              top: `${margenSup + 6 * celdaChicaAlto + 2 * celdaGrandeAlto + 9 * separacionVert}rem`,
              left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
              textAlign: 'center',
            }}
            name={`dfp_${number - 1}`}
            value={form[`dfp_${number - 1}`]}
            onChange={handleChange}
            // name={`dfp`}
            // value={form[`dfp`]}
            // onChange={handleChange}
          ></CeldaChica>
        </>
      )}
      <CeldaChica
        style={{
          top: `${margenSup + 4 * celdaChicaAlto + celdaGrandeAlto + 6 * separacionVert}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
        }}
        name={`incid_${number - 1}`}
        value={form[`incid_${number - 1}`]}
        onChange={handleChange}
      ></CeldaChica>

      <CeldaChica
        style={{
          top: `${margenSup + 7 * celdaChicaAlto + 2 * celdaGrandeAlto + 10 * separacionVert}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
        }}
        name={`tamsim_${number - 1}`}
        value={form[`tamsim_${number - 1}`]}
        onChange={handleChange}
      ></CeldaChica>

      <CeldaChica
        style={{
          top: `${margenSup + 8 * celdaChicaAlto + 2 * celdaGrandeAlto + 11 * separacionVert}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
          // backgroundColor: 'cyan',
          width: `${anchoCeldaAsim}rem`,
        }}
        name={`tamsimx1_${number - 1}`}
        value={form[`tamsimx1_${number - 1}`]}
        onChange={handleChange}
      ></CeldaChica>
      <CeldaChica
        style={{
          top: `${margenSup + 8 * celdaChicaAlto + 2 * celdaGrandeAlto + 11 * separacionVert}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor) + anchoCeldaAsim + separacionHor / 2}rem`,
          // backgroundColor: 'cyan',
          width: `${anchoCeldaAsim}rem`,
        }}
        name={`tamsimx2_${number - 1}`}
        value={form[`tamsimx2_${number - 1}`]}
        onChange={handleChange}
      ></CeldaChica>
      <CeldaChica
        style={{
          top: `${margenSup + 9 * celdaChicaAlto + 2 * celdaGrandeAlto + 12 * separacionVert}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
          // backgroundColor: 'cyan',
          width: `${anchoCeldaAsim}rem`,
        }}
        name={`tamsimy1_${number - 1}`}
        value={form[`tamsimy1_${number - 1}`]}
        onChange={handleChange}
      ></CeldaChica>
      <CeldaChica
        style={{
          top: `${margenSup + 9 * celdaChicaAlto + 2 * celdaGrandeAlto + 12 * separacionVert}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor) + anchoCeldaAsim + separacionHor / 2}rem`,
          // backgroundColor: 'cyan',
          width: `${anchoCeldaAsim}rem`,
        }}
        name={`tamsimy2_${number - 1}`}
        value={form[`tamsimy2_${number - 1}`]}
        onChange={handleChange}
      ></CeldaChica>
      <CeldaChica
        style={{
          top: `${margenSup + 10 * celdaChicaAlto + 2 * celdaGrandeAlto + 13 * separacionVert}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
        }}
        name={`cono_${number - 1}`}
        value={form[`cono_${number - 1}`]}
        onChange={handleChange}
      ></CeldaChica>

      <CeldaChica
        style={{
          top: `${margenSup + 11 * celdaChicaAlto + 2 * celdaGrandeAlto + 14 * separacionVert}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
        }}
        name={`gty_${number - 1}`}
        value={form[`gty_${number - 1}`]}
        onChange={handleChange}
      ></CeldaChica>
      <CeldaChica
        style={{
          top: `${margenSup + 12 * celdaChicaAlto + 2 * celdaGrandeAlto + 15 * separacionVert}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
        }}
        name={`col_${number - 1}`}
        value={form[`col_${number - 1}`]}
        onChange={handleChange}
      ></CeldaChica>

      <CeldaChica
        style={{
          top: `${margenSup + 13 * celdaChicaAlto + 2 * celdaGrandeAlto + 16 * separacionVert}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
        }}
        name={`cam_${number - 1}`}
        value={form[`cam_${number - 1}`]}
        onChange={handleChange}
      ></CeldaChica>
      <CeldaChica
        style={{
          top: `${margenSup + 14 * celdaChicaAlto + 2 * celdaGrandeAlto + 17 * separacionVert}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
        }}
        name={`wedge_${number - 1}`}
        value={form[`wedge_${number - 1}`]}
        onChange={handleChange}
      ></CeldaChica>
      <CeldaChica
        style={{
          top: `${margenSup + 15 * celdaChicaAlto + 2 * celdaGrandeAlto + 18 * separacionVert}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
        }}
        name={`bolus_${number - 1}`}
        value={form[`bolus_${number - 1}`]}
        onChange={handleChange}
      ></CeldaChica>
      <CeldaChica
        style={{
          top: `${margenSup + 16 * celdaChicaAlto + 2 * celdaGrandeAlto + 19 * separacionVert}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
        }}
        name={`gtyinicial_${number - 1}`}
        value={form[`gtyinicial_${number - 1}`]}
        onChange={handleChange}
      ></CeldaChica>
      <CeldaChica
        style={{
          top: `${margenSup + 17 * celdaChicaAlto + 2 * celdaGrandeAlto + 20 * separacionVert}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
        }}
        name={`gtyfinal_${number - 1}`}
        value={form[`gtyfinal_${number - 1}`]}
        onChange={handleChange}
      ></CeldaChica>
      <CeldaChica
        style={{
          top: `${margenSup + 18 * celdaChicaAlto + 2 * celdaGrandeAlto + 21 * separacionVert}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
        }}
        name={`obs_${number - 1}`}
        value={form[`obs_${number - 1}`]}
        onChange={handleChange}
      ></CeldaChica>
      <CeldaGrande
        style={{
          top: `${margenSup + 19 * celdaChicaAlto + 2 * celdaGrandeAlto + 22 * separacionVert + margenInf}rem`,
          left: `${margenIzq + (number - 1) * (anchoCelda + separacionHor)}rem`,
        }}
        name={`ums_${number - 1}`}
        value={form[`ums_${number - 1}`]}
        onChange={handleChange}
      ></CeldaGrande>
    </Columna>
  ));

  // console.log(form);
  return (
    <>
      {props.datos.hc && (
        <Contenedor>
          <ContIzq>
            <Imagen src={img} alt="" />
            {form['bfix'] && <Imagen2 src={bfix} alt="" />}
            <form onSubmit={handleSubmit}>
              <CeldaGrande
                style={{
                  top: `${margenSup + 2 * celdaChicaAlto + 3 * separacionVert}rem`,
                  left: `${margenIzq}rem`,
                  width: `${(anchoCelda + separacionHor) * (props.datos.camposTto > 7 ? 7 : props.datos.camposTto) - separacionHor}rem`,
                  textAlign: 'center',
                }}
                name={`region`}
                value={form[`region`]}
                onChange={handleChange}
              ></CeldaGrande>
              <CeldaChica
                style={{
                  top: `${margenSup + 2 * celdaChicaAlto + celdaGrandeAlto + 4 * separacionVert}rem`,
                  left: `${margenIzq}rem`,
                  width: `${(anchoCelda + separacionHor) * 7 - separacionHor}rem`,
                  textAlign: 'left',
                }}
                name={`pos`}
                value={form[`pos`]}
                onChange={handleChange}
              ></CeldaChica>
              <CeldaChica
                style={{
                  top: `${margenSup + 3 * celdaChicaAlto + celdaGrandeAlto + 5 * separacionVert}rem`,
                  left: `${margenIzq}rem`,
                  width: `${(anchoCelda + separacionHor) * 7 - separacionHor}rem`,
                  textAlign: 'left',
                }}
                name={`elemfij`}
                value={form[`elemfij`]}
                onChange={handleChange}
              ></CeldaChica>
              <CeldaChica
                style={{
                  top: `${margenSup + 5 * celdaChicaAlto + celdaGrandeAlto + 7 * separacionVert}rem`,
                  left: `${margenIzq}rem`,
                  width: `${(anchoCelda + separacionHor) * (props.datos.camposTto > 7 ? 7 : props.datos.camposTto) - separacionHor}rem`,
                  textAlign: 'center',
                }}
                name={`dtotal`}
                value={form[`dtotal`]}
                onChange={handleChange}
              ></CeldaChica>
              <CeldaGrande
                style={{
                  top: `${margenSup + 6 * celdaChicaAlto + celdaGrandeAlto + 8 * separacionVert}rem`,
                  left: `${margenIzq}rem`,
                  width: `${(anchoCelda + separacionHor) * (props.datos.camposTto > 7 ? 7 : props.datos.camposTto) - separacionHor}rem`,
                  textAlign: 'center',
                }}
                name={`ddiaria`}
                value={form[`ddiaria`]}
                onChange={handleChange}
              ></CeldaGrande>
              <CeldaChica
                style={{
                  top: `${margenSup + 6 * celdaChicaAlto + 2 * celdaGrandeAlto + 9 * separacionVert}rem`,
                  left: `${margenIzq}rem`,
                  width: `${(anchoCelda + separacionHor) * (props.datos.camposTto > 7 ? 7 : props.datos.camposTto) - separacionHor}rem`,
                  textAlign: 'center',
                }}
                name={`dfp`}
                value={form[`dfp`]}
                onChange={handleChange}
              ></CeldaChica>
              <CeldaChica
                style={{
                  top: `${2.2}rem`,
                  left: `${54.5}rem`,
                  width: `${9}rem`,
                  textAlign: 'left',
                  // backgroundColor: 'blue',
                }}
                name={`hc`}
                value={form[`hc`]}
                onChange={handleChange}
              ></CeldaChica>
              <CeldaChica
                style={{
                  bottom: `${14}rem`,
                  left: `${51}rem`,
                  width: `${20}rem`,
                  textAlign: 'left',
                  // backgroundColor: 'yellow',
                }}
                name={`maquina`}
                value={form[`maquina`]}
                onChange={handleChange}
              ></CeldaChica>
              <CeldaChica
                style={{
                  bottom: `${12.5}rem`,
                  left: `${51}rem`,
                  width: `${20}rem`,
                  textAlign: 'left',
                  // backgroundColor: 'green',
                }}
                name={`obs`}
                value={form[`obs`]}
                onChange={handleChange}
              ></CeldaChica>
              <Celdas>{items}</Celdas>
              {/* <input type="submit" value="Submit" /> */}
            </form>
          </ContIzq>
          <ContDer>
            <h1>Preferencias</h1>

            <Form.Group controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                label="Bodyfix"
                onChange={handleCheckBoxChange}
                defaultChecked={form['bfix']}
                // onChange={handleChange}
              />
            </Form.Group>
            {/* <CeldaGrande></CeldaGrande>
            <br />
            <br />
            <br /> */}
            <Button variant="primary" type="button" onClick={handleButtonClick}>
              Guardar cambios...
            </Button>
            {/* <h1>Etiqueta</h1>
            <input name="etiqueta" type="radio" value="bodyfix" />
            Bodyfix
            <br />
            <input name="etiqueta" type="radio" value="ninguno" checked="checked" />
            Ninguno
            <h1>Planes</h1>
            <input name="planes" type="radio" value="1" checked="checked" />
            1
            <br />
            <input name="planes" type="radio" value="2" />
            2
            <br />
            <input name="planes" type="radio" value="3" />
            3
            <br />
            <input name="planes" type="radio" value="4" />4 */}
          </ContDer>
          {/* <Table bordered hover size="sm">
            <tbody>
              {filas.map((ele) => (
                <tr>
                  <td>{ele.leyenda}</td>
                  {props.datos.campos.map((cpo) => cpo.nro && cpo.tipoCampo !== 'SETUP' && <Celda>{cpo[ele.name]}</Celda>)}
                </tr>
              ))}
            </tbody>
          </Table> */}
        </Contenedor>
      )}
    </>
  );
}
export default Carton;
