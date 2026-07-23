{isNational && (
    <Row>
    <Col md={4}>
        <FormGroup>
            <Label for="nivel_actual" >Nivel actual </Label>
            {isAdult && (
                <Input type="select" name="nivel_actual" id="nivel_actual" placeholder="" onChange={handleChange} className={`${formError.nivel_actual === 'empty' ? 'border-red-600' : ''} `}  >
                <option value="">--Selecciona un NIVEL--</option>
                <option value="Adulto Bronce">Adulto Bronce</option>
                <option value="Adulto Bronce Artistico">Adulto Bronce Artistico</option>
                <option value="Adulto Plata">Adulto Plata</option>
                <option value="Adulto Plata Artistico">Adulto Plata Artistico</option>
                <option value="Adulto Oro">Adulto Oro</option>
                <option value="Adulto Oro Artistico">Adulto Oro Artistico</option>
                <option value="Adulto Master">Adulto Master</option>
                <option value="Adulto Master Artistico">Adulto Master Artistico</option>
                <option value="Adulto Master Elite">Adulto Master Elite</option>
                <option value="Adulto Master Elite Artistico">Adulto Master Elite Artistico</option>
                <option value="ADULTO PAREJAS">ADULTO PAREJAS</option>
                <option value="ADULTO PAREJAS Artistico">ADULTO PAREJAS Artistico</option>
                <option value="ADULTO PAREJAS INTERMEDIATE">ADULTO PAREJAS INTERMEDIATE</option>
                <option value="ADULTO PAREJAS INTERMEDIATE Artistico">ADULTO PAREJAS INTERMEDIATE Artistico</option>
                <option value="ADULTO PAREJAS MASTER">ADULTO PAREJAS MASTER</option>
                <option value="ADULTO PAREJAS MASTER Artistico">ADULTO PAREJAS MASTER Artistico</option>
                
                </Input>
                
                
            )}

            {!isAdult && (
                <Input type="text" name="nivel_actual" id="nivel_actual" placeholder="" onChange={handleChange} className={`${formError.nivel_actual === 'empty' ? 'border-red-600' : ''} `} value={formData.nivel_actual} disabled={isRegister} />
            )}
               
            {/* <option value="Debutantes 1">Debutantes 1</option>
            <option value="Debutantes 1 Artistico">Debutantes 1 Artistico</option>
            <option value="Debutantes 1 Especial">Debutantes 1 Especial</option>
            <option value="Debutantes 2">Debutantes 2</option>
            <option value="Debutantes 2 Artistico">Debutantes 2 Artistico</option>
            <option value="Debutantes 2 Especial">Debutantes 2 Especial</option>
            <option value="Pre-Básicos">Pre-Básicos</option>
            <option value="Pre-Básicos Artistico">Pre-Básicos Artistico</option>
            <option value="Pre-Básicos Especial">Pre-Básicos Especial</option>
            <option value="Básicos">Básicos</option>
            <option value="Básicos Especial">Básicos Especial</option>
            <option value="Básicos Artistico">Básicos Artistico</option>
            <option value="Pre-preliminar">Pre-preliminar</option>
            <option value="Pre-preliminar Especial">Pre-preliminar Especial</option>
            <option value="Preliminar">Preliminar</option>
            <option value="Intermedios 1">Intermedios 1</option>
            <option value="Intermedios 2">Intermedios 2</option>
            <option value="Novicios">Novicios</option>
            <option value="Avanzados 1">Avanzados 1</option>
            <option value="Avanzados 2">Avanzados 2</option>
            <option value="Adulto Bronce Artistico">Adulto Bronce Artistico</option>
            <option value="Adulto Plata Artistico">Adulto Plata Artistico</option>
            <option value="Adulto Oro Artistico">Adulto Oro Artistico</option>
            <option value="Adulto Master Artistico">Adulto Master Artistico</option>
            <option value="Adulto Master Elite Artistico">Adulto Master Elite Artistico</option>
            <option value="ADULTO PAREJAS Artistico">ADULTO PAREJAS Artistico</option>
            <option value="ADULTO PAREJAS INTERMEDIATE Artistico">ADULTO PAREJAS INTERMEDIATE Artistico</option>
            <option value="ADULTO PAREJAS MASTER Artistico">ADULTO PAREJAS MASTER Artistico</option>
            <option value="ADULTO PAREJAS MASTER ELITE Artistico">ADULTO PAREJAS MASTER ELITE Artistico</option> */}
                
           
        </FormGroup>
    </Col>
    <Col md={4}>
        <FormGroup>

            <Label for="categoria" >Categoria</Label>
            {isAdult && (
                <Input type="select" name="categoria" id="categoria" placeholder="" onChange={handleChange} className={`${formError.categoria === 'empty' ? 'border-red-600' : ''} `} >
                <option value="">--Selecciona una categoria--</option>
                <option value="CLASS I">CLASS I(NACIDOS ENTRE EL 1 DE JULIO DE1985 Y 30 DE JUNIO DE 1995)</option>
                <option value="CLASS II">CLASS II(NACIDOS ENTRE EL 1 DE JULIO DE1975 Y 30 DE JUNIO DE 1985)</option>
                <option value="CALSS III">CLASS III(NACIDOS ENTRE EL 1 DE JULIO DE1965 Y 30 DE JUNIO DE 1975)</option>
                <option value="CLASS IV">CLASS IV(NACIDOS ENTRE EL 1 DE JULIO DE1955 Y 30 DE JUNIO DE 1965)</option>
                <option value="CLASS V">CLASS V(NACIDOS ANTES DEL 30 DE JUNIO DE 1965)</option>
                </Input>
            )}


            {!isAdult && (
                <Input type="text" name="categoria" id="categoria" placeholder="" onChange={handleChange} className={`${formError.categoria === 'empty' ? 'border-red-600' : ''} `} value={formData.categoria} disabled={isRegister}      
            />
            )}
            
            {/* <option value="">--Selecciona una categoria--</option>
            <option value="PRE-INFANTIL A">PRE-INFANTIL A</option>
            <option value="PRE-INFANTIL B">PRE-INFANTIL B</option>
            <option value="INFANTIL A">INFANTIL A</option>
            <option value="INFANTIL B">INFANTIL B</option>
            <option value="INFANTIL C">INFANTIL C</option>
            <option value="JUVENIL A">JUVENIL A</option>
            <option value="JUVENIL B">JUVENIL B</option>
            <option value="JUVENIL C">JUVENIL C</option>
            <option value="MAYOR">MAYOR </option>
            <option value="CLASE I">CLASE I</option>
            <option value="CLASE II">CLASE II</option>
            <option value="CALSE III">CLASE III</option>
            <option value="CLASE IV">CLASE IV</option>
            <option value="CLASE V">CLASE V</option> */}
            
           
           
        </FormGroup>
    </Col>       
</Row>)}

{isInternational && (
    <Row>
    <Col md={4}>
        <FormGroup>
            <Label for="nivel_actual" >Nivel actual </Label>
            {isAdult && (
                <Input type="select" name="nivel_actual" id="nivel_actual" placeholder="" onChange={handleChange} className={`${formError.nivel_actual === 'empty' ? 'border-red-600' : ''} `}  >
                <option value="">--Selecciona un NIVEL--</option>
                <option value="BRONZE ARTISTIC">BRONZE ARTISTIC</option>
                <option value="SILVER">SILVER</option>
                <option value="SILVER ARTISTIC">SILVER ARTISTIC</option>
                <option value="GOLD">GOLD</option>
                <option value="GOLD ARTISTIC">GOLD ARTISTIC</option>
                <option value="MASTER">MASTER</option>
                <option value="MASTER ARTISTIC">MASTER ARTISTIC</option>
                <option value="MASTER ELITE">MASTER ELITE</option>
                <option value="MASTER ELITE ARTISTIC">MASTER ELITE ARTISTIC</option>
                <option value="ADULT PAIRS">ADULT PAIRS</option>
                <option value="ADULT PAIRS ARTISTIC">ADULT PAIRS ARTISTIC</option>
                <option value="INTERMEDIATE PAIRS">INTERMEDIATE PAIRS</option>
                <option value="INTERMEDIATE PAIRS ARTISTIC">INTERMEDIATE PAIRS ARTISTIC</option>
                <option value="MASTER PAIRS">MASTER PAIRS</option>
                <option value="MASTER PAIRS ARTISTIC">MASTER PAIRS ARTISTIC</option>
                </Input>
                
                
            )}

            {!isAdult && (
                <Input type="select" name="nivel_actual" id="nivel_actual" placeholder="" onChange={handleChange} className={`${formError.nivel_actual === 'empty' ? 'border-red-600' : ''} `}  >
                <option value="">--Selecciona un NIVEL--</option>
                <option value="DEBUTANTES 1">DEBUTANTES 1</option>
                <option value="DEBUTANTES 1 ESPECIAL">DEBUTANTES 1 ESPECIAL</option>
                <option value="DEBUTANTES 2">DEBUTANTES 2</option>
                <option value="DEBUTANTES 2 ESPECIAL">DEBUTANTES 2 ESPECIAL</option>
                <option value="PRE-BASICOS">PRE-BASICOS</option>
                <option value="PRE-BASICOS ESPECIAL">PRE-BASICOS ESPECIAL</option>
                <option value="NO-TEST">NO-TEST</option>
                <option value="NO-TEST ESPECIAL">NO-TEST ESPECIAL</option>
                <option value="PRE-PRELIMINARY">PRE-PRELIMINARY</option>
                <option value="PRELIMINARY">PRELIMINARY</option>
                <option value="JUVENILE">JUVENILE</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED NOVICE">ADVANCED NOVICE</option>
                <option value="JUNIOR">JUNIOR</option>
                <option value="SENIOR">SENIOR</option>
                
                </Input>
            )}
               
          
                
           
        </FormGroup>
    </Col>
    <Col md={4}>
        <FormGroup>

            <Label for="categoria" >Categoria</Label>
            {isAdult && (
                <Input type="select" name="categoria" id="categoria" placeholder="" onChange={handleChange} className={`${formError.categoria === 'empty' ? 'border-red-600' : ''} `} >
                <option value="">--Selecciona una categoria--</option>
                <option value="CLASS I">CLASS I(NACIDOS ENTRE EL 1 DE JULIO DE1985 Y 30 DE JUNIO DE 1995)</option>
                <option value="CLASS II">CLASS II(NACIDOS ENTRE EL 1 DE JULIO DE1975 Y 30 DE JUNIO DE 1985)</option>
                <option value="CALSS III">CLASS III(NACIDOS ENTRE EL 1 DE JULIO DE1965 Y 30 DE JUNIO DE 1975)</option>
                <option value="CLASS IV">CLASS IV(NACIDOS ENTRE EL 1 DE JULIO DE1955 Y 30 DE JUNIO DE 1965)</option>
                <option value="CLASS V">CLASS V(NACIDOS ANTES DEL 30 DE JUNIO DE 1965)</option>

                
                </Input>
            )}


            {!isAdult && (
                <Input type="select" name="categoria" id="categoria" placeholder="" onChange={handleChange} className={`${formError.categoria === 'empty' ? 'border-red-600' : ''} `} >
                <option value="A">A (5 AÑOS O MENOS)</option>
                    <option value="B">B (6 A 9 AÑOS)</option>
                    <option value="C">C (10 A 14 AÑOS)</option>
                    <option value="D">D (15 A 19 AÑOS)</option>
                    <option value="MAYOR">MAYOR (20 A 27 AÑOS)</option>
                    <option value="ADULTO">ADULTO(28 AÑOS O MAS)</option>
                    <option value="NOT APPLY">NOT APPLY</option>

                
                </Input>
            )}

        </FormGroup>
    </Col>       
</Row>)}
