const listadoNiveles = [
  "DEBUTANTES 1", "DEBUTANTES 1 ARTISTICO", "DEBUTANTES 1 ESPECIAL", "DEBUTANTES 2",
  "DEBUTANTES 2 ARTISTICO", "DEBUTANTES 2 ESPECIAL", "PRE-BÁSICOS", "PRE-BÁSICOS ARTISTICO",
  "PRE-BÁSICOS ESPECIAL", "BÁSICOS", "BÁSICOS ESPECIAL", "BÁSICOS ARTISTICO",
  "PRE-PRELIMINAR", "PRE-PRELIMINAR ESPECIAL", "PRELIMINAR", "INTERMEDIOS 1",
  "INTERMEDIOS 2", "NOVICIOS", "AVANZADOS 1", "AVANZADOS 2",
  "ADULTO BRONCE ARTISTICO", "ADULTO PLATA ARTISTICO", "ADULTO ORO ARTISTICO",
  "ADULTO MASTER ARTISTICO", "ADULTO MASTER ELITE ARTISTICO", "ADULTO PAREJAS ARTISTICO",
  "ADULTO PAREJAS INTERMEDIATE ARTISTICO", "ADULTO PAREJAS MASTER ARTISTICO",
  "ADULTO PAREJAS MASTER ELITE ARTISTICO"
];

const competitionLevels = {
    "Open Internacional": [
      "Debutantes 1", "Debutantes 1 Especial", "Debutantes 2", "Debutantes 2 Especial",
      "Pre-Basicos", "Pre-Basicos Especial", "Básicos", "Básicos Especial",
      "Open Pre-Preliminary", "Open Pre-Preliminary Special", "Open Preliminary",
      "Open Juvenile", "Open Intermediate", "Bronze", "Bronze Special", "Silver",
      "Gold", "Master", "Master Elite", "Bronze Artistic", "Bronze Special Artistic",
      "Silver Artistic", "Gold Artistic", "Master Artistic", "Master Elite Artistic"
    ],
    "⁠Internacional ISU": ["Advaced Novice", "Junior", "Senior"],
    "Nacional": [
      "Debutantes 1", "Debutantes 1 Artistico", "Debutantes 1 Especial", "Debutantes 2",
      "Debutantes 2 Artistico", "Debutantes 2 Especial", "Pre-Básicos", "Pre-Básicos Artistico",
      "Pre-Básicos Especial", "Básicos", "Básicos Especial", "Básicos Artistico",
      "Pre-preliminar", "Pre-preliminar Especial", "Preliminar", "Intermedios 1",
      "Intermedios 2", "Novicios", "Avanzados 1", "Avanzados 2",
      "Adulto Bronce Artistico", "Adulto Plata Artistico", "Adulto Oro Artistico",
      "Adulto Master Artistico", "Adulto Master Elite Artistico", 

      "Adulto Bronce", "Adulto Plata", "Adulto Oro",
      "Adulto Master", "Adulto Master Elite",
      
      "ADULTO PAREJAS Artistico",
      "ADULTO PAREJAS INTERMEDIATE Artistico", "ADULTO PAREJAS MASTER Artistico",
      "ADULTO PAREJAS MASTER ELITE Artistico"
    ],
  }
const categoriesByCompetition = {
    "Open Internacional": ["A","B","C","D","MAYOR","ADULTO","CLASS I", "CLASS II", "CLASS III", "CLASS IV", "CLASS V"],
    "⁠Internacional ISU": [],
    "Nacional": ["PRE-INFANTIL A",
    "PRE-INFANTIL B",
    "INFANTIL A",
    "INFANTIL B",
    "INFANTIL C",
    "JUVENIL A",
    "JUVENIL B",
    "JUVENIL C",
    "MAYOR",
    "CLASE I",
    "CLASE II",
    "CALSE III",
    "CLASE IV",
    "CLASE V"
]
}

export {listadoNiveles, competitionLevels,categoriesByCompetition}