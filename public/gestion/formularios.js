/**
 * FORMULARIO DE NUEVO PATINADOR
 */
const formNewUser = `

<datalist id="list_nivel">
  <option value="Debutantes 1">Debutantes 1</option>
  <option value="Debutantes 2">Debutantes 2</option>
  <option value="Pre-Básicos">Pre-Básicos</option>
  <option value="Básicos">Básicos</option>
  <option value="Pre-preliminar">Pre-preliminar</option>
  <option value="Preliminar">Preliminar</option>
  <option value="Intermedios 1">Intermedios 1</option>
  <option value="Intermedios 2">Intermedios 2</option>
  <option value="Novicios">Novicios</option>
  <option value="Avanzados 1">Avanzados 1</option>
  <option value="Avanzados 2">Avanzados 2</option>
  <option value="Adulto Bronce">Adulto Bronce</option>
  <option value="Adulto Plata">Adulto Plata</option>
  <option value="Adulto Oro">Adulto Oro</option>
  <option value="Adulto Master">Adulto Master</option>
  <option value="Adulto Master Elite">Adulto Master Elite</option>
  <option value="ADULTO PAREJAS">ADULTO PAREJAS</option>
  <option value="ADULTO PAREJAS INTERMEDIATE">ADULTO PAREJAS INTERMEDIATE</option>
  <option value="ADULTO PAREJAS MASTER">ADULTO PAREJAS MASTER</option>
  <option value="ADULTO PAREJAS MASTER ELITE">ADULTO PAREJAS MASTER ELITE</option>
</datalist>
<datalist id="list_asoc">

</datalist>
<form id="form_nuevo">
<section class="card container-form">
  <h3>Datos del deportista</h3>
    <div class="flex-container-input">
      <label for="curp">
        CURP
        <input type="text" name="curp" class="envioDb" id="curp">
      </label>
    </div>

    <div class="">
      <div class="flex-container-input">
        <label for="nombre"> Nombre
          <input type="text" name="nombre" class="envioDb">
        </label>
        <label for="apellido_paterno"> Apellido paterno
          <input type="text" name="apellido_paterno" class="envioDb">
        </label><label for="apellido_materno"> Apellido materno
          <input type="text" name="apellido_materno" class="envioDb">
        </label>
      </div>
      <div class="flex-container-input">
        <label for="fecha_nacimiento"> Fecha de nacimiento
          <input type="date" name="fecha_nacimiento" class="envioDb">
        </label>
        <label for="lugar_nacimiento"> Lugar de Nacimiento
          <input type="text" name="lugar_nacimiento" class="envioDb">
        </label>
        <label for="sexo"> Sexo
          <select name="sexo" class="envioDb">
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="">--Selecciona--</option selected>
          </select>
        </label>
      </div>
      <div class="flex-container-input">
        <label for="correo"> Correo de contacto
          <input type="text" name="correo" class="envioDb">
        </label>
        <label for="telefono"> Teléfono/whatsapp
          <input type="text" name="telefono" class="envioDb">
        </label>
      </div>
    </div>
    <div class="flex-container-input">
      <label for="nivel_actual"> Nivel Actual
        <input list="list_nivel" name="nivel_actual" class="envioDb">
      </label>
    </div>
    <div class="flex-container-input">
      <label for="asociacion"> Asociacion a la que pertenece
      <select id="asociacion" name="id_asociacion" class="envioDb">
      </select>
      </label>
    </div>
    <figure class="img-update">
      <div>
        <label for="file_input" id="nombre_archivo">Haz click aqui para subir una foto
          <input type="file" style="display:none" id="file_input" name="archivo" class="envioDb fotoNueva">
          <img src="./user.png" class="img-user" id="img_user">
        </label>
      </div>
    </figure>

    <button id="guardar" type="button">Guardar</button>
</section>
</form>

`;

const formNewAssociation = `
<form id="form_nuevo">

<section class="card container-form">
<h3>Datos de la asociación</h3>

  <div class="flex-container-input">
    <label for="nombre">
      Nombre
      <input type="text" id="nombre" name="nombre" class="envioDb">
    </label>
  </div>
  <div class="flex-container-input">
    <label for="representante">
      Representante
      <input type="text" id="representante"  name="representante" class="envioDb">
    </label>
  </div>
  <div class="flex-container-input">
    <label for="correo">
      Correo
      <input type="text" id="correo" name="correo" class="envioDb">
    </label>
  </div>
  <div class="flex-container-input">
    <label for="correo">
      Abreviación
      <input type="text" id="abreviacion" name="abreviacion" class="envioDb">
    </label>
  </div>
  <div class="flex-container-input">
    <label for="status">
      Status
      <select name="status" id="status" name="status" class="envioDb">
        <option value="Activo">Activo</option>
        <option value="Baja">Baja</option>
      </select>
    </label>
  </div>
  <button id="guardar" type="button">Guardar</button>
</section>
</form>
`;

const formNewEvent = `
<form id="form_nuevo">
<section class="card container-form">
      <h3>Datos de la competencia</h3>

        <div class="flex-container-input">
          <label for="nombre">
            Nombre
            <input type="text" id="nombre" name="nombre"class="envioDb">
          </label>
        </div>
        <div class="flex-container-input">
          <label for="lugar">
            Lugar
            <input type="text" name="lugar" class="envioDb">
          </label>
        </div>
        <div class="flex-container-input">
          <label for="fecha_inicio">
            Fecha de inicio
            <input type="date" name="fecha_inicio" class="envioDb">
          </label>
        </div>
        <div class="flex-container-input">
          <label for="fecha_fin">
            Fecha de termino
            <input type="date" name="fecha_fin" class="envioDb">
          </label>
        </div>
        <div class="flex-container-input">
          <label for="texto">
            Descripción
            <input type="text" name="texto" class="envioDb">
          </label>
        </div>
        <div class="flex-container-input">
          <label for="status">
            Tipo de competencia
            <select name="tipo_competencia" id="tipo_competencia" class="envioDb">
              <option value="Nacional">Nacional</option>
              <option value="Internacional">Internacional</option>
            </select>
          </label>
        </div>
        <div class="flex-container-input">
          <label for="status">
            Status
            <select name="status" id="status" class="envioDb">
              <option value="Activo">Activo</option>
              <option value="Baja">Baja</option>
            </select>
          </label>
        </div>
        <button id="guardar" type="button">Guardar</button>
    </section>
  </form>
`;

const formNewCommunication = `
<form id="form_nuevo" enctype="multipart/form-data">
<section class="card container-form">
<h3>Datos del comunicado</h3>

  <div class="flex-container-input">
    <label for="titulo">
      Titulo
      <input type="text" name="titulo" class="envioDb">
    </label>
  </div>
<h3>Descripcion del comunicado</h3>
  <div class="flex-container-input">
    <label for="texto1">
      Texto 1
      <input type="text" name="texto1" class="envioDb"></textarea>
    </label>
  </div>
  <div class="flex-container-input">
    <label for="texto2">
      Texto 2
      <input type="text" name="texto2" class="envioDb"></textarea>
    </label>
  </div>
  <div class="flex-container-input">
    <label for="texto3">
      Texto 3
      <input type="text" name="texto3" class="envioDb"></textarea>
    </label>
  </div>
  <div class="flex-container-input">
    <label for="texto4">
      Texto 4
      <input type="text" name="texto4" class="envioDb"></textarea>
    </label>
  </div>
  <div class="flex-container-input">
    <label for="texto5">
      Texto 5
      <input type="text" name="texto5" class="envioDb"></textarea>
    </label>
  </div>
  <div class="flex-container-input">
    <label for="documento">
      Documento de comunicado
      <input type="file" name="documento" id="documento" class="envioDb"></textarea>
    </label>
  </div>
  <div class="flex-container-input">
  <figure class="img-update">
  <div>
    <label for="file_input" id="nombre_archivo">Haz click aqui para subir una foto
      <input type="file" style="display:none" id="file_input" name="file_input" class="envioDb fotoNueva">
      <img src="./user.png" class="img-user" id="img_user">
    </label>
  </div>
</figure>
  </div>
  <div class="flex-container-input">
    <label for="status">
      Status
      <select name="status" id="status" class="envioDb">
        <option value="Activo">Activo</option>
        <option value="Baja">Baja</option>
      </select>
    </label>
  </div>
  <button id="guardar" type="button">Guardar</button>
</section>
</form>
`;

const formNewGallery = `
<form id="form_nuevo" enctype="multipart/form-data">
<section class="card container-form">
<h3>Nueva galería</h3>
<p>Al guardar, esto reemplaza por completo la galería y las fotos que estén publicadas actualmente en la página.</p>

  <div class="flex-container-input">
    <label for="titulo">
      Titulo
      <input type="text" name="titulo" class="envioDb">
    </label>
  </div>
  <div class="flex-container-input">
    <label for="fotos_input">
      Fotos (puedes seleccionar varias)
      <input type="file" id="fotos_input" name="fotos" class="envioDb" multiple accept="image/*">
    </label>
  </div>
  <div class="flex-container-input">
    <div class="gallery-preview" id="galeria_preview"></div>
  </div>
  <button id="guardar" type="button">Guardar</button>
</section>
</form>
`;

const titulos ={
  'users':`Atleta`,
  'register':`Solicitud`
}
