import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
// import leerDicom from '../utils/DicomReader';
import leerDicom from '../utils/DicomReaderV2';
function concatTypedArrays(a, b) {
  // a, b TypedArray of same type
  var c = new a.constructor(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}

// const getColor = (props) => {
//   if (props.isDragAccept) {
//     return '#00e676';
//   }
//   if (props.isDragReject) {
//     return '#ff1744';
//   }
//   if (props.isDragActive) {
//     return '#2196f3';
//   }
//   return '#eeeeee';
// };

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: #eeeeee;
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  margin: 1rem;
`;

function Dropbox({ cargar, mensaje }) {
  //   const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        const byteArray = new Uint8Array(binaryStr);
        //Leo dicom y cargo datos
        // console.log(typeof byteArray, byteArray);
        const datos = leerDicom(byteArray);
        // console.log(datos);
        // desde aca tengo que acar los datos
        if (datos) {
          cargar(datos);
          mensaje({
            mostrar: true,
            tipoAlerta: 'success',
            titulo: 'Archivo Valido',
            tipoBoton: 'outline-success',
            leyendaBoton: 'Continuar',
            leyenda:
              'Usted está por enviar los datos necesarios para generar un cartón de tratamiento. Una vez generado, controle cuidadosamente que los datos sean correctos. El autor no se responsabiliza por los posibles errores ocasionados al procesar/transferir la información.',
          });
        } else {
          let preamble = new Uint8Array(132).fill(0);
          preamble[128] = 68;
          preamble[129] = 73;
          preamble[130] = 67;
          preamble[131] = 77;

          const metaHeader = new Uint8Array([
            2,
            0,
            0,
            0,
            85,
            76,
            4,
            0,
            164,
            0,
            0,
            0,
            2,
            0,
            1,
            0,
            79,
            66,
            0,
            0,
            2,
            0,
            0,
            0,
            0,
            1,
            2,
            0,
            2,
            0,
            85,
            73,
            30,
            0,
            49,
            46,
            50,
            46,
            56,
            52,
            48,
            46,
            49,
            48,
            48,
            48,
            56,
            46,
            53,
            46,
            49,
            46,
            52,
            46,
            49,
            46,
            49,
            46,
            52,
            56,
            49,
            46,
            53,
            0,
            2,
            0,
            3,
            0,
            85,
            73,
            50,
            0,
            49,
            46,
            50,
            46,
            50,
            52,
            54,
            46,
            51,
            53,
            50,
            46,
            55,
            49,
            46,
            53,
            46,
            49,
            52,
            53,
            50,
            48,
            53,
            51,
            53,
            55,
            46,
            49,
            55,
            48,
            49,
            53,
            56,
            52,
            46,
            50,
            48,
            50,
            48,
            48,
            55,
            50,
            57,
            49,
            56,
            51,
            50,
            50,
            49,
            0,
            2,
            0,
            16,
            0,
            85,
            73,
            18,
            0,
            49,
            46,
            50,
            46,
            56,
            52,
            48,
            46,
            49,
            48,
            48,
            48,
            56,
            46,
            49,
            46,
            50,
            0,
            2,
            0,
            18,
            0,
            85,
            73,
            20,
            0,
            49,
            46,
            50,
            46,
            50,
            52,
            54,
            46,
            51,
            53,
            50,
            46,
            55,
            48,
            46,
            50,
            46,
            49,
            46,
            55,
          ]);
          const header = concatTypedArrays(preamble, metaHeader);
          const archModif = concatTypedArrays(header, byteArray);
          // console.log(archModif);
          const datos = leerDicom(archModif);
          //hay que añadir tags obligatorios
          //Error en lectura de archivo dicomParser.parseDicom: missing required meta header attribute 0002,0010
          // console.log(archModif);
          if (datos) {
            cargar(datos);
            mensaje({
              mostrar: true,
              tipoAlerta: 'success',
              titulo: 'Archivo Valido',
              tipoBoton: 'outline-success',
              leyendaBoton: 'Continuar',
              leyenda:
                'Usted está por enviar los datos necesarios para generar un cartón de tratamiento. Una vez generado, controle cuidadosamente que los datos sean correctos. El autor no se responsabiliza por los posibles errores ocasionados al procesar/transferir la información.',
            });
          } else {
            mensaje({
              mostrar: true,
              tipoAlerta: 'danger',
              titulo: 'Error en Archivo',
              tipoBoton: 'outline-danger',
              leyendaBoton: 'Cerrar',
              leyenda: 'El archivo no se pudo leer.',
            });
          }
        }

        // console.log(datos);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const {
    getRootProps,
    // acceptedFiles,
    // getInputProps,
    // isDragActive,
    // isDragAccept,
    // isDragReject,
  } = useDropzone({
    accept: '.dcm',
    onDrop,
    maxFiles: 1,
  });

  //   const files = acceptedFiles.map((file) => (
  //     <li key={file.path}>

  //       {file.path} - {file.size} bytes
  //     </li>
  //   ));

  return (
    <section className="container">
      <Container {...getRootProps({ className: 'dropzone' })}>
        {/* <input {...getInputProps()} /> */}
        {/* {isDragAccept && <p>All files will be accepted</p>}
        {isDragReject && <p>Archivo Invalido</p>} */}
        {/* {!isDragActive && <p>Drop some files here ...</p>} */}
        <p>Arrastre su archivo hasta aqui</p>
      </Container>
      <aside>{/* <h4>Files</h4>
        <ul>{files}</ul> */}</aside>
    </section>
  );
}
export default Dropbox;
