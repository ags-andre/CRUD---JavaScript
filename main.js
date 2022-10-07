//CRUD
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [];
const setLocalStorage = (db_client) => localStorage.setItem('db_client', JSON.stringify(db_client));

//CRUD - CREATE
const createCliente = (client) => {
    const db_client = getLocalStorage()
    //tem que buscar o que ja existe no banco primeiro, senao ele vai substituir o que ja existe pelo novo
    //tambem verifica se existe valor no banco. caso nao exista, ele inicia como array vazio
    db_client.push(client)
    setLocalStorage(db_client);
}

//CRUD - READ
const readClient = () => getLocalStorage();

//CRUD - UPDATE
const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient);
    updateTable();
}

//CRUD - DELETE
const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1); //o 1 diz a respeito de quantas casas é pra apagar, e nesse caso, apenas o do index
    setLocalStorage(dbClient);
    updateTable();
}

//interação com layout
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = '')
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        let index = document.getElementById('nome').dataset.index;

        if (index == 'new') {
            createCliente(client);
        }
        else {
            updateClient(index, client)
            document.getElementById('nome').dataset.index = 'new';
        }

        updateTable();
        closeModal();
    }
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome;
    document.getElementById('email').value = client.email;
    document.getElementById('celular').value = client.celular;
    document.getElementById('cidade').value = client.cidade;
}

const editClient = (index) => {
    document.getElementById('nome').dataset.index = index;
    const client = readClient()[index];
    fillFields(client);
    openModal();
    document.querySelector('.modal-header > h2').innerHTML = 'Editar Cliente';
}

const clearTable = () => {
    const rows = document.querySelectorAll('#table_client>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row))
}
const updateTable = () => {
    let index = 0;
    const dbClient = readClient();
    clearTable()
    dbClient.forEach(client => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td data-label="Nome">${client.nome}</td>
            <td data-label="Email">${client.email}</td>
            <td data-label="Celular">${client.celular}</td>
            <td data-label="Cidade">${client.cidade}</td>
            <td data-label="Ação">
                <div class="btns">
                    <button class="btn-editarSalvar" onclick="editClient(${index})">Editar</button>
                    <button class="btn-excluirCancelar" onclick="deleteClient(${index})">Excluir</button>
                </div>
            </td>
        `;
        document.querySelector('#table_client>tbody').appendChild(newRow);
        index++;
    })
}

updateTable();

//eventos
const openModal = () => {
    modal.classList.add('active');
    document.querySelector('.modal-header > h2').innerHTML = 'Cadastrar Cliente';
};

const closeModal = () => {
    clearFields();
    modal.classList.remove('active');
}

const btnCadastrarCliente = document.getElementById('cadastrarCliente').addEventListener('click', openModal);

const btnCloseModal = document.getElementById('modalClose').addEventListener('click', closeModal);

const btnSalvar = document.getElementById('salvar').addEventListener('click', saveClient);

const modal = document.getElementById('modal')