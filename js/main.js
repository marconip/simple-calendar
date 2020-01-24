function pega(x) {
    return document.querySelector(x);
};

$(function() {
    $('[data-toggle="tooltip"]').tooltip()
})

var tempo = new Date();
var dia = tempo.getDate();
var semana = tempo.getDay();
var mes = tempo.getMonth();
var ano = tempo.getFullYear();
var meses = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var semanas = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

pega('.semana').innerHTML = semanas[semana];
pega('.mes').innerHTML = meses[mes];
pega('.ano').innerHTML = ano;
pega('.hoje').innerHTML = dia;

for (i = 1; i <= 31; i++) {
    if (i === dia)
        pega('.dias').innerHTML += '<li data-toggle="tooltip" data-html="true" class="notas-hoje">' + i + '</li>';
    else
        pega('.dias').innerHTML += '<li data-toggle="tooltip" data-html="true">' + i + '</li>';
}

setInterval(function() {
    tempo = new Date();
    var hora = tempo.getHours();
    var min = tempo.getMinutes();
    var sec = tempo.getSeconds();

    if (hora < 10)
        hora = "0" + hora;
    if (min < 10)
        min = "0" + min;
    if (sec < 10)
        sec = "0" + sec;

    pega('.hora').innerHTML = hora + ':' + min + ':' + sec;
    pega('.anotacoes').innerHTML = "Today: " + pega('.notas-hoje').dataset.originalTitle;
}, 1000);

var listaDias = document.querySelectorAll('.dias li')
diaEscolhido = pega('.dia-escolhido')
textoAnotado = pega('textarea')

function funcAnotar() {
    if (textoAnotado.value == "" || diaEscolhido.value == "" || diaEscolhido.value < 1 || diaEscolhido.value > 31) {
        $('#alerta').modal('show')
        return
    }

    salvarEvento({
        anotacoes: [textoAnotado.value],
        dia: parseInt(diaEscolhido.value)
    })

    diaEscolhido.value = ""
    textoAnotado.value = ""

    carregarTooltipDias()
}

function carregarTooltipDias() {
    const eventos = obterTodosEventos()

    listaDias.forEach(function(e) {
        e.dataset.originalTitle = ''
        const dia = parseInt(e.innerHTML)
        const evento = eventos.find(p => p.dia === dia)
        if (evento) {
            evento.anotacoes.forEach(anotacao => {
                e.dataset.originalTitle += `<p>${anotacao}</p>`
            });
        } else {
            e.dataset.originalTitle = 'Day off'
        }
    })
}

function salvarEvento(novoEvento) {
    let eventos = obterTodosEventos()

    const eventoExiste = eventos.find(p => p.dia === novoEvento.dia)

    if (!eventoExiste) {
        eventos.push(novoEvento)
    } else {
        eventos = eventos.map(evento => {
            if (evento.dia === novoEvento.dia) {
                const anotacoes = evento.anotacoes.concat(novoEvento.anotacoes)
                evento = {
                    ...evento,
                    anotacoes
                }
            }
            return evento
        })
    }
    localStorage.setItem('eventos', JSON.stringify(eventos))
}

pega('.btn-sim').onclick = function() {
    window.localStorage.clear();
    window.location.reload()
}

pega('.color-red').onclick = function() {
    setarTema()
    localStorage.setItem('tema', 'red')
}
pega('.color-green').onclick = function() {
    setarTema('green')
    localStorage.setItem('tema', 'green')
}
pega('.color-blue').onclick = function() {
    setarTema('blue')
    localStorage.setItem('tema', 'blue')
}
pega('.color-pink').onclick = function() {
    setarTema('pink')
    localStorage.setItem('tema', 'pink')
}
pega('.color-dark').onclick = function() {
    setarTema('dark')
    localStorage.setItem('tema', 'dark')
}

function setarTema(tema = 'red') {
    pega('body').removeAttribute('class')
    pega('body').classList.add(tema)
}

function obterTodosEventos() {
    const eventos = localStorage.getItem('eventos')
    return eventos ? JSON.parse(eventos) : []
}

window.onload = () => {
    carregarTooltipDias()

    const tema = localStorage.getItem('tema');
    if (tema == null)
        setarTema()
    else
        setarTema(tema);
}