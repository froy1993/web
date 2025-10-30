

class Persona {
  idPersona: number;
  nombre: string;
  telefono: string;
  ci: string;

  constructor(idPersona: number, nombre: string, telefono = '', ci = '') {
    this.idPersona = idPersona;
    this.nombre = nombre;
    this.telefono = telefono;
    this.ci = ci;
  }
}

class Cliente extends Persona {
  nit: string;
  constructor(idPersona: number, nombre: string, telefono = '', ci = '', nit = '') {
    super(idPersona, nombre, telefono, ci);
    this.nit = nit;
  }
}

class Empleado extends Persona {
  cargo: string;
  login: string;
  clave: string;
  constructor(idPersona: number, nombre: string, telefono = '', ci = '', cargo = '', login = '', clave = '') {
    super(idPersona, nombre, telefono, ci);
    this.cargo = cargo;
    this.login = login;
    this.clave = clave;
  }
  acceso(login: string, clave: string): boolean {
    return this.login === login && this.clave === clave;
  }
}

class Trabajo {
  idTrabajo: number;
  nombreTrabajo: string;
  precio?: number; 
  areaDeTrabajo?: string; 
  constructor(idTrabajo: number, nombreTrabajo: string) {
    this.idTrabajo = idTrabajo;
    this.nombreTrabajo = nombreTrabajo;
  }
}

class Pedido {
  idPedido: number;
  clienteId: number;
  fechaPedido: string; 
  trabajos: number[]; 
  constructor(idPedido: number, clienteId: number, fechaPedido: Date, trabajos: number[] = []) {
    this.idPedido = idPedido;
    this.clienteId = clienteId;
    this.fechaPedido = fechaPedido.toISOString(); 
    this.trabajos = trabajos;
  }
}

class Detalle {
  idDetalle: number;
  idTrabajo: number;
  fechaDeEntrega?: string;
  estado: string; 
  idPedido: number;
  idEmpleado?: number;
  constructor(idDetalle: number, idTrabajo: number, idPedido: number) {
    this.idDetalle = idDetalle;
    this.idTrabajo = idTrabajo;
    this.idPedido = idPedido;
    this.estado = 'Pendiente';
  }
}



let nextPersonaId = 1;
let nextTrabajoId = 1;
let nextPedidoId = 1;
let nextDetalleId = 1;

const clientes: Cliente[] = [];
const empleados: Empleado[] = [];
const trabajos: Trabajo[] = [];
const pedidos: Pedido[] = [];
const detalles: Detalle[] = [];


const empleadoDefault = new Empleado(nextPersonaId++, "Froilan Lucana", "78912345", "9988776", "Propietario", "incos", "1234");
empleados.push(empleadoDefault);



function getEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`No se encontró el elemento ${id}`);
  return el as T;
}

const roleScreen = getEl<HTMLElement>('role-screen');
const clienteScreen = getEl<HTMLElement>('cliente-screen');
const empleadoLogin = getEl<HTMLElement>('empleado-login');
const empleadoPanel = getEl<HTMLElement>('empleado-panel');
const clienteResult = getEl<HTMLDivElement>('cliente-result');
const pedidosList = getEl<HTMLDivElement>('pedidos-list');
const detallePrimary = getEl<HTMLDivElement>('detalle-primary');
const empNombreSpan = getEl<HTMLElement>('emp-nombre');
const loginMensaje = getEl<HTMLElement>('login-mensaje');

function show(element: HTMLElement) { element.classList.remove('hidden'); }
function hide(element: HTMLElement) { element.classList.add('hidden'); }



function getCurrentEmpleado(): Empleado | undefined {
  return (window as any)._empleadoLogged as Empleado | undefined;
}
function setCurrentEmpleado(emp: Empleado | undefined) {
  (window as any)._empleadoLogged = emp;
}


function renderPedidosList() {
  pedidosList.innerHTML = '';
  if (pedidos.length === 0) {
    pedidosList.innerHTML = '<p class="small">No hay pedidos registrados aún.</p>';
    return;
  }

  pedidos.slice().reverse().forEach((p) => {
    const cliente = clientes.find(c => c.idPersona === p.clienteId)!;
    const div = document.createElement('div');
    div.className = 'pedido-card';

    const detallesPedido = detalles.filter(d => d.idPedido === p.idPedido);
    const estadoResumen = detallesPedido.map(d => d.estado).join(', ');

    div.innerHTML = `
      <div><strong>Pedido #${p.idPedido}</strong> - ${new Date(p.fechaPedido).toLocaleString()}</div>
      <div class="pedido-meta">Cliente: ${cliente.nombre} — Estado: <span class="estado-badge">${estadoResumen}</span></div>
      <div class="status-actions" id="acciones-${p.idPedido}"></div>
    `;
    pedidosList.appendChild(div);

    const accionesDiv = getEl<HTMLDivElement>(`acciones-${p.idPedido}`);
    const verBtn = document.createElement('button'); verBtn.className = 'btn'; verBtn.textContent = 'Ver / Editar Detalles';
    verBtn.onclick = () => renderPedidoDetalles(p.idPedido);
    accionesDiv.appendChild(verBtn);
  });
}


function renderPedidoDetalles(idPedido: number) {
  detallePrimary.innerHTML = '';
  const p = pedidos.find(x => x.idPedido === idPedido);
  if (!p) return;
  const cliente = clientes.find(c => c.idPersona === p.clienteId)!;
  const detallesPedido = detalles.filter(d => d.idPedido === idPedido);

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `<h3>Pedido #${p.idPedido}</h3>
    <div class="pedido-meta">Cliente: ${cliente.nombre} • Fecha: ${new Date(p.fechaPedido).toLocaleString()}</div>
  `;

  detallesPedido.forEach(d => {
    const trabajo = trabajos.find(t => t.idTrabajo === d.idTrabajo)!;
    const card = document.createElement('div');
    card.className = 'pedido-card';

    card.innerHTML = `
      <div><strong>Trabajo:</strong> ${trabajo.nombreTrabajo}</div>
      <div class="pedido-meta">
        Precio: Bs <span id="precio-${d.idDetalle}">${trabajo.precio ?? '-'}</span> • 
        Área: <span id="area-${d.idDetalle}">${trabajo.areaDeTrabajo ?? '-'}</span> • 
        Estado: <span id="estado-${d.idDetalle}">${d.estado}</span>
      </div>
    `;

    const actions = document.createElement('div'); actions.className = 'status-actions';

    const asignarArea = document.createElement('select');
    asignarArea.innerHTML = `<option value="">Asignar área</option><option value="Tornería">Tornería</option><option value="Moldes">Moldes</option>`;
    asignarArea.value = trabajo.areaDeTrabajo ?? '';
    asignarArea.onchange = () => { trabajo.areaDeTrabajo = asignarArea.value; renderPedidosList(); renderPedidoDetalles(idPedido); };
    actions.appendChild(asignarArea);

    const precioInput = document.createElement('input');
    precioInput.type = 'number'; precioInput.placeholder = 'Bs';
    precioInput.value = trabajo.precio?.toString() ?? '';
    precioInput.onchange = () => { trabajo.precio = Number(precioInput.value); renderPedidosList(); renderPedidoDetalles(idPedido); };
    actions.appendChild(precioInput);

    const avanzarBtn = document.createElement('button'); avanzarBtn.className = 'btn'; avanzarBtn.textContent = 'Avanzar estado';
    avanzarBtn.onclick = () => {
      const estados = ['Pendiente','En proceso','Terminado'];
      const idx = estados.indexOf(d.estado);
      d.estado = idx < estados.length-1 ? estados[idx+1] : estados[idx];
      const emp = getCurrentEmpleado();
      if(emp) d.idEmpleado = emp.idPersona;
      renderPedidosList(); renderPedidoDetalles(idPedido);
    };
    actions.appendChild(avanzarBtn);

    card.appendChild(actions);
    wrapper.appendChild(card);
  });

  detallePrimary.appendChild(wrapper);
}


function renderClienteResult(text: string) { clienteResult.innerHTML = text; }


getEl<HTMLButtonElement>('btnCliente').addEventListener('click', () => { hide(roleScreen); show(clienteScreen); renderClienteHistorial(); });
getEl<HTMLButtonElement>('btnEmpleado').addEventListener('click', () => { hide(roleScreen); show(empleadoLogin); });


getEl<HTMLButtonElement>('btnVolverCliente').addEventListener('click', () => { show(roleScreen); hide(clienteScreen); clienteResult.innerHTML=''; });
getEl<HTMLButtonElement>('btnVolverEmpleado').addEventListener('click', () => { show(roleScreen); hide(empleadoLogin); loginMensaje.textContent=''; });


getEl<HTMLFormElement>('formCliente').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const nombre = (getEl<HTMLInputElement>('c_nombre')).value.trim();
  const telefono = (getEl<HTMLInputElement>('c_telefono')).value.trim();
  const ci = (getEl<HTMLInputElement>('c_ci')).value.trim();
  const nit = (getEl<HTMLInputElement>('c_nit')).value.trim();
  const t_nombre = (getEl<HTMLInputElement>('t_nombre')).value.trim();

  const cliente = new Cliente(nextPersonaId++, nombre, telefono, ci, nit);
  clientes.push(cliente);
  const trabajo = new Trabajo(nextTrabajoId++, t_nombre);
  trabajos.push(trabajo);

  const pedido = new Pedido(nextPedidoId++, cliente.idPersona, new Date(), [trabajo.idTrabajo]);
  pedidos.push(pedido);
  const detalle = new Detalle(nextDetalleId++, trabajo.idTrabajo, pedido.idPedido);
  detalles.push(detalle);

  renderClienteResult(`<strong>Pedido registrado</strong><br>Cliente: ${cliente.nombre}<br>ID Pedido: ${pedido.idPedido}<br>Detalle pendiente de revisión por empleado`);

  ['c_nombre','c_telefono','c_ci','c_nit','t_nombre'].forEach(id => (getEl<HTMLInputElement>(id).value=''));
});


getEl<HTMLButtonElement>('btnLoginEmpleado').addEventListener('click', () => {
  const usuario = (getEl<HTMLInputElement>('e_usuario')).value.trim();
  const clave = (getEl<HTMLInputElement>('e_clave')).value.trim();
  const emp = empleados.find(e => e.acceso(usuario, clave));
  if(emp){
    loginMensaje.textContent='';
    setCurrentEmpleado(emp);
    empNombreSpan.textContent=emp.nombre;
    hide(empleadoLogin); show(empleadoPanel);
    renderPedidosList();
  } else {
    loginMensaje.textContent='Usuario o clave incorrectos.'; loginMensaje.setAttribute('style','color:crimson');
  }
});

getEl<HTMLButtonElement>('btnCerrarSesion').addEventListener('click', () => {
  setCurrentEmpleado(undefined);
  hide(empleadoPanel); show(roleScreen);
  pedidosList.innerHTML=''; detallePrimary.innerHTML='';
});

function renderClienteHistorial() {
  if(clientes.length === 0 || pedidos.length === 0) {
    renderClienteResult('<p>No hay pedidos aún.</p>');
    return;
  }

  let html = '';
  pedidos.forEach(p => {
    const cliente = clientes.find(c => c.idPersona === p.clienteId)!;
    html += `<div class="pedido-card"><strong>Pedido #${p.idPedido}</strong> - ${new Date(p.fechaPedido).toLocaleString()}<br>`;
    p.trabajos.forEach(idTrabajo => {
      const trabajo = trabajos.find(t => t.idTrabajo === idTrabajo)!;
      const detalle = detalles.find(d => d.idTrabajo === idTrabajo && d.idPedido === p.idPedido)!;
      html += `Trabajo: ${trabajo.nombreTrabajo} — Precio: ${trabajo.precio ?? '-'} — Área: ${trabajo.areaDeTrabajo ?? '-'} — Estado: ${detalle.estado}<br>`;
    });
    html += `</div>`;
  });

  renderClienteResult(html);
}


hide(clienteScreen); hide(empleadoLogin); hide(empleadoPanel);
