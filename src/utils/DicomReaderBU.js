const dicomParser = require('dicom-parser');

function convAng(angDicom) {
  if (angDicom >= 0 && angDicom <= 180) {
    return 180 - angDicom;
  } else {
    return 540 - angDicom;
  }
}

// nombre: '',
// hc: '',
// region: '',
// pos: '',
// elemfij: '',
// maquina: '',

// campon_1: '',
// e_1: '',
// incid_1: '',
// dtotal_1: '',
// ddiaria_1: '',
// dfp_1: '',
// tamsim_1: '',
// tamasimx1_1: '',
// tamasimx2_1: '',
// tamasimy1_1: '',
// tamasimy2_1: '',
// cono_1: '',
// gty_1: '',
// col_1: '',
// cam_1: '',
// wedge_1: '',
// bolus_1: '',
// gtyinicial_1: '',
// gtyfinal_1: '',
// umdeg_1: '',
// ums_1: '',
// grupo_1: '',

function leerDicom(dicomFileAsBuffer) {
  try {
    // aca va el archivo
    // var dicomFileAsBuffer = fs.readFileSync('./spliteados2.dcm');

    var dataSet = dicomParser.parseDicom(dicomFileAsBuffer);

    const datos = {};
    const campos = [{}];

    //Para no mandarlo al servidor, deshabilitarlo

    // datos.nombre = '*****'; //dataSet.string('x00100010');
    if (dataSet.string('x00081090') !== 'XiO') {
      datos.hc = dataSet.string('x00101000');
      datos.id = dataSet.string('x00100020');

      if (dataSet.string('x300a0003')) {
        datos.region = dataSet.string('x300a0003');
      } else {
        datos.region = dataSet.string('x300a0002');
      }
      // console.log(datos);
      for (let j = 0; j < dataSet.elements.x300a0010.items.length; j += 1) {
        // console.log(dataSet.elements.x300a0010.items[j].dataSet.string('x300a0016'));
        // console.log(dataSet.elements.x300a0010.items[j].dataSet.string('x300a0020'));
        if (
          dataSet.elements.x300a0010.items[j].dataSet
            .string('x300a0016')
            .startsWith('PTV') &&
          dataSet.elements.x300a0010.items[j].dataSet.string('x300a0020') ===
            'TARGET'
        ) {
          // console.log('ENTROOO');
          datos.dosis = parseFloat(
            dataSet.elements.x300a0010.items[j].dataSet.string('x300a0026')
          );
          if (datos.dosis === 0) {
            datos.dosis = parseFloat(
              dataSet.elements.x300a0010.items[j].dataSet.string('x300a0023')
            );
          }
        }
      }

      datos.fracciones = parseInt(
        dataSet.elements.x300a0070.items[0].dataSet.string('x300a0078')
      );
      datos.nroCampos = parseInt(
        dataSet.elements.x300a0070.items[0].dataSet.string('x300a0080')
      );
      datos.camposTto = 0;

      //ums
      let ums = new Array(parseInt(datos.nroCampos));

      for (let i = 0; i < datos.nroCampos; i += 1) {
        // 300A,0070 -> Fraction Group Sequence
        ums[
          parseInt(
            dataSet.elements.x300a0070.items[0].dataSet.elements.x300c0004.items[
              i
            ].dataSet.string('x300c0006')
          )
        ] = parseFloat(
          dataSet.elements.x300a0070.items[0].dataSet.elements.x300c0004.items[
            i
          ].dataSet.string('x300a0086')
        );
      }
      // console.log(ums);
      // Parametros de campos
      for (let i = 0; i < datos.nroCampos; i += 1) {
        const campo = {};

        campo.nro = parseInt(
          dataSet.elements.x300a00b0.items[i].dataSet.string('x300a00c0')
        );
        campo.tipoEntrega = dataSet.elements.x300a00b0.items[i].dataSet.string(
          'x300a00c4'
        );
        campo.haz = dataSet.elements.x300a00b0.items[i].dataSet.string(
          'x300a00c6'
        );
        campo.nombre = dataSet.elements.x300a00b0.items[i].dataSet.string(
          'x300a00c2'
        );
        campo.tipoCampo = dataSet.elements.x300a00b0.items[i].dataSet.string(
          'x300a00ce'
        );
        if (campo.tipoCampo === 'TREATMENT') datos.camposTto += 1;
        campo.e = parseFloat(
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a0114')
        );

        campo.dr = parseInt(
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a0115')
        );

        campo.maquina = dataSet.elements.x300a00b0.items[i].dataSet.string(
          'x300a00b2'
        );

        let angGty = parseFloat(
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a011e')
        );
        let angCol = parseFloat(
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a0120')
        );
        //Rotacion de camilla es 360-  campo.couch
        let angCouch = parseFloat(
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a0122')
        );
        if (
          campo.maquina === 'CBA2100CD' ||
          campo.maquina === 'CBA_6EX_774' ||
          campo.maquina === 'ABA_6X80_38' ||
          campo.maquina === 'ALA_6/100_467' ||
          campo.maquina === 'CLA_6EX_760' ||
          campo.maquina === 'CLO_6/100_437' ||
          campo.maquina === 'ECA_6X80_47' ||
          campo.maquina === 'NBA_6/100_299' ||
          campo.maquina === 'PBA_6EX_730' ||
          campo.maquina === 'VBA_6X80_46'
        ) {
          campo.gty = convAng(angGty);
          campo.col = convAng(angCol);
          campo.couch = convAng(angCouch);
        } else {
          campo.couch = angCouch === 0 ? angCouch : 360 - angCouch;
          campo.gty = angGty;
          campo.col = angCol;
        }

        campo.dfp = parseFloat(
          (
            parseFloat(
              dataSet.elements.x300a00b0.items[
                i
              ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a0130')
            ) / 10
          ).toFixed(1)
        );

        /* -------------------------------- Isocentro ------------------------------- */

        // campo.iso = dataSet.elements.x300a00b0.items[
        //   i
        // ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a012c');

        /* --------------------------------- Maquina -------------------------------- */

        campo.maquina = dataSet.elements.x300a00b0.items[i].dataSet.string(
          'x300a00b2'
        );

        // Cuñas
        if (
          dataSet.elements.x300a00b0.items[i].dataSet.string('x300a00d0') ===
          '1'
        ) {
          campo.cuAng = parseInt(
            dataSet.elements.x300a00b0.items[
              i
            ].dataSet.elements.x300a00d1.items[0].dataSet.string('x300a00d5')
          );

          campo.cuId = dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a00d1.items[0].dataSet.string('x300a00d4');

          campo.cuOrient = dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a00d1.items[0].dataSet.string('x300a00d8');
        }
        //x300a0111 = control point sequence
        //x300a011a = Beam Limiting Device Position Sequence
        //x300a011c = Leaf/Jaw Positions

        // Electrones
        if (campo.haz === 'ELECTRON') {
          campo.cono = dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0107.items[0].dataSet.string('x300a0108');
        }
        //Jaws
        campo.xTipo = dataSet.elements.x300a00b0.items[
          i
        ].dataSet.elements.x300a0111.items[0].dataSet.elements.x300a011a.items[0].dataSet.string(
          'x300a00b8'
        );
        campo.x = dataSet.elements.x300a00b0.items[
          i
        ].dataSet.elements.x300a0111.items[0].dataSet.elements.x300a011a.items[0].dataSet.string(
          'x300a011c'
        );
        campo.yTipo = dataSet.elements.x300a00b0.items[
          i
        ].dataSet.elements.x300a0111.items[0].dataSet.elements.x300a011a.items[1].dataSet.string(
          'x300a00b8'
        );
        campo.y = dataSet.elements.x300a00b0.items[
          i
        ].dataSet.elements.x300a0111.items[0].dataSet.elements.x300a011a.items[1].dataSet.string(
          'x300a011c'
        );
        //Split
        if (campo.tipoEntrega === 'DYNAMIC') {
          const nroCtrlPoints = dataSet.elements.x300a00b0.items[
            i
          ].dataSet.string('x300a0110');
          // console.log(nroCtrlPoints);
          // console.log(
          //   dataSet.elements.x300a00b0.items[i].dataSet.elements.x300a0111.items[nroCtrlPoints - 1]
          //     .dataSet.elements.x300a011a.items
          // );
          if (
            dataSet.elements.x300a00b0.items[i].dataSet.elements.x300a0111
              .items[nroCtrlPoints - 1].dataSet.elements.x300a011a.items
              .length > 1
          ) {
            campo.split = true;
            campo.nroSplit = 1;

            let valorPruebaX = campo.x;
            for (let j = 1; j < nroCtrlPoints - 1; j += 1) {
              if (
                dataSet.elements.x300a00b0.items[
                  i
                ].dataSet.elements.x300a0111.items[
                  j
                ].dataSet.elements.x300a011a.items[0].dataSet.string(
                  'x300a00b8'
                ) === 'ASYMX' &&
                dataSet.elements.x300a00b0.items[
                  i
                ].dataSet.elements.x300a0111.items[
                  j
                ].dataSet.elements.x300a011a.items[0].dataSet.string(
                  'x300a011c'
                ) !== valorPruebaX
              ) {
                valorPruebaX = dataSet.elements.x300a00b0.items[
                  i
                ].dataSet.elements.x300a0111.items[
                  j
                ].dataSet.elements.x300a011a.items[0].dataSet.string(
                  'x300a011c'
                );
                campo.nroSplit += 1;
                if (campo.f1) {
                  campo.f2 = parseFloat(
                    dataSet.elements.x300a00b0.items[
                      i
                    ].dataSet.elements.x300a0111.items[j].dataSet.string(
                      'x300a0134'
                    )
                  );
                } else {
                  campo.f1 = parseFloat(
                    dataSet.elements.x300a00b0.items[
                      i
                    ].dataSet.elements.x300a0111.items[j].dataSet.string(
                      'x300a0134'
                    )
                  );
                }
                // console.log(
                //   `x:${campo.x} -- x1:${dataSet.elements.x300a00b0.items[i].dataSet.elements.x300a0111.items[
                //     j
                //   ].dataSet.elements.x300a011a.items[0].dataSet.string('x300a011c')} -- f:${dataSet.elements.x300a00b0.items[
                //     i
                //   ].dataSet.elements.x300a0111.items[j].dataSet.string('x300a0134')}`
                // );
              }
            }
            campo.xf = valorPruebaX;

            // console.log(campo.nroSplit);
          } else {
            campo.split = false;
          }
        }

        // Arcos
        if (
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a011f') !==
          'NONE'
        ) {
          campo.gtyEnd = dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[
            dataSet.elements.x300a00b0.items[i].dataSet.elements.x300a0111.items
              .length - 1
          ].dataSet.string('x300a011e');
        }

        // Bolus
        if (
          dataSet.elements.x300a00b0.items[i].dataSet.string('x300a00ed') !==
          '0'
        ) {
          campo.bolus = true;
        }

        campo.ums = parseFloat(ums[parseInt(campo.nro)].toFixed(4));
        if (campo.tipoCampo === 'TREATMENT' || campo.tipoCampo === 'SETUP') {
          campos.push(campo);
        }
      }

      /* ----------------------------- Inmovilizacion ----------------------------- */
      for (let k = 0; k < dataSet.elements.x300a0180.items.length; k += 1) {
        const aux = dataSet.elements.x300a0180.items[k].dataSet.string(
          'x300a01b2'
        );
        if (typeof aux != 'undefined') {
          const posic = aux.replace('\n', '');
          // console.log(posic.split('//'));
          datos.posic = posic.split('//')[0];
          datos.inmov = posic.split('//')[1];
        }
      }

      // dataSet.elements.x300a0180.items[0].dataSet.string('x300a0078');

      datos.campos = campos;

      /* ----------------------------------- XiO ---------------------------------- */
    } else {
      datos.dosis = 0;
      datos.fracciones = parseInt(
        dataSet.elements.x300a0070.items[0].dataSet.string('x300a0078')
      );
      datos.hc = dataSet.string('x00100020'); //en XiO aca hc en lugar de id?
      datos.nroCampos = parseInt(
        dataSet.elements.x300a0070.items[0].dataSet.string('x300a0080')
      );
      // console.log(datos.nroCampos);
      let ums = new Array(parseInt(datos.nroCampos) + 1);
      ums[0] = 0;

      for (let i = 0; i < datos.nroCampos; i += 1) {
        // 300A,0070 -> Fraction Group Sequence
        ums[
          parseInt(
            dataSet.elements.x300a0070.items[0].dataSet.elements.x300c0004.items[
              i
            ].dataSet.string('x300c0006')
          )
        ] = Math.round(
          dataSet.elements.x300a0070.items[0].dataSet.elements.x300c0004.items[
            i
          ].dataSet.string('x300a0086')
        );
        datos.dosis +=
          dataSet.elements.x300a0070.items[0].dataSet.elements.x300c0004.items[
            i
          ].dataSet.string('x300a0084') * 1;
      }
      console.log('UMS ');
      console.log(ums);
      for (let i = 0; i < datos.nroCampos; i += 1) {
        // 300A,0070 -> Fraction Group Sequence
        ums[
          parseInt(
            dataSet.elements.x300a0070.items[0].dataSet.elements.x300c0004.items[
              i
            ].dataSet.string('x300c0006')
          )
        ] = parseFloat(
          dataSet.elements.x300a0070.items[0].dataSet.elements.x300c0004.items[
            i
          ].dataSet.string('x300a0086')
        );
      }
      // console.log(ums);
      // Parametros de campos
      for (let i = 0; i < datos.nroCampos; i += 1) {
        const campo = {};

        campo.nro = parseInt(
          dataSet.elements.x300a00b0.items[i].dataSet.string('x300a00c0')
        );
        campo.tipoEntrega = dataSet.elements.x300a00b0.items[i].dataSet.string(
          'x300a00c4'
        );
        campo.haz = dataSet.elements.x300a00b0.items[i].dataSet.string(
          'x300a00c6'
        );
        campo.nombre = dataSet.elements.x300a00b0.items[i].dataSet.string(
          'x300a00c2'
        );
        campo.tipoCampo = dataSet.elements.x300a00b0.items[i].dataSet.string(
          'x300a00ce'
        );
        // if (campo.tipoCampo === 'TREATMENT') datos.camposTto += 1;
        campo.e = parseFloat(
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a0114')
        );

        // campo.dr = parseInt(dataSet.elements.x300a00b0.items[i].dataSet.elements.x300a0111.items[0].dataSet.string('x300a0115'));

        campo.maquina = dataSet.elements.x300a00b0.items[i].dataSet.string(
          'x300a00b2'
        );

        let angGty = parseFloat(
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a011e')
        );
        let angCol = parseFloat(
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a0120')
        );
        //Rotacion de camilla es 360-  campo.couch
        let angCouch = parseFloat(
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a0122')
        );
        if (campo.maquina === 'LomasAceve2016' || campo.maquina === 'LBA6100') {
          campo.gty = convAng(angGty);
          campo.col = convAng(angCol);
          campo.couch = convAng(angCouch);
        } else {
          campo.couch = angCouch === 0 ? angCouch : 360 - angCouch;
          campo.gty = angGty;
          campo.col = angCol;
        }

        campo.dfp = parseFloat(
          (
            parseFloat(
              dataSet.elements.x300a00b0.items[
                i
              ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a0130')
            ) / 10
          ).toFixed(1)
        );

        /* -------------------------------- Isocentro ------------------------------- */

        // campo.iso = dataSet.elements.x300a00b0.items[
        //   i
        // ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a012c');

        /* --------------------------------- Maquina -------------------------------- */

        campo.maquina = dataSet.elements.x300a00b0.items[i].dataSet.string(
          'x300a00b2'
        );

        // Cuñas
        if (
          dataSet.elements.x300a00b0.items[i].dataSet.string('x300a00d0') ===
          '1'
        ) {
          // campo.cuAng = parseInt(dataSet.elements.x300a00b0.items[i].dataSet.elements.x300a00d1.items[0].dataSet.string('x300a00d5'));

          campo.cuId = dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a00d1.items[0].dataSet.string('x300a00d4');

          campo.cuOrient = dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a00d1.items[0].dataSet.string('x300a00d8');
        }
        //x300a0111 = control point sequence
        //x300a011a = Beam Limiting Device Position Sequence
        //x300a011c = Leaf/Jaw Positions

        // Electrones
        if (campo.haz === 'ELECTRON') {
          campo.cono = dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0107.items[0].dataSet.string('x300a0108');
        }
        //Jaws
        campo.xTipo = dataSet.elements.x300a00b0.items[
          i
        ].dataSet.elements.x300a0111.items[0].dataSet.elements.x300a011a.items[0].dataSet.string(
          'x300a00b8'
        );
        campo.x = dataSet.elements.x300a00b0.items[
          i
        ].dataSet.elements.x300a0111.items[0].dataSet.elements.x300a011a.items[0].dataSet.string(
          'x300a011c'
        );
        campo.yTipo = dataSet.elements.x300a00b0.items[
          i
        ].dataSet.elements.x300a0111.items[0].dataSet.elements.x300a011a.items[1].dataSet.string(
          'x300a00b8'
        );
        campo.y = dataSet.elements.x300a00b0.items[
          i
        ].dataSet.elements.x300a0111.items[0].dataSet.elements.x300a011a.items[1].dataSet.string(
          'x300a011c'
        );
        //Split
        if (campo.tipoEntrega === 'DYNAMIC') {
          const nroCtrlPoints = dataSet.elements.x300a00b0.items[
            i
          ].dataSet.string('x300a0110');
          // console.log(nroCtrlPoints);
          // console.log(
          //   dataSet.elements.x300a00b0.items[i].dataSet.elements.x300a0111.items[nroCtrlPoints - 1]
          //     .dataSet.elements.x300a011a.items
          // );
          if (
            dataSet.elements.x300a00b0.items[i].dataSet.elements.x300a0111
              .items[nroCtrlPoints - 1].dataSet.elements.x300a011a.items
              .length > 1
          ) {
            campo.split = true;
            campo.nroSplit = 1;

            let valorPruebaX = campo.x;
            for (let j = 1; j < nroCtrlPoints - 1; j += 1) {
              if (
                dataSet.elements.x300a00b0.items[
                  i
                ].dataSet.elements.x300a0111.items[
                  j
                ].dataSet.elements.x300a011a.items[0].dataSet.string(
                  'x300a00b8'
                ) === 'ASYMX' &&
                dataSet.elements.x300a00b0.items[
                  i
                ].dataSet.elements.x300a0111.items[
                  j
                ].dataSet.elements.x300a011a.items[0].dataSet.string(
                  'x300a011c'
                ) !== valorPruebaX
              ) {
                valorPruebaX = dataSet.elements.x300a00b0.items[
                  i
                ].dataSet.elements.x300a0111.items[
                  j
                ].dataSet.elements.x300a011a.items[0].dataSet.string(
                  'x300a011c'
                );
                campo.nroSplit += 1;
                if (campo.f1) {
                  campo.f2 = parseFloat(
                    dataSet.elements.x300a00b0.items[
                      i
                    ].dataSet.elements.x300a0111.items[j].dataSet.string(
                      'x300a0134'
                    )
                  );
                } else {
                  campo.f1 = parseFloat(
                    dataSet.elements.x300a00b0.items[
                      i
                    ].dataSet.elements.x300a0111.items[j].dataSet.string(
                      'x300a0134'
                    )
                  );
                }
                // console.log(
                //   `x:${campo.x} -- x1:${dataSet.elements.x300a00b0.items[i].dataSet.elements.x300a0111.items[
                //     j
                //   ].dataSet.elements.x300a011a.items[0].dataSet.string('x300a011c')} -- f:${dataSet.elements.x300a00b0.items[
                //     i
                //   ].dataSet.elements.x300a0111.items[j].dataSet.string('x300a0134')}`
                // );
              }
            }
            campo.xf = valorPruebaX;

            // console.log(campo.nroSplit);
          } else {
            campo.split = false;
          }
        }

        // Arcos
        if (
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a011f') !==
          'NONE'
        ) {
          campo.gtyEnd = dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[
            dataSet.elements.x300a00b0.items[i].dataSet.elements.x300a0111.items
              .length - 1
          ].dataSet.string('x300a011e');
        }

        // Bolus
        if (
          dataSet.elements.x300a00b0.items[i].dataSet.string('x300a00ed') !==
          '0'
        ) {
          campo.bolus = true;
        }

        campo.ums = parseFloat(ums[parseInt(campo.nro)].toFixed(4));
        if (campo.tipoCampo === 'TREATMENT' || campo.tipoCampo === 'SETUP') {
          campos.push(campo);
        }
      }
      datos.campos = campos;
      // console.log(datos);
      console.log('xio');
    }
    console.log(datos);
    return datos;
  } catch (ex) {
    console.log('Error en lectura de archivo', ex);
  }
}

export default leerDicom;
