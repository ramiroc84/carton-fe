import React, { useState } from 'react';
import styled from 'styled-components';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

const Contenedor = styled.div`
  padding: 5% 20%;
`;
function Alerta(props) {
  const [show, setShow] = useState(true);
  //   if (props.mostrar) {

  function handleClick() {
    if (props.tipoAlerta === 'danger') {
      //   console.log('funciona');
      props.cerrar();
      setShow(false);
    } else if (props.tipoAlerta === 'success') {
      setShow(true);
      props.generar();
    }
  }

  return (
    <>
      <Contenedor>
        <Alert show={show} variant={props.tipoAlerta}>
          <Alert.Heading>{props.titulo}</Alert.Heading>
          <p>{props.leyenda}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={() => handleClick()} variant={props.tipoBoton}>
              {props.leyendaBoton}
            </Button>
          </div>
        </Alert>
      </Contenedor>
    </>
  );
  //   }
  //   return <></>;
}
export default Alerta;
