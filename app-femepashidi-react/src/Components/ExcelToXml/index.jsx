import { useState } from "react";
import * as XLSX from "xlsx";
import GenerateXml from "../GenerateXml";

export default function ExceltToXml(){
    const [data, setData] = useState([]);
    const [dataStatus,setDataStatus] = useState(false)

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
    
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
    
        // Obtener el valor de C1
        const codigoValor = sheet["C1"] ? sheet["C1"].v : "Competencia";
    
        // Leer los datos de la hoja, comenzando desde la fila 2 (encabezados)
        const range = XLSX.utils.decode_range(sheet['!ref']);
        range.s.r = 1; // Comenzar desde la fila 2 (índice 1)
        sheet['!ref'] = XLSX.utils.encode_range(range);
    
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
        // Verifica que haya datos y que al menos tenga una fila de encabezados
        if (parsedData.length < 2) {
          console.error("El archivo Excel no tiene suficientes filas.");
          return;
        }
    
        // Extraer los encabezados (fila 2)
        const headers = parsedData[0];
    
        // Convertir las filas en objetos usando los encabezados
        const formattedData = parsedData.slice(1).map((row, index) => {
          // Crear un objeto con las claves basadas en los encabezados
          const rowData = {};
          console.log('encabezados')
          headers.forEach((key, i) => {
            rowData[key] = row[i] || ""; 
          
            console.log(key)
            // Si la celda está vacía, asigna un string vacío
          });
    
          // Manejo de fechas
          let fechaNacimiento = rowData["Fecha_Nacimiento"];
          if (fechaNacimiento && !isNaN(fechaNacimiento)) {
            // Convertir fecha de número de Excel a formato YYYY-MM-DD
            const excelEpoch = new Date(1899, 11, 30);
            fechaNacimiento = new Date(excelEpoch.getTime() + fechaNacimiento * 86400000)
              .toISOString()
              .split("T")[0];
          }
    
          return {
            count: index + 1,
            content: {
              user: {
                nombre: rowData["Nombre"]?.trim() || "",
                apellido_paterno: rowData["Apellido_Paterno"]?.trim() || "",
                apellido_materno: rowData["Apellido_Materno"]?.trim() || "",
                sexo: rowData["Sexo"]?.trim() || "",
                fecha_nacimiento: fechaNacimiento || "Fecha inválida",
              },
              association: {
                abreviacion: rowData["Asociacion"]?.trim() || "",
              },
              nivel_actual: rowData["Nivel"]?.trim() || "",
              categoria: rowData["Categoria"]?.trim() || "",
            },
            data: ["", ``, "", "", "aprobado"],
            codigoCompetencia: codigoValor
          };

        });
        console.log(formattedData);
        setData(formattedData);
        setDataStatus(true);
      };
    
      reader.readAsBinaryString(file);
    };
    
    return (
      <div>
        <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        {dataStatus && (
            <>
            <GenerateXml data={data} />

            </>
        )}

      </div>

    );


}


