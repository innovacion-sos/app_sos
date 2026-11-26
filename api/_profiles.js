// Perfiles de ejemplo. En producción: mover a una base de datos cifrada.
// Los teléfonos deben ir en formato internacional (+52...).
module.exports = {
  "7F3A-92C1": {
    name: "María Ramírez Torres", age: 34, role: "Ciclista", city: "Guadalajara, Jal.",
    blood: "O+",
    allergies: ["Penicilina", "Látex", "Ibuprofeno"],
    conditions: ["Asma moderada", "Hipotiroidismo"],
    meds: ["Salbutamol inhalado", "Levotiroxina 50 mcg"],
    insurance: { name: "Seguro GNP", policy: "••••4821" },
    contacts: [
      { name: "Luis Torres", rel: "Padre", phone: "+523300000001" },
      { name: "Ana Ramírez", rel: "Hermana", phone: "+523300000002" }
    ]
  }
};
