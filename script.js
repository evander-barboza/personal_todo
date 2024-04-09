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

const API_BASE_URL = 'https://crudcrud.com/api/f554b969c6574df7943d14cf334cfb52';

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

inputTarefaNomeEdicao.addEventListener('keypress', (e) => {
    if(e.keyCode == 13) {
        e.preventDefault();

        let idTarefa = idTarefaEdicao.innerHTML.replace('#', '');

        let tarefa = {
            nome: inputTarefaNomeEdicao.value,
        }

        atualizarTarefaAPI(idTarefa, tarefa);
    }
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

    if (!tarefa.nome.trim()) {
        alert('Por favor, insira um nome para a tarefa.');
        return; // Retorna sem fazer nada se o nome da tarefa estiver vazio
    }

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

    if (!tarefa.nome.trim()) {
        alert('Por favor, insira um nome para a tarefa.');
        return; // Retorna sem fazer nada se o nome da tarefa estiver vazio
    }
    
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

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkboxTarefa');
    checkbox.setAttribute('onclick', 'marcarConcluido("' + tarefa._id + '")');

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

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(div);
    return li;
}

function marcarConcluido(idTarefa) {
    let li = document.getElementById(idTarefa);
    if (li) {
        let checkbox = li.querySelector('.checkboxTarefa');
        let textoTarefa = li.querySelector('.textoTarefa');
        if (checkbox.checked) {
            textoTarefa.style.textDecoration = 'line-through';
        } else {
            textoTarefa.style.textDecoration = 'none';
        }
    }
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

// Função para atualizar o horário
function atualizarHorario() {
    const hour = new Date();
    const optionsHour = { hour: 'numeric', minute: 'numeric' };
    document.getElementById('hour').textContent = hour.toLocaleTimeString('en-US', optionsHour);
}

// Função para atualizar a data
function atualizarData() {
    const date = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date').textContent = date.toLocaleDateString('en-US', options);
}

// Chama a função de atualização do horário imediatamente ao carregar a página
atualizarHorario();

// Agenda a função de atualização do horário para ser chamada a cada minuto (60000 milissegundos)
setInterval(atualizarHorario, 60000);

// Chama a função de atualização da data imediatamente ao carregar a página
atualizarData();

// Agenda a função de atualização da data para ser chamada a cada 24 horas (86400000 milissegundos)
setInterval(atualizarData, 86400000);

// Função para editar uma tarefa
function editar(idTarefa) {
    let li = document.getElementById(idTarefa);
    if (li) {
        // Substituir o conteúdo de idTarefaEdicao pelo ID da tarefa
        idTarefaEdicao.innerHTML = '#' + idTarefa;

        idTarefaEdicao.style.display = 'none';

        // Preencher o campo de entrada com o nome atual da tarefa
        let nomeTarefa = li.querySelector('.textoTarefa').innerText;
        inputTarefaNomeEdicao.value = nomeTarefa;

        // Exibir a janela de edição
        alternarJanelaEdicao();
    } else {
        alert('Elemento HTML não encontrado');
    }
}

window.addEventListener('load', carregarTarefasAPI);
