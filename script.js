
// Esperamos hasta tanto se cargue completamente la pagina
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionamos el el submit y el campo input donde se escribe la nueva tarea
    let contador = 0;
    const SUBMIT = document.querySelector('#submit');
    const NUEVATarea = document.querySelector('#tarea');
    const DESCRIPCION = document.querySelector('#descripcion');
    const SELECT = document.querySelector('select');
    const BOTONPagina = document.querySelectorAll('.botonPag');
    const PAGINAS = document.querySelectorAll('.paginas')
    let pendiente = true
    const PRIORIDADES = {
        normal: 'NORMAL',
        medio: 'MEDIO',
        urgente: 'URGENTE'
    };

    let prioridad = PRIORIDADES.normal;
    let tareas = [];

    window.onpopstate = function(event) {
        ocultarPagina();
        cambiarPagina('pagina1');
    };
    
    function cambiarPagina(pagina){
        ocultarPagina();
        document.getElementById(`${pagina}`).style.display = 'block'
    };

    function ocultarPagina(){
        PAGINAS.forEach(pagina =>{
            pagina.style.display = 'none';
        })
    };

    cambiarPagina('pagina1');

    BOTONPagina.forEach(boton=>{
        boton.onclick = function(){
            const seccion = this.dataset.pagina;
            // Agregamos al historial del navegador
            // history.pushState({section: seccion}, "", `/${seccion == 'pagina2'? 'registroTareas':'tareas'}`);
            if(seccion == 'pagina2'){
                agregarUltimasTareasCreadas()
            }
            cambiarPagina(seccion);
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
        NUEVATarea.value = '';
        DESCRIPCION.value = '';
        SELECT.value = 'normal';
        SUBMIT.disabled = true;
    };

    porDefecto();


    function obtenerColor(prioridad){
        if(prioridad == PRIORIDADES.normal){
            return 'grey';
        }else if(prioridad == PRIORIDADES.medio){
            return 'yellow';
        }else{
            return 'red';
        }
    };

    function guardarTarea(tarea, descripcion, prioridad){
            let existeTareas = localStorage.getItem('tareas'); 
            let datos = [tarea, descripcion, prioridad, true]
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
        document.querySelector('#recienCreadas').innerHTML = '';
        let tareasLocalStorage =  JSON.parse(localStorage.getItem('tareas')).reverse();
        for(let i = 0; i <= 2; i++){
                let tarea = tareasLocalStorage[i][0];
                let color = obtenerColor(tareasLocalStorage[i][2]);
                let prioridadTemp = tareasLocalStorage[i][2]
                // Creamos un elemento p y lo agreagamos a la seccion 
                const P = document.createElement('p');
                P.innerHTML = `Nombre:  ${ tarea  }` + "  Prioridad: " + "  "+ `<span style=color:${color}>`+ `${prioridadTemp}</span>`;
                // Luego agregamos la tarea dentro del la <ul></ul>
                document.querySelector('#recienCreadas').append(P);   
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
    })
});
