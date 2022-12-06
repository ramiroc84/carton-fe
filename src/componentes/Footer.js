import React from 'react';
import styled from 'styled-components';

const Contenedor = styled.div`
  background-color: #007bff;
  height: 3rem;
  /* position: relative; */
  position: fixed;
  bottom: 0;
  width: 100%;
`;
const Texto = styled.div`
  color: white;
  text-align: right;
  padding-right: 1rem;
  padding-top: 0.5rem;
  font-size: 0.9rem;
`;

function Footer() {
  return (
    <>
      <Contenedor>
        <Texto>&reg;Ramiro Cufré. 2020</Texto>
      </Contenedor>
    </>
  );
}
export default Footer;
