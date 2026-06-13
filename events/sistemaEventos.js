import { EventEmitter } from "events";

class SistemaEventos extends EventEmitter {

    constructor() {
        super();
        this.setMaxListeners(20);
    }

    emitirEvento(nombre, datos) {
        console.log(`Evento ${nombre}`, datos);
        this.emit(nombre, datos);
    }
}

export const eventos = new SistemaEventos();

// ✅ Evento: usuario registrado
eventos.on("usuario:registrado", (usuario) => {
    console.log("Email de bienvenida enviado a " + usuario.email);

    // Simulación async SIN bloquear
    setTimeout(() => {
        console.log("Email enviado a " + usuario.email);
    }, 500);
});

// ✅ Evento: login (CORREGIDO)
eventos.on("usuario:login", (datos) => {
    console.log(
        "Usuario " + datos.email +
        " ha iniciado sesión a las " + new Date()
    );
});

export default eventos;