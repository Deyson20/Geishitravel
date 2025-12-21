// Controlar visibilidad de la fecha de regreso
function toggleRegreso(show) {
    const cajaRegreso = document.getElementById("caja-regreso");
    const inputRegreso = document.getElementById("fecha-regreso");
    
    if (show) {
        cajaRegreso.style.opacity = "1";
        cajaRegreso.style.pointerEvents = "auto";
        inputRegreso.required = true;
    } else {
        cajaRegreso.style.opacity = "0.3";
        cajaRegreso.style.pointerEvents = "none";
        inputRegreso.required = false;
        inputRegreso.value = "";
    }
}

// Configuración inicial de fechas
document.addEventListener('DOMContentLoaded', () => {
    const hoy = new Date().toISOString().split('T')[0];
    const fechaIda = document.getElementById('fecha-ida');
    const fechaRegreso = document.getElementById('fecha-regreso');

    fechaIda.setAttribute('min', hoy);
    fechaRegreso.setAttribute('min', hoy);

    fechaIda.addEventListener('change', () => {
        fechaRegreso.setAttribute('min', fechaIda.value);
    });
});