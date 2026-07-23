import { useState } from "react";
import axios from "axios";
import { server } from "../../db/server";

const FileUploader = () => {
  const [folder, setFolder] = useState("");
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  const handleFolderChange = (e) => {
    setFolder(e.target.value);
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!folder || files.length === 0) {
      setMessage("Por favor proporciona el nombre de la carpeta y selecciona archivos.");
      return;
    }

    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file); // Nombre de campo puede ser cualquier nombre, ya que usamos `.any()`
    }

    try {
      const response = await axios.post(`${server}upload-files/${folder}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(`✅ Archivos subidos correctamente: ${response.data.files.length} archivos.`);
    } catch (error) {
      setMessage("❌ Error al subir archivos.");
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "1rem", fontFamily: "Arial" }}>
      <h2>Cargar Archivos</h2>
      <div style={{ marginBottom: "1rem" }}>
        <label>Nombre del folder: </label>
        <input
          type="text"
          value={folder}
          onChange={handleFolderChange}
          placeholder="ej: facturas-julio"
          style={{ width: "100%", padding: "0.5rem" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Selecciona archivos: </label>
        <input type="file" multiple onChange={handleFileChange} />
      </div>

      <button onClick={handleUpload} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
        Subir
      </button>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
};

export default FileUploader;
