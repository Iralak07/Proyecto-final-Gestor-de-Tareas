
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

    // prioridades de cada tarea
    const PRIORIDADES = {
        normal: 'NORMAL',
        medio: 'MEDIO',
        urgente: 'URGENTE'
    };

    // Por defecto la prioridad se coloca en normal
    let prioridad = PRIORIDADES.normal;
    let listaTareas;
    

    // Con esta funcion cambiamos la pagina, es decir dinamicamente ocultamos los divs y mostramos el div correspondiente a la pagina determinada
    function cambiarPagina(pagina){
        document.querySelector('header').style.display = 'flex';
        // limpiamos las tares existentes
        limpiarTareas();
        // ocultamos todas las paginas
        ocultarPagina();
        if(pagina == 'pagina1'){
            estadoDeLasTareas();
        }else if(pagina == 'pagina4'){
            document.querySelector('header').style.display = 'none';
        }
        document.getElementById(`${pagina}`).style.display = 'flex'
    };


    // Con esta funcion se hace un recuente de todas la treas existentes, las que estan pendientes y las terminadas
    function estadoDeLasTareas(){
        let tareasLocalStorage = localStorage.getItem('tareas');
        let total = 0;
        let totalPendientes = 0;
        let totalTerminadas = 0;
        if (tareasLocalStorage !== null){
            tareasLocalStorage = JSON.parse(tareasLocalStorage);
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


    // con esta funcion mostramos el resultado de la funcion estadoDeLasTares
    function mostrarEstadoDeLasTareas(total,totalPendientes,totalTerminadas){
        document.getElementById('total').textContent = `Total: ${total}`;
        document.getElementById('totalPendientes').textContent = `Pendientes: ${totalPendientes}`;
        document.getElementById('totalTerminadas').textContent = `Terminadas: ${totalTerminadas}`;
    }
    // ocultamos todos los div
    function ocultarPagina(){
        PAGINAS.forEach(pagina =>{
            pagina.style.display = 'none';
        })
    };

    // por defecto al cargarse la pagina se muestra la primera pagina, correspondiente al inicio
    cambiarPagina('pagina1');


    // Aqui recorremos los botones que tienen a los cuales le hemos asignado un dato correspondiente a la pagina1, pagina2 y pagina3
    BOTONPagina.forEach(boton=>{
        boton.onclick = function(){
            // obtenemos el dato del boton seleccionado
            seccion = this.dataset.pagina;
            if(seccion == 'pagina2'){
                cambiarPagina(seccion);
                agregarUltimasTareasCreadas()
            }else if(seccion == 'pagina3'){
                cambiarPagina(seccion);
                obtenerTareas();
            }else if(seccion == 'pagina4'){
                cambiarPagina(seccion);
            }else{
                cambiarPagina(seccion);
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

    // aqui obtenemos el valor del select
    SELECT.onchange = ()=>{
        prioridad = PRIORIDADES[SELECT.value];
    }


    // aqui establecemos los valores por defecto,
    function porDefecto(){
        prioridad = PRIORIDADES.normal;
        NUEVATarea.value = '';
        DESCRIPCION.value = '';
        SELECT.value = 'normal';
        SUBMIT.disabled = true;
    };

    porDefecto();


    // Aqui obtenemos el color seguna la prioridad
    function obtenerColor(prioridad){
        if(prioridad == PRIORIDADES.normal){
            return '#46B5D1';
        }else if(prioridad == PRIORIDADES.medio){
            return '#f5e67b';
        }else{
            return '#d5420b';
        }
    };


    // Aqui guardamos la nueva tarea
    function guardarTarea(tarea, descripcion, prioridad){
            porDefecto();
            // volcamos en la variable existeTareas desde el localstorage el item con el nombre 'tareas'
            let existeTareas = localStorage.getItem('tareas'); 
            // creamos una varible de tipo array y colocamos los valores
            let datos = [tarea, descripcion, prioridad, pendiente]
            // Nos pregunatamos si existe el key o el item con el nombre 'tareas' dentro del localStorage
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

    // Esta funcion se dispara cuando ingresamos dentro de registrar tareas, mostrando las ultimas tres, si es que existe
    function agregarUltimasTareasCreadas(){
        limpiarTareas();
        let tareasLocalStorage = localStorage.getItem('tareas');
        if (tareasLocalStorage !== null){
            tareasLocalStorage = JSON.parse(tareasLocalStorage).slice(-3);
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



    // Aqui obtenemos las tareas existentes dentro del localstorage
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
        };


    // con esta funcion limpiamos los contenedores en los cuales mostramos las tareas pendientes, terminadas y las ultimas agregadas
    function limpiarTareas(){
        CONTENEDORPendientes.innerHTML = '';
        CONTENEDORTerminadas.innerHTML = '';
        CONTENEDORUltimasAgregadas.innerHTML = '';
    }

    // Aqui cambiamos el estado de una tarea
    function cambiarEstado(id){
        let tareasLocalStorage = localStorage.getItem('tareas');
        tareasLocalStorage = JSON.parse(tareasLocalStorage);
        tareasLocalStorage[id][3] = tareasLocalStorage[id][3] == true? false : true;
        localStorage.setItem('tareas', JSON.stringify(tareasLocalStorage));
        if(seccion == 'pagina3'){
            limpiarTareas();
            obtenerTareas();
        }else{
            agregarUltimasTareasCreadas();
        }
    }

    // aqui eliminamos una tarea, recibiendo como parametro el id, que no es mas que la posicion de la tarea en el array devuelto por el localstorage
    function eliminarTarea(id){
        let tareasLocalStorage = localStorage.getItem('tareas');
        tareasLocalStorage = JSON.parse(tareasLocalStorage);
        tareasLocalStorage.splice(id,1);
        localStorage.setItem('tareas', JSON.stringify(tareasLocalStorage));
        limpiarTareas();
        obtenerTareas(); 
    }


    // En esta funcion, tomamos el evento click ocurrido entro del document
    document.addEventListener('click', (evento)=>{
        // obtenemos el elemento en el cual se ha realizado click
        let elemento = evento.target;
        let id = elemento.dataset.id;
        // Aqui comparamos si se ha realizado en el elemento que corresponde al boton eliminar, pendiente y X, para eliminar o cambiar el estado de una tarea
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
        let tituloPendientes = document.createElement('h3');
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
        botonXPendientes.classList.add('botonX');
        botonXPendientes.setAttribute('data-id', id);

        let divSeccionBotonPendientes = document.createElement('div');
        divSeccionBotonPendientes.appendChild(botonXPendientes);

        botonCerrarPendientes.appendChild(divSeccionBotonPendientes);


        let botonTerminarPendientes = document.createElement('button');
        botonTerminarPendientes.setAttribute('data-id', id);
        botonTerminarPendientes.classList.add('botonEstado');
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
