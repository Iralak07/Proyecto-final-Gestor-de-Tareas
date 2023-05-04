
// Esperamos hasta tanto se cargue completamente la pagina
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionamos el el submit y el campo input donde se escribe la nueva tarea
    let contador = 0;
    let seccion;
    const SUBMIT = document.querySelector('#submit');
    const NUEVATarea = document.querySelector('#tarea');
    const DESCRIPCION = document.querySelector('#descripcion');
    const SELECT = document.querySelector('select');
    const BOTONPagina = document.querySelectorAll('.botonPag');
    const PAGINAS = document.querySelectorAll('.paginas');
    const CONTENEDORPendientes = document.querySelector('#pendientes');
    const CONTENEDORTerminadas = document.querySelector('#terminadas');
    const CONTENEDORUltimasAgregadas = document.querySelector('#ultimasAgregadas');

    // Estado inicial de la tarea
    let pendiente = true;
    const PRIORIDADES = {
        normal: 'NORMAL',
        medio: 'MEDIO',
        urgente: 'URGENTE'
    };

    // Por defecto la prioridad se coloca en normal
    let prioridad = PRIORIDADES.normal;
    
    function cambiarPagina(pagina){
        limpiarTareas();
        ocultarPagina();
        if(pagina == 'pagina1'){
            estadoDeLasTareas();
        }
        document.getElementById(`${pagina}`).style.display = 'flex'
    };

    function estadoDeLasTareas(){
        let tareasLocalStorage = localStorage.getItem('tareas');
        let total = 0;
        let totalPendientes = 0;
        let totalTerminadas = 0;
        if (tareasLocalStorage !== null){
            tareasLocalStorage = JSON.parse(tareasLocalStorage);
            console.log(tareasLocalStorage)
            for(let i = 0; i < tareasLocalStorage.length; i++){
                total +=1;
                if(tareasLocalStorage[i][3]){
                    totalPendientes += 1;
                }else{
                    totalTerminadas += 1;
                }
            }
            mostrarEstadoDeLasTareas(total, totalPendientes,totalTerminadas);
        }
    }

    function mostrarEstadoDeLasTareas(total,totalPendientes,totalTerminadas){
        document.getElementById('total').textContent = `Total: ${total}`;
        document.getElementById('totalPendientes').textContent = `Pendientes: ${totalPendientes}`;
        document.getElementById('totalTerminadas').textContent = `Terminadas: ${totalTerminadas}`;
    }
    function ocultarPagina(){
        PAGINAS.forEach(pagina =>{
            pagina.style.display = 'none';
        })
    };

    cambiarPagina('pagina1');

    BOTONPagina.forEach(boton=>{
        boton.onclick = function(){
            seccion = this.dataset.pagina;
            // Agregamos al historial del navegador
            // history.pushState({section: seccion}, "", `/${seccion == 'pagina2'? 'registroTareas':'tareas'}`);
            if(seccion == 'pagina2'){
                cambiarPagina(seccion);
                agregarUltimasTareasCreadas()
            }else if(seccion == 'pagina3'){
                cambiarPagina(seccion);
                obtenerTareas();
            }
        }
    });

    // Deshabilitamos el boton submit para que no se pueda enviar hasta tanto se escriba algo sobre el campo input
    SUBMIT.disabled = true;
    // Aqui escuchamos a traves de la funcion onkeyup, verificamos si el campo del input esta vacio o no, deshabilitando o habilitando el boton input
    NUEVATarea.onkeyup = () => {
        if (NUEVATarea.value.length > 0) {
            SUBMIT.disabled = false;
        }
        else {
            SUBMIT.disabled = true;
        }
    };

    SELECT.onchange = ()=>{
        prioridad = PRIORIDADES[SELECT.value];
    }


    function porDefecto(){
        prioridad = PRIORIDADES.normal;
        NUEVATarea.value = '';
        DESCRIPCION.value = '';
        SELECT.value = 'normal';
        SUBMIT.disabled = true;
    };

    porDefecto();


    function obtenerColor(prioridad){
        if(prioridad == PRIORIDADES.normal){
            return '#46B5D1';
        }else if(prioridad == PRIORIDADES.medio){
            return '#FFD700';
        }else{
            return '#FF0000';
        }
    };

    function guardarTarea(tarea, descripcion, prioridad){
            porDefecto();
            let existeTareas = localStorage.getItem('tareas'); 
            let datos = [tarea, descripcion, prioridad, pendiente]
            if(existeTareas !== null){
                // Si la clave ya existe, obtener el valor actual
                let tareas = JSON.parse(existeTareas);
                // Agregar el nuevo dato al valor existente (en este caso, se asume que el valor es un array)
                tareas.push(datos);
                // Guardar el valor actualizado en el localStorage
                localStorage.setItem('tareas', JSON.stringify(tareas));
            }else{
                // Si la clave no existe, guardar el nuevo dato directamente
                localStorage.setItem('tareas', JSON.stringify([datos]));
            }
    };

    function agregarUltimasTareasCreadas(){
        limpiarTareas();
        let tareasLocalStorage = localStorage.getItem('tareas');
        if (tareasLocalStorage !== null){
            tareasLocalStorage = JSON.parse(tareasLocalStorage).reverse();
            for(let i = 0; i < tareasLocalStorage.length; i++){
                if(i <=2){
                    let tarea = tareasLocalStorage[i][0];
                    let descripcion = tareasLocalStorage[i][1];
                    let prioridad = tareasLocalStorage[i][2];
                    let estado = tareasLocalStorage[i][3];
                    let id = i;
                    crearElementos(tarea, descripcion, prioridad, estado, id); 
                }else{
                    break;
                }
            }
        }
    };

    // Aqui esuchamos el evento submit en el formulario
    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault()
        // Recojemos el valor del input
        const TAREA = NUEVATarea.value;
        const DESC = DESCRIPCION.value;
        // Vamos a guardar la tarea:
        guardarTarea(TAREA, DESC, prioridad);
        // Creamos un nuevo elemento li y agregamos la tarea
        agregarUltimasTareasCreadas();
        // Vamos a borrar los campos del formulario
        porDefecto();
    });


    function obtenerTareas(){
        let tareasLocalStorage = localStorage.getItem('tareas');
        if (tareasLocalStorage !== null){
            tareasLocalStorage = JSON.parse(tareasLocalStorage);
            for(let i = 0; i < tareasLocalStorage.length; i++){
                let tarea = tareasLocalStorage[i][0];
                let descripcion = tareasLocalStorage[i][1];
                let prioridad = tareasLocalStorage[i][2];
                let estado = tareasLocalStorage[i][3];
                let id = i;
                crearElementos(tarea, descripcion, prioridad, estado, id);  
            }
        }
    }
    
    function limpiarTareas(){
        CONTENEDORPendientes.innerHTML = '';
        CONTENEDORTerminadas.innerHTML = '';
        CONTENEDORUltimasAgregadas.innerHTML = '';
    }

    function cambiarEstado(id){
        let tareasLocalStorage = localStorage.getItem('tareas');
        tareasLocalStorage = JSON.parse(tareasLocalStorage);
        tareasLocalStorage[id][3] = tareasLocalStorage[id][3] == true? false : true;
        localStorage.setItem('tareas', JSON.stringify(tareasLocalStorage));
        limpiarTareas();
        obtenerTareas();
    }

    function eliminarTarea(id){
        let tareasLocalStorage = localStorage.getItem('tareas');
        tareasLocalStorage = JSON.parse(tareasLocalStorage);
        tareasLocalStorage.splice(id,1);
        localStorage.setItem('tareas', JSON.stringify(tareasLocalStorage));
        limpiarTareas();
        obtenerTareas(); 
    }
    document.addEventListener('click', (evento)=>{
        let elemento = evento.target;
        let id = elemento.dataset.id;
        if(elemento.textContent == 'Terminar'){
            cambiarEstado(id)
        }else if(elemento.textContent == 'Pendiente'){
            cambiarEstado(id);
        }else if(elemento.textContent == 'X'){
            eliminarTarea(id)
        }
    })

    // Seccion mostrar tareas pendientes y terminadas
    function crearElementos(tarea, descripcion, prioridad, estado, id){
        let color = obtenerColor(prioridad);
        // Crear la nueva sección dentro de las tareas pendientes
        // Agregamos la clase .box
        let nuevaSeccionPendientes = document.createElement('div');
        nuevaSeccionPendientes.classList.add('box');

        // Crear el contenido de la sección
        let seccionTareaPendientes = document.createElement('div');
        seccionTareaPendientes.classList.add('seccionTarea');

        // vamos a crear dos div en el cual vamos a gregar el titulo de la tarea y la descripcion respectivamente
        let seccionTituloTarea = document.createElement('div');
        let tituloPendientes = document.createElement('h1');
        tituloPendientes.textContent = tarea;
        seccionTituloTarea.appendChild(tituloPendientes);
        seccionTareaPendientes.appendChild(seccionTituloTarea);

        let seccionDescripcion = document.createElement('div');
        let descripcionPendientes = document.createElement('p');
        descripcionPendientes.textContent = descripcion;
        seccionDescripcion.appendChild(descripcionPendientes);
        seccionTareaPendientes.appendChild(seccionDescripcion);

        // Seccio BotonPendientes
        let seccionBotonPendientes = document.createElement('div');
        seccionBotonPendientes.classList.add('seccionBoton');
        seccionBotonPendientes.style = `background-color: ${color}`;

        let botonCerrarPendientes = document.createElement('div');
        botonCerrarPendientes.classList.add('botonCerrar');

        let botonXPendientes = document.createElement('button');
        botonXPendientes.textContent = 'X';
        botonXPendientes.setAttribute('data-id', id);
        botonXPendientes.style = 'border: none; border-radius: 5px; background-color: blue';

        let divSeccionBotonPendientes = document.createElement('div');
        divSeccionBotonPendientes.appendChild(botonXPendientes);

        botonCerrarPendientes.appendChild(divSeccionBotonPendientes);

        let botonTerminarPendientes = document.createElement('button');
        botonTerminarPendientes.setAttribute('data-id', id);
        botonTerminarPendientes.textContent = estado == true ? 'Terminar': 'Pendiente';

        seccionBotonPendientes.appendChild(botonCerrarPendientes);
        seccionBotonPendientes.appendChild(botonTerminarPendientes);

        nuevaSeccionPendientes.appendChild(seccionTareaPendientes);
        nuevaSeccionPendientes.appendChild(seccionBotonPendientes);

        if(seccion == 'pagina2'){
            CONTENEDORUltimasAgregadas.appendChild(nuevaSeccionPendientes)
        }else{
            if(estado){
                // Agregar la nueva sección al contenedor de tareas pendientes
                CONTENEDORPendientes.appendChild(nuevaSeccionPendientes);
                }else{
                    CONTENEDORTerminadas.appendChild(nuevaSeccionPendientes);
                }
        }
    }
});
