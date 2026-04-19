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

function buildChildAges(roomCard, childCount) {
    const childAgesContainer = roomCard.querySelector('.child-ages');
    childAgesContainer.innerHTML = '';

    for (let i = 1; i <= childCount; i++) {
        const label = document.createElement('label');
        label.innerHTML = `
            Edad niño ${i}
            <select name="${roomCard.dataset.room}-nino-${i}-edad" required>
              ${Array.from({ length: 18 }, (_, age) => `<option value="${age}">${age} ${age === 1 ? 'año' : 'años'}</option>`).join('')}
            </select>
        `;
        childAgesContainer.appendChild(label);
    }
}

function updateRoomChildrenOptions(roomCard) {
    const adultSelect = roomCard.querySelector('.adultos-select');
    const childSelect = roomCard.querySelector('.ninos-select');
    const adultCount = Number(adultSelect.value);
    const maxChildren = Math.max(0, 9 - adultCount);
    const currentChildren = Number(childSelect.value);

    childSelect.innerHTML = Array.from({ length: maxChildren + 1 }, (_, index) => `
        <option value="${index}">${index} ${index === 1 ? 'niño' : 'niños'}</option>
    `).join('');

    const selectedChildren = Math.min(currentChildren, maxChildren);
    childSelect.value = selectedChildren;
    buildChildAges(roomCard, selectedChildren);
}

function initializeRoomCard(roomCard) {
    const adultSelect = roomCard.querySelector('.adultos-select');
    const childSelect = roomCard.querySelector('.ninos-select');
    if (!adultSelect || !childSelect) return;

    adultSelect.addEventListener('change', () => updateRoomChildrenOptions(roomCard));
    childSelect.addEventListener('change', () => buildChildAges(roomCard, Number(childSelect.value)));
    updateRoomChildrenOptions(roomCard);
}

function createRoomCard(index) {
    const roomCard = document.createElement('div');
    roomCard.className = 'room-card';
    roomCard.dataset.room = index;
    roomCard.innerHTML = `
        <h4>Habitación ${index}</h4>
        <div class="form-row">
          <label>
            Adultos
            <select class="adultos-select" name="habitacion-${index}-adultos" required>
              ${Array.from({ length: 9 }, (_, i) => `<option value="${i + 1}">${i + 1} adulto${i === 0 ? '' : 's'}</option>`).join('')}
            </select>
          </label>
          <label>
            Niños
            <select class="ninos-select" name="habitacion-${index}-ninos" required>
              ${Array.from({ length: 9 }, (_, i) => `<option value="${i}">${i} ${i === 1 ? 'niño' : 'niños'}</option>`).join('')}
            </select>
          </label>
        </div>
        <div class="child-ages"></div>
    `;

    initializeRoomCard(roomCard);
    return roomCard;
}

function refreshRoomControls(container, btnAdd, btnRemove) {
    const count = container.children.length;
    btnRemove.disabled = count <= 1;
    btnAdd.disabled = count >= 5;
}

function addHabitacion(container, btnAdd, btnRemove) {
    const count = container.children.length;
    if (count >= 5) return;
    const nextIndex = count + 1;
    container.appendChild(createRoomCard(nextIndex));
    refreshRoomControls(container, btnAdd, btnRemove);
}

function removeHabitacion(container, btnAdd, btnRemove) {
    const count = container.children.length;
    if (count <= 1) return;
    container.removeChild(container.lastElementChild);
    refreshRoomControls(container, btnAdd, btnRemove);
}

function buildAdultEdges(container, adultCount) {
    container.innerHTML = '';
    for (let i = 1; i <= adultCount; i++) {
        const label = document.createElement('label');
        label.innerHTML = `
            Edad adulto ${i}
            <input type="number" min="18" max="120" name="edad-adulto-${i}" required>
        `;
        container.appendChild(label);
    }
}

function buildChildEdges(container, childCount) {
    container.innerHTML = '';
    for (let i = 1; i <= childCount; i++) {
        const label = document.createElement('label');
        label.innerHTML = `
            Edad niño ${i}
            <select name="edad-nino-${i}" required>
              ${Array.from({ length: 18 }, (_, age) => `<option value="${age}">${age} ${age === 1 ? 'año' : 'años'}</option>`).join('')}
            </select>
        `;
        container.appendChild(label);
    }
}

function updateCruceroPassengers() {
    const adultSelect = document.getElementById('adultos-crucero');
    const childSelect = document.getElementById('ninos-crucero');
    const edadesAdultosContainer = document.getElementById('edades-adultos-crucero');
    const edadesNinosContainer = document.getElementById('edades-ninos-crucero');

    if (!adultSelect || !childSelect) return;

    const adultCount = Number(adultSelect.value);
    const childCount = Number(childSelect.value);
    const totalPassengers = adultCount + childCount;

    // Limitar niños si el total excede 9
    if (totalPassengers > 9) {
        const maxChildren = 9 - adultCount;
        childSelect.value = Math.max(0, maxChildren);
        buildChildEdges(edadesNinosContainer, Math.max(0, maxChildren));
    } else {
        buildChildEdges(edadesNinosContainer, childCount);
    }

    buildAdultEdges(edadesAdultosContainer, adultCount);
}

function initializeCruceroForm() {
    const adultSelect = document.getElementById('adultos-crucero');
    const childSelect = document.getElementById('ninos-crucero');
    const fechaSalida = document.getElementById('fecha-salida-crucero');
    const hoy = new Date().toISOString().split('T')[0];

    if (fechaSalida) {
        fechaSalida.setAttribute('min', hoy);
    }

    if (adultSelect && childSelect) {
        adultSelect.addEventListener('change', updateCruceroPassengers);
        childSelect.addEventListener('change', updateCruceroPassengers);
        updateCruceroPassengers();
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

    const fechaIngreso = document.getElementById('fecha-ingreso');
    const fechaSalida = document.getElementById('fecha-salida');

    if (fechaIngreso && fechaSalida) {
        fechaIngreso.setAttribute('min', hoy);
        fechaSalida.setAttribute('min', hoy);

        fechaIngreso.addEventListener('change', () => {
            fechaSalida.setAttribute('min', fechaIngreso.value || hoy);
        });
    }

    const habitacionesContainer = document.getElementById('habitaciones-container');
    const btnAgregarHabitacion = document.getElementById('btn-agregar-habitacion');
    const btnEliminarHabitacion = document.getElementById('btn-eliminar-habitacion');

    if (habitacionesContainer) {
        habitacionesContainer.querySelectorAll('.room-card').forEach(initializeRoomCard);
    }

    if (habitacionesContainer && btnAgregarHabitacion && btnEliminarHabitacion) {
        btnAgregarHabitacion.addEventListener('click', () => addHabitacion(habitacionesContainer, btnAgregarHabitacion, btnEliminarHabitacion));
        btnEliminarHabitacion.addEventListener('click', () => removeHabitacion(habitacionesContainer, btnAgregarHabitacion, btnEliminarHabitacion));
        refreshRoomControls(habitacionesContainer, btnAgregarHabitacion, btnEliminarHabitacion);
    }

    // Inicializar habitaciones Vuelo + Hotel
    const habitacionesContainerVhotel = document.getElementById('habitaciones-container-vhotel');
    const btnAgregarHabitacionVhotel = document.getElementById('btn-agregar-habitacion-vhotel');
    const btnEliminarHabitacionVhotel = document.getElementById('btn-eliminar-habitacion-vhotel');

    if (habitacionesContainerVhotel) {
        habitacionesContainerVhotel.querySelectorAll('.room-card').forEach(initializeRoomCard);
    }

    if (habitacionesContainerVhotel && btnAgregarHabitacionVhotel && btnEliminarHabitacionVhotel) {
        btnAgregarHabitacionVhotel.addEventListener('click', () => addHabitacion(habitacionesContainerVhotel, btnAgregarHabitacionVhotel, btnEliminarHabitacionVhotel));
        btnEliminarHabitacionVhotel.addEventListener('click', () => removeHabitacion(habitacionesContainerVhotel, btnAgregarHabitacionVhotel, btnEliminarHabitacionVhotel));
        refreshRoomControls(habitacionesContainerVhotel, btnAgregarHabitacionVhotel, btnEliminarHabitacionVhotel);
    }

    // Sincronizar fechas Vuelo + Hotel
    const fechaIngresoVhotel = document.getElementById('fecha-ingreso-vhotel');
    const fechaSalidaVhotel = document.getElementById('fecha-salida-vhotel');

    if (fechaIngresoVhotel && fechaSalidaVhotel) {
        fechaIngresoVhotel.setAttribute('min', hoy);
        fechaSalidaVhotel.setAttribute('min', hoy);

        fechaIngresoVhotel.addEventListener('change', () => {
            fechaSalidaVhotel.setAttribute('min', fechaIngresoVhotel.value || hoy);
        });
    }

    // Inicializar formulario en modo solo ida
    toggleRegreso(false);

    // Inicializar formulario de cruceros
    initializeCruceroForm();

    const buscadorVuelos = document.getElementById('buscador-vuelos');
    const buscadorHoteles = document.getElementById('buscador-hoteles');
    const buscadorVueloHotel = document.getElementById('buscador-vuelo-hotel');
    const buscadorPaquetes = document.getElementById('buscador-paquetes');
    const buscadorCruceros = document.getElementById('buscador-cruceros');
    const buscadorAutos = document.getElementById('buscador-autos');

    const getBuscadorElement = (hash) => {
        const map = {
            '#vuelos': buscadorVuelos,
            '#hoteles': buscadorHoteles,
            '#vuelo+Hotel': buscadorVueloHotel,
            '#paquetes': buscadorPaquetes,
            '#cruceros': buscadorCruceros,
            '#autos': buscadorAutos,
        };
        return map[hash] || null;
    };

    const scrollToBuscador = (hash) => {
        const target = getBuscadorElement(hash);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const updateBuscadorVisibility = () => {
        const hash = window.location.hash;

        if (buscadorVuelos) {
            buscadorVuelos.style.display = hash === '#vuelos' ? 'block' : 'none';
        }
        if (buscadorHoteles) {
            buscadorHoteles.style.display = hash === '#hoteles' ? 'block' : 'none';
        }
        if (buscadorVueloHotel) {
            buscadorVueloHotel.style.display = hash === '#vuelo+Hotel' ? 'block' : 'none';
        }
        if (buscadorPaquetes) {
            buscadorPaquetes.style.display = hash === '#paquetes' ? 'block' : 'none';
        }
        if (buscadorCruceros) {
            buscadorCruceros.style.display = hash === '#cruceros' ? 'block' : 'none';
        }
        if (buscadorAutos) {
            buscadorAutos.style.display = hash === '#autos' ? 'block' : 'none';
        }

        scrollToBuscador(hash);
    };

    updateBuscadorVisibility();
    window.addEventListener('hashchange', updateBuscadorVisibility);
});