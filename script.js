const hour = new Date();
const optionsHour = {hour: 'numeric', minute: 'numeric'};
document.getElementById('hour').textContent = hour.toLocaleTimeString('en-US', optionsHour);

const date = new Date();
const options = {weekday: 'long', month: 'long', day: 'numeric'};
document.getElementById('date').textContent = date.toLocaleDateString('en-US', options);

let inputNovaTarefa = document.querySelector('#inputNovaTarefa');
let btnAddTarefa = document.querySelector('#btnAddTarefa');
let listaTarefas = document.querySelector('#listaTarefas');
let janelaEdicao = document.querySelector('#janelaEdicao');
let janelaEdicaoFundo = document.querySelector('#janelaEdicaoFundo');
let janelaEdicaoBtnFechar = document.querySelector('#janelaEdicaoBtnFechar');
let btnAtualizarTarefa = document.querySelector('#btnAtualizarTarefa');
let idTarefaEdicao = document.querySelector('#idTarefaEdicao');
let inputTarefaNomeEdicao = document.querySelector('#inputTarefaNomeEdicao');

const API_BASE_URL = 'https://crudcrud.com/api/ad8dbc971802466b8fc26dc754738bfc';

inputNovaTarefa.addEventListener('keypress', (e) => {
    if(e.keyCode == 13) {
        let tarefa = {
            nome: inputNovaTarefa.value,
        }
        adicionarTarefaAPI(tarefa);
    }
});

janelaEdicaoBtnFechar.addEventListener('click', (e) => {
    alternarJanelaEdicao();
})

btnAddTarefa.addEventListener('click', (e) => {
    let tarefa = {
        nome: inputNovaTarefa.value,
    }
    adicionarTarefaAPI(tarefa);
});

btnAtualizarTarefa.addEventListener('click', (e) => {
    e.preventDefault();

    let idTarefa = idTarefaEdicao.innerHTML.replace('#', '');

    let tarefa = {
        nome: inputTarefaNomeEdicao.value,
    }

    atualizarTarefaAPI(idTarefa, tarefa);
})

function adicionarTarefaAPI(tarefa) {
    fetch(API_BASE_URL + '/tarefas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarefa),
    })
    .then(response => response.json())
    .then(data => {
        adicionarTarefaDOM(data);
        inputNovaTarefa.value = '';
    })
    .catch(error => console.error('Erro ao adicionar tarefa:', error));
}

function carregarTarefasAPI() {
    fetch(API_BASE_URL + '/tarefas')
    .then(response => response.json())
    .then(data => data.forEach(tarefa => adicionarTarefaDOM(tarefa)))
    .catch(error => console.error('Erro ao carregar tarefas:', error));
}

function atualizarTarefaAPI(id, tarefa) {
    fetch(API_BASE_URL + '/tarefas/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarefa),
    })
    .then(() => atualizarTarefaDOM(id, tarefa))
    .catch(error => console.error('Erro ao atualizar tarefa:', error));
}

function excluirTarefaAPI(id) {
    fetch(API_BASE_URL + '/tarefas/' + id, {
        method: 'DELETE',
    })
    .then(() => excluirTarefaDOM(id))
    .catch(error => console.error('Erro ao excluir tarefa:', error));
}

function adicionarTarefaDOM(tarefa) {
    let li = criarTagLI(tarefa);
    listaTarefas.appendChild(li);
}

function criarTagLI(tarefa) {
    let li = document.createElement('li');
    li.id = tarefa._id;

    let span = document.createElement('span');
    span.classList.add('textoTarefa');
    span.innerHTML = tarefa.nome;

    let div = document.createElement('div');

    let btnEditar = document.createElement('button');
    btnEditar.classList.add('btnAcao');
    btnEditar.innerHTML = '<i class="fa fa-pencil"></i>';
    btnEditar.setAttribute('onclick', 'editar("' + tarefa._id + '")');

    let btnExcluir = document.createElement('button');
    btnExcluir.classList.add('btnAcao');
    btnExcluir.innerHTML = '<i class="fa fa-trash"></i>';
    btnExcluir.setAttribute('onclick', 'excluir("' + tarefa._id + '")');
    btnExcluir.onclick = () => excluirTarefaAPI(tarefa._id);    

    div.appendChild(btnEditar);
    div.appendChild(btnExcluir);

    li.appendChild(span);
    li.appendChild(div);
    return li;
}

function editar(idTarefa) {
    let li = document.getElementById(idTarefa);
    if(li) {
        idTarefaEdicao.innerHTML = '#' + idTarefa;
        alternarJanelaEdicao();
    } else {
        alert('Elemento HTML não encontrado');
    }
}

function atualizarTarefaDOM(idTarefa, tarefa) {
    let li = document.getElementById(idTarefa);
    if(li) {
        li.querySelector('.textoTarefa').innerText = tarefa.nome;
        alternarJanelaEdicao();
    }
}

function excluirTarefaDOM(idTarefa) {
    let li = document.getElementById(idTarefa);
    if(li) {
        listaTarefas.removeChild(li);
    }
}

function alternarJanelaEdicao() {
    janelaEdicao.classList.toggle('abrir');
    janelaEdicaoFundo.classList.toggle('abrir');
}

window.addEventListener('load', carregarTarefasAPI);
