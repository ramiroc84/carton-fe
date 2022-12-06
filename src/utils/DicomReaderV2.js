const dicomParser = require('dicom-parser')

function convAng(angDicom) {
  if (angDicom >= 0 && angDicom <= 180) {
    return 180 - angDicom
  } else {
    return 540 - angDicom
  }
}

function leerDicom(dicomFileAsBuffer) {
  try {
    var dataSet = dicomParser.parseDicom(dicomFileAsBuffer)

    const datos = {}
    let nroCampos = 0

    datos.hc = dataSet.string('x00101000')
    if (typeof datos.hc === 'undefined') {
      datos.hc = '----'
    }

    datos.id = dataSet.string('x00100020')

    if (dataSet.string('x300a0003')) {
      datos.region = dataSet.string('x300a0003')
    } else {
      datos.region = dataSet.string('x300a0002')
    }

    if (dataSet.string('x00081090') !== 'XiO') {
      for (let j = 0; j < dataSet.elements.x300a0010.items.length; j += 1) {
        if (
          dataSet.elements.x300a0010.items[j].dataSet
            .string('x300a0016')
            .startsWith('PTV') &&
          dataSet.elements.x300a0010.items[j].dataSet.string('x300a0020') ===
            'TARGET'
        ) {
          datos.dosis = parseFloat(
            dataSet.elements.x300a0010.items[j].dataSet.string('x300a0026')
          )
          if (datos.dosis === 0) {
            datos.dosis = parseFloat(
              dataSet.elements.x300a0010.items[j].dataSet.string('x300a0023')
            )
          }
        }
      }
    }
    datos.fracciones = parseInt(
      dataSet.elements.x300a0070.items[0].dataSet.string('x300a0078')
    )

    nroCampos = parseInt(
      dataSet.elements.x300a0070.items[0].dataSet.string('x300a0080')
    )
    datos.camposTto = 0

    let ums = new Array(parseInt(nroCampos))

    /* ----------------------------------- UMs ---------------------------------- */
    // console.log(`ENTROOOOOOOOO`);
    for (let i = 0; i < nroCampos; i += 1) {
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
      )
    }
    /* -------------------------------------------------------------------------- */
    datos['dfp'] = ''
    const arrayDFPSU = []
    const arrayGTYSU = []
    // Parametros de campos
    let i = 0
    while (i < nroCampos) {
      const aux = {}
      let campoSU = false

      aux.tipoCampo =
        dataSet.elements.x300a00b0.items[i].dataSet.string('x300a00ce')
      if (aux.tipoCampo === 'TREATMENT' || aux.tipoCampo === 'SETUP') {
        // }
        // for (let i = 1; i < datos.nroCampos; i += 1) {

        datos[`nro_${i}`] = parseInt(
          dataSet.elements.x300a00b0.items[i].dataSet.string('x300a00c0')
        )
        datos[`entrega_${i}`] =
          dataSet.elements.x300a00b0.items[i].dataSet.string('x300a00c4')
        datos[`haz_${i}`] =
          dataSet.elements.x300a00b0.items[i].dataSet.string('x300a00c6')
        datos[`campon_${i}`] =
          dataSet.elements.x300a00b0.items[i].dataSet.string('x300a00c2')

        if (aux.tipoCampo === 'TREATMENT') datos.camposTto += 1
        datos[`e_${i}`] = parseFloat(
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a0114')
        )

        datos[`dr_${i}`] = parseInt(
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a0115')
        )

        datos[`maq_${i}`] =
          dataSet.elements.x300a00b0.items[i].dataSet.string('x300a00b2')

        let angGty = parseFloat(
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a011e')
        )
        let angCol = parseFloat(
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a0120')
        )
        //Rotacion de camilla es 360-  campo.couch
        let angCouch = parseFloat(
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a0122')
        )
        if (angGty === 0 || angGty === 90 || angGty === 270) {
          campoSU = true
        }
        if (angCouch === 0 || angCouch === 180) {
          if (angGty === 0) datos['incid_' + i] = 'ANT'
          if (angGty === 180) datos['incid_' + i] = 'POST'
          if (angGty === 90) datos['incid_' + i] = 'LI'
          if (angGty === 270) datos['incid_' + i] = 'LD'
          if (angGty > 0 && angGty < 90) datos['incid_' + i] = 'OAI'
          if (angGty > 90 && angGty < 180) datos['incid_' + i] = 'OPI'
          if (angGty > 180 && angGty < 270) datos['incid_' + i] = 'OPD'
          if (angGty > 270 && angGty < 360) datos['incid_' + i] = 'OAD'
        } else {
          datos['incid_' + i] = ''
        }
        if (
          datos[`maq_${i}`] === 'CBA2100CD' ||
          datos[`maq_${i}`] === 'CBA_6EX_774' ||
          datos[`maq_${i}`] === 'ABA_6X80_38' ||
          datos[`maq_${i}`] === 'ALA_6/100_467' ||
          datos[`maq_${i}`] === 'CLA_6EX_760' ||
          datos[`maq_${i}`] === 'CLO_6/100_437' ||
          datos[`maq_${i}`] === 'ECA_6X80_47' ||
          datos[`maq_${i}`] === 'NBA_6/100_299' ||
          datos[`maq_${i}`] === 'PBA_6EX_730' ||
          datos[`maq_${i}`] === 'VBA_6X80_46' ||
          datos[`maq_${i}`] === 'LomasCio3D' ||
          datos[`maq_${i}`] === 'LomasAceve2016' ||
          datos[`maq_${i}`] === 'Militar2X6MVv1' ||
          datos[`maq_${i}`] === 'SIA_6Ex_754'
        ) {
          datos[`gty_${i}`] = convAng(angGty)
          datos[`col_${i}`] = convAng(angCol)
          datos[`cam_${i}`] = convAng(angCouch)
        } else {
          datos[`cam_${i}`] = angCouch === 0 ? angCouch : 360 - angCouch
          datos[`gty_${i}`] = angGty
          datos[`col_${i}`] = angCol
        }
        if (campoSU) {
          arrayDFPSU.push(
            parseFloat(
              (
                parseFloat(
                  dataSet.elements.x300a00b0.items[
                    i
                  ].dataSet.elements.x300a0111.items[0].dataSet.string(
                    'x300a0130'
                  )
                ) / 10
              ).toFixed(1)
            )
          )
          arrayGTYSU.push(datos[`gty_${i}`])
          campoSU = false
        }

        // datos[`dfp_${i}`] = parseFloat(
        //   (parseFloat(dataSet.elements.x300a00b0.items[i].dataSet.elements.x300a0111.items[0].dataSet.string('x300a0130')) / 10).toFixed(1)
        // );

        /* -------------------------------- Isocentro ------------------------------- */

        // campo.iso = dataSet.elements.x300a00b0.items[
        //   i
        // ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a012c');

        /* --------------------------------- Maquina -------------------------------- */

        datos[`maq_${i}`] =
          dataSet.elements.x300a00b0.items[i].dataSet.string('x300a00b2')

        // Cuñas
        if (
          dataSet.elements.x300a00b0.items[i].dataSet.string('x300a00d0') ===
          '1'
        ) {
          datos[`cuAng_${i}`] = parseInt(
            dataSet.elements.x300a00b0.items[
              i
            ].dataSet.elements.x300a00d1.items[0].dataSet.string('x300a00d5')
          )

          datos[`cuId_${i}`] =
            dataSet.elements.x300a00b0.items[
              i
            ].dataSet.elements.x300a00d1.items[0].dataSet.string('x300a00d4')

          datos[`cuOri_${i}`] =
            dataSet.elements.x300a00b0.items[
              i
            ].dataSet.elements.x300a00d1.items[0].dataSet.string('x300a00d8')
        }
        //x300a0111 = control point sequence
        //x300a011a = Beam Limiting Device Position Sequence
        //x300a011c = Leaf/Jaw Positions

        // Electrones
        if (datos[`haz_${i}`] === 'ELECTRON') {
          datos[`cono_${i}`] =
            dataSet.elements.x300a00b0.items[
              i
            ].dataSet.elements.x300a0107.items[0].dataSet.string('x300a0108')
        }
        //Jaws
        datos[`xTipo_${i}`] =
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.elements.x300a011a.items[0].dataSet.string(
            'x300a00b8'
          )
        datos[`x_${i}`] =
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.elements.x300a011a.items[0].dataSet.string(
            'x300a011c'
          )
        datos[`yTipo_${i}`] =
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.elements.x300a011a.items[1].dataSet.string(
            'x300a00b8'
          )
        datos[`y_${i}`] =
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.elements.x300a011a.items[1].dataSet.string(
            'x300a011c'
          )
        //Split
        if (datos[`entrega_${i}`] === 'DYNAMIC') {
          const nroCtrlPoints =
            dataSet.elements.x300a00b0.items[i].dataSet.string('x300a0110')
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
            datos[`split_${i}`] = true
            datos[`nroSplit_${i}`] = 1

            let valorPruebaX = datos[`x_${i}`]
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
                valorPruebaX =
                  dataSet.elements.x300a00b0.items[
                    i
                  ].dataSet.elements.x300a0111.items[
                    j
                  ].dataSet.elements.x300a011a.items[0].dataSet.string(
                    'x300a011c'
                  )
                datos[`nroSplit_${i}`] += 1
                if (datos[`f1_${i}`]) {
                  datos[`f2_${i}`] = parseFloat(
                    dataSet.elements.x300a00b0.items[
                      i
                    ].dataSet.elements.x300a0111.items[j].dataSet.string(
                      'x300a0134'
                    )
                  )
                } else {
                  datos[`f1_${i}`] = parseFloat(
                    dataSet.elements.x300a00b0.items[
                      i
                    ].dataSet.elements.x300a0111.items[j].dataSet.string(
                      'x300a0134'
                    )
                  )
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
            datos[`xf_${i}`] = valorPruebaX

            // console.log(campo.nroSplit);
          } else {
            datos[`split_${i}`] = false
          }
        }

        // Arcos
        if (
          dataSet.elements.x300a00b0.items[
            i
          ].dataSet.elements.x300a0111.items[0].dataSet.string('x300a011f') !==
          'NONE'
        ) {
          datos[`gtyfinal_${i}`] =
            dataSet.elements.x300a00b0.items[
              i
            ].dataSet.elements.x300a0111.items[
              dataSet.elements.x300a00b0.items[i].dataSet.elements.x300a0111
                .items.length - 1
            ].dataSet.string('x300a011e')
          datos['incid_' + i] = 'ARCO'
        }

        // Bolus
        if (
          dataSet.elements.x300a00b0.items[i].dataSet.string('x300a00ed') !==
          '0'
        ) {
          datos[`bolus_${i}`] = true
        }

        datos[`ums_${i}`] = parseFloat(
          ums[parseInt(datos[`nro_${i}`])].toFixed(4)
        )
        // if (campo.tipoCampo === 'TREATMENT' || campo.tipoCampo === 'SETUP') {
        //   // campos.push(campo);
      }
      i += 1
    }

    const gtyAnt = []
    for (let k = 0; k < arrayGTYSU.length; k += 1) {
      if (!gtyAnt.includes(arrayGTYSU[k])) {
        gtyAnt.push(arrayGTYSU[k])
        datos['dfp'] += ` ${arrayDFPSU[k]}(${arrayGTYSU[k]})`
      }
    }
    /* ----------------------------- Inmovilizacion ----------------------------- */
    for (let k = 0; k < dataSet.elements.x300a0180.items.length; k += 1) {
      const aux =
        dataSet.elements.x300a0180.items[k].dataSet.string('x300a01b2')
      if (typeof aux != 'undefined') {
        const posic = aux.replace('\n', '')
        // console.log(posic.split('//'));
        datos.pos = posic.split('//')[0]
        datos.elemfij = posic.split('//')[1]
      }
    }
    // console.log('DICOM READER', datos);
    return datos
  } catch (ex) {
    console.log('Error en lectura de archivo', ex)
  }
}

export default leerDicom
