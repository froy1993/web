var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Persona = /** @class */ (function () {
    function Persona(idPersona, nombre, telefono, ci) {
        if (telefono === void 0) { telefono = ''; }
        if (ci === void 0) { ci = ''; }
        this.idPersona = idPersona;
        this.nombre = nombre;
        this.telefono = telefono;
        this.ci = ci;
    }
    return Persona;
}());
var Cliente = /** @class */ (function (_super) {
    __extends(Cliente, _super);
    function Cliente(idPersona, nombre, telefono, ci, nit) {
        if (telefono === void 0) { telefono = ''; }
        if (ci === void 0) { ci = ''; }
        if (nit === void 0) { nit = ''; }
        var _this = _super.call(this, idPersona, nombre, telefono, ci) || this;
        _this.nit = nit;
        return _this;
    }
    return Cliente;
}(Persona));
var Empleado = /** @class */ (function (_super) {
    __extends(Empleado, _super);
    function Empleado(idPersona, nombre, telefono, ci, cargo, login, clave) {
        if (telefono === void 0) { telefono = ''; }
        if (ci === void 0) { ci = ''; }
        if (cargo === void 0) { cargo = ''; }
        if (login === void 0) { login = ''; }
        if (clave === void 0) { clave = ''; }
        var _this = _super.call(this, idPersona, nombre, telefono, ci) || this;
        _this.cargo = cargo;
        _this.login = login;
        _this.clave = clave;
        return _this;
    }
    Empleado.prototype.acceso = function (login, clave) {
        return this.login === login && this.clave === clave;
    };
    return Empleado;
}(Persona));
var Trabajo = /** @class */ (function () {
    function Trabajo(idTrabajo, nombreTrabajo) {
        this.idTrabajo = idTrabajo;
        this.nombreTrabajo = nombreTrabajo;
    }
    return Trabajo;
}());
var Pedido = /** @class */ (function () {
    function Pedido(idPedido, clienteId, fechaPedido, trabajos) {
        if (trabajos === void 0) { trabajos = []; }
        this.idPedido = idPedido;
        this.clienteId = clienteId;
        this.fechaPedido = fechaPedido.toISOString();
        this.trabajos = trabajos;
    }
    return Pedido;
}());
var Detalle = /** @class */ (function () {
    function Detalle(idDetalle, idTrabajo, idPedido) {
        this.idDetalle = idDetalle;
        this.idTrabajo = idTrabajo;
        this.idPedido = idPedido;
        this.estado = 'Pendiente';
    }
    return Detalle;
}());
var nextPersonaId = 1;
var nextTrabajoId = 1;
var nextPedidoId = 1;
var nextDetalleId = 1;
var clientes = [];
var empleados = [];
var trabajos = [];
var pedidos = [];
var detalles = [];
var empleadoDefault = new Empleado(nextPersonaId++, "Froilan Lucana", "78912345", "9988776", "Propietario", "incos", "1234");
empleados.push(empleadoDefault);
function getEl(id) {
    var el = document.getElementById(id);
    if (!el)
        throw new Error("No se encontr\u00F3 el elemento ".concat(id));
    return el;
}
var roleScreen = getEl('role-screen');
var clienteScreen = getEl('cliente-screen');
var empleadoLogin = getEl('empleado-login');
var empleadoPanel = getEl('empleado-panel');
var clienteResult = getEl('cliente-result');
var pedidosList = getEl('pedidos-list');
var detallePrimary = getEl('detalle-primary');
var empNombreSpan = getEl('emp-nombre');
var loginMensaje = getEl('login-mensaje');
function show(element) { element.classList.remove('hidden'); }
function hide(element) { element.classList.add('hidden'); }
function getCurrentEmpleado() {
    return window._empleadoLogged;
}
function setCurrentEmpleado(emp) {
    window._empleadoLogged = emp;
}
function renderPedidosList() {
    pedidosList.innerHTML = '';
    if (pedidos.length === 0) {
        pedidosList.innerHTML = '<p class="small">No hay pedidos registrados aún.</p>';
        return;
    }
    pedidos.slice().reverse().forEach(function (p) {
        var cliente = clientes.find(function (c) { return c.idPersona === p.clienteId; });
        var div = document.createElement('div');
        div.className = 'pedido-card';
        var detallesPedido = detalles.filter(function (d) { return d.idPedido === p.idPedido; });
        var estadoResumen = detallesPedido.map(function (d) { return d.estado; }).join(', ');
        div.innerHTML = "\n      <div><strong>Pedido #".concat(p.idPedido, "</strong> - ").concat(new Date(p.fechaPedido).toLocaleString(), "</div>\n      <div class=\"pedido-meta\">Cliente: ").concat(cliente.nombre, " \u2014 Estado: <span class=\"estado-badge\">").concat(estadoResumen, "</span></div>\n      <div class=\"status-actions\" id=\"acciones-").concat(p.idPedido, "\"></div>\n    ");
        pedidosList.appendChild(div);
        var accionesDiv = getEl("acciones-".concat(p.idPedido));
        var verBtn = document.createElement('button');
        verBtn.className = 'btn';
        verBtn.textContent = 'Ver / Editar Detalles';
        verBtn.onclick = function () { return renderPedidoDetalles(p.idPedido); };
        accionesDiv.appendChild(verBtn);
    });
}
function renderPedidoDetalles(idPedido) {
    detallePrimary.innerHTML = '';
    var p = pedidos.find(function (x) { return x.idPedido === idPedido; });
    if (!p)
        return;
    var cliente = clientes.find(function (c) { return c.idPersona === p.clienteId; });
    var detallesPedido = detalles.filter(function (d) { return d.idPedido === idPedido; });
    var wrapper = document.createElement('div');
    wrapper.innerHTML = "<h3>Pedido #".concat(p.idPedido, "</h3>\n    <div class=\"pedido-meta\">Cliente: ").concat(cliente.nombre, " \u2022 Fecha: ").concat(new Date(p.fechaPedido).toLocaleString(), "</div>\n  ");
    detallesPedido.forEach(function (d) {
        var _a, _b, _c, _d, _e;
        var trabajo = trabajos.find(function (t) { return t.idTrabajo === d.idTrabajo; });
        var card = document.createElement('div');
        card.className = 'pedido-card';
        card.innerHTML = "\n      <div><strong>Trabajo:</strong> ".concat(trabajo.nombreTrabajo, "</div>\n      <div class=\"pedido-meta\">\n        Precio: Bs <span id=\"precio-").concat(d.idDetalle, "\">").concat((_a = trabajo.precio) !== null && _a !== void 0 ? _a : '-', "</span> \u2022 \n        \u00C1rea: <span id=\"area-").concat(d.idDetalle, "\">").concat((_b = trabajo.areaDeTrabajo) !== null && _b !== void 0 ? _b : '-', "</span> \u2022 \n        Estado: <span id=\"estado-").concat(d.idDetalle, "\">").concat(d.estado, "</span>\n      </div>\n    ");
        var actions = document.createElement('div');
        actions.className = 'status-actions';
        var asignarArea = document.createElement('select');
        asignarArea.innerHTML = "<option value=\"\">Asignar \u00E1rea</option><option value=\"Torner\u00EDa\">Torner\u00EDa</option><option value=\"Moldes\">Moldes</option>";
        asignarArea.value = (_c = trabajo.areaDeTrabajo) !== null && _c !== void 0 ? _c : '';
        asignarArea.onchange = function () { trabajo.areaDeTrabajo = asignarArea.value; renderPedidosList(); renderPedidoDetalles(idPedido); };
        actions.appendChild(asignarArea);
        var precioInput = document.createElement('input');
        precioInput.type = 'number';
        precioInput.placeholder = 'Bs';
        precioInput.value = (_e = (_d = trabajo.precio) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : '';
        precioInput.onchange = function () { trabajo.precio = Number(precioInput.value); renderPedidosList(); renderPedidoDetalles(idPedido); };
        actions.appendChild(precioInput);
        var avanzarBtn = document.createElement('button');
        avanzarBtn.className = 'btn';
        avanzarBtn.textContent = 'Avanzar estado';
        avanzarBtn.onclick = function () {
            var estados = ['Pendiente', 'En proceso', 'Terminado'];
            var idx = estados.indexOf(d.estado);
            d.estado = idx < estados.length - 1 ? estados[idx + 1] : estados[idx];
            var emp = getCurrentEmpleado();
            if (emp)
                d.idEmpleado = emp.idPersona;
            renderPedidosList();
            renderPedidoDetalles(idPedido);
        };
        actions.appendChild(avanzarBtn);
        card.appendChild(actions);
        wrapper.appendChild(card);
    });
    detallePrimary.appendChild(wrapper);
}
function renderClienteResult(text) { clienteResult.innerHTML = text; }
getEl('btnCliente').addEventListener('click', function () { hide(roleScreen); show(clienteScreen); renderClienteHistorial(); });
getEl('btnEmpleado').addEventListener('click', function () { hide(roleScreen); show(empleadoLogin); });
getEl('btnVolverCliente').addEventListener('click', function () { show(roleScreen); hide(clienteScreen); clienteResult.innerHTML = ''; });
getEl('btnVolverEmpleado').addEventListener('click', function () { show(roleScreen); hide(empleadoLogin); loginMensaje.textContent = ''; });
getEl('formCliente').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var nombre = (getEl('c_nombre')).value.trim();
    var telefono = (getEl('c_telefono')).value.trim();
    var ci = (getEl('c_ci')).value.trim();
    var nit = (getEl('c_nit')).value.trim();
    var t_nombre = (getEl('t_nombre')).value.trim();
    var cliente = new Cliente(nextPersonaId++, nombre, telefono, ci, nit);
    clientes.push(cliente);
    var trabajo = new Trabajo(nextTrabajoId++, t_nombre);
    trabajos.push(trabajo);
    var pedido = new Pedido(nextPedidoId++, cliente.idPersona, new Date(), [trabajo.idTrabajo]);
    pedidos.push(pedido);
    var detalle = new Detalle(nextDetalleId++, trabajo.idTrabajo, pedido.idPedido);
    detalles.push(detalle);
    renderClienteResult("<strong>Pedido registrado</strong><br>Cliente: ".concat(cliente.nombre, "<br>ID Pedido: ").concat(pedido.idPedido, "<br>Detalle pendiente de revisi\u00F3n por empleado"));
    ['c_nombre', 'c_telefono', 'c_ci', 'c_nit', 't_nombre'].forEach(function (id) { return (getEl(id).value = ''); });
});
getEl('btnLoginEmpleado').addEventListener('click', function () {
    var usuario = (getEl('e_usuario')).value.trim();
    var clave = (getEl('e_clave')).value.trim();
    var emp = empleados.find(function (e) { return e.acceso(usuario, clave); });
    if (emp) {
        loginMensaje.textContent = '';
        setCurrentEmpleado(emp);
        empNombreSpan.textContent = emp.nombre;
        hide(empleadoLogin);
        show(empleadoPanel);
        renderPedidosList();
    }
    else {
        loginMensaje.textContent = 'Usuario o clave incorrectos.';
        loginMensaje.setAttribute('style', 'color:crimson');
    }
});
getEl('btnCerrarSesion').addEventListener('click', function () {
    setCurrentEmpleado(undefined);
    hide(empleadoPanel);
    show(roleScreen);
    pedidosList.innerHTML = '';
    detallePrimary.innerHTML = '';
});
function renderClienteHistorial() {
    if (clientes.length === 0 || pedidos.length === 0) {
        renderClienteResult('<p>No hay pedidos aún.</p>');
        return;
    }
    var html = '';
    pedidos.forEach(function (p) {
        var cliente = clientes.find(function (c) { return c.idPersona === p.clienteId; });
        html += "<div class=\"pedido-card\"><strong>Pedido #".concat(p.idPedido, "</strong> - ").concat(new Date(p.fechaPedido).toLocaleString(), "<br>");
        p.trabajos.forEach(function (idTrabajo) {
            var _a, _b;
            var trabajo = trabajos.find(function (t) { return t.idTrabajo === idTrabajo; });
            var detalle = detalles.find(function (d) { return d.idTrabajo === idTrabajo && d.idPedido === p.idPedido; });
            html += "Trabajo: ".concat(trabajo.nombreTrabajo, " \u2014 Precio: ").concat((_a = trabajo.precio) !== null && _a !== void 0 ? _a : '-', " \u2014 \u00C1rea: ").concat((_b = trabajo.areaDeTrabajo) !== null && _b !== void 0 ? _b : '-', " \u2014 Estado: ").concat(detalle.estado, "<br>");
        });
        html += "</div>";
    });
    renderClienteResult(html);
}
hide(clienteScreen);
hide(empleadoLogin);
hide(empleadoPanel);
