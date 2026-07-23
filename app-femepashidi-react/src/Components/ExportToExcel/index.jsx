import * as XLSX from "xlsx";
import {formatoNombre} from './../../Functions/funciones'

const ExportToExcel = ({ data, fileName }) => {

  console.log('[DATA TO EXCEL]',data)
  const exportToExcel = () => {
    // Define los encabezados de la hoja de cálculo
    const headers = ["Competencia", "Asociación", "Nombre", "Nivel", "Categoría", "Género","Estatus solicitud"];
    
    // Mapea el array de objetos para obtener los datos en el orden de los encabezados
    const worksheetData = data.filter(reg => reg.content.status != 'rechazado').map(item => [
      item.content.event.nombre,
      item.content.association.abreviacion,
      `${formatoNombre(item.content.user.nombre)} ${item.content.user.apellido_paterno.toUpperCase()} ${item.content.user.apellido_materno.toUpperCase()}`,
      item.content.nivel_actual,
      item.content.categoria,
      item.content.user.sexo,
      item.content.status
    ]);

    console.log(worksheetData)

    
    // Agrega los encabezados al inicio de los datos
    worksheetData.unshift(headers);

    // Crea una hoja de trabajo a partir de los datos
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Crea un libro de trabajo y agrega la hoja de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    // Exporta el libro de trabajo a un archivo Excel
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <button onClick={exportToExcel} className="bg-green-500 w-1/4 rounded-md shadow-lg border-2 border-green-700 text-green-200">
    Exportar a Excel
  </button>
  
  );
};

export default ExportToExcel;

const data=[
  ['XXII HIELOJUEGOS NACIONALES 2024', 'EMEX', 'Sofía CABRERA GONZÁLEZ', 'Avanzados 1', 'MAYOR', 'FEMENINO', 'aprobado'],
 ['XXII HIELOJUEGOS NACIONALES 2024', 'TAB', 'Luciana María  VALDEZ MEDINA ', 'Debutantes 1', 'PRE-INFANTIL B', 'FEMENINO', 'aprobado'],
 ['XXII HIELOJUEGOS NACIONALES 2024', 'EMEX', 'Priyanka  SHARMA .', 'Avanzados 2', 'JUVENIL C', 'FEMENINO', 'otro'],
]
console.log(data.filter(item=>item[6] === 'aprobado'))
