document.getElementById('create-board').addEventListener('click', createBoard);

// Fonction pour créer un tableau
function createBoard() {
    const boardTitle = prompt('Enter board title:');
    if (!boardTitle) return;

    const board = {
        id: Date.now(),
        title: boardTitle,
        lists: []
    };

    saveBoard(board);
    renderBoards();
}

// Fonction pour créer une liste dans un tableau
function createList(boardId) {
    const listTitle = prompt('Enter list title:');
    if (!listTitle) return;

    const list = {
        id: Date.now(),
        title: listTitle,
        cards: []
    };

    const boards = getBoards();
    const board = boards.find(b => b.id === boardId);
    board.lists.push(list);

    saveBoards(boards);
    renderBoards();
}

// Fonction pour créer une carte dans une liste
function createCard(boardId, listId) {
    const cardText = prompt('Enter card text:');
    if (!cardText) return;

    const card = {
        id: Date.now(),
        text: cardText
    };

    const boards = getBoards();
    const board = boards.find(b => b.id === boardId);
    const list = board.lists.find(l => l.id === listId);
    list.cards.push(card);

    saveBoards(boards);
    renderBoards();
}

// Fonction pour rendre les tableaux à partir de localStorage
function renderBoards() {
    const boardsContainer = document.getElementById('boards-container');
    boardsContainer.innerHTML = '';

    const boards = getBoards();

    boards.forEach(board => {
        const boardElement = document.createElement('div');
        boardElement.className = 'board';
        boardElement.dataset.id = board.id;

        const boardHeader = document.createElement('div');
        boardHeader.className = 'board-header';

        const title = document.createElement('h2');
        title.className = 'board-title';
        title.textContent = board.title;

        const titleEdit = document.createElement('input');
        titleEdit.className = 'board-title-edit';
        titleEdit.value = board.title;
        titleEdit.addEventListener('change', () => editBoardTitle(board.id, titleEdit.value));

        const addListBtn = document.createElement('button');
        addListBtn.textContent = 'Add List';
        addListBtn.addEventListener('click', () => createList(board.id));

        const deleteBoardBtn = document.createElement('button');
        deleteBoardBtn.className = 'delete-button';
        deleteBoardBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBoardBtn.addEventListener('click', () => deleteBoard(board.id));

        boardHeader.appendChild(title);
        boardHeader.appendChild(titleEdit);
        boardHeader.appendChild(addListBtn);
        boardHeader.appendChild(deleteBoardBtn);
        boardElement.appendChild(boardHeader);

        board.lists.forEach(list => {
            const listElement = document.createElement('div');
            listElement.className = 'list';
            listElement.dataset.id = list.id;

            const listTitle = document.createElement('h3');
            listTitle.textContent = list.title;

            const listTitleEdit = document.createElement('input');
            listTitleEdit.className = 'list-title-edit';
            listTitleEdit.value = list.title;
            listTitleEdit.addEventListener('change', () => editListTitle(board.id, list.id, listTitleEdit.value));

            const addCardBtn = document.createElement('button');
            addCardBtn.textContent = 'Add Card';
            addCardBtn.addEventListener('click', () => createCard(board.id, list.id));

            const deleteListBtn = document.createElement('button');
            deleteListBtn.className = 'delete-button';
            deleteListBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteListBtn.addEventListener('click', () => deleteList(board.id, list.id));

            listElement.appendChild(listTitle);
            listElement.appendChild(listTitleEdit);
            listElement.appendChild(addCardBtn);
            listElement.appendChild(deleteListBtn);

            list.cards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.dataset.id = card.id;
                cardElement.textContent = card.text;

                listElement.appendChild(cardElement);
            });

            boardElement.appendChild(listElement);
        });

        boardsContainer.appendChild(boardElement);
    });
}

// Fonction pour éditer le titre d'un tableau
function editBoardTitle(boardId, newTitle) {
    const boards = getBoards();
    const board = boards.find(b => b.id === boardId);
    board.title = newTitle;

    saveBoards(boards);
    renderBoards();
}

// Fonction pour éditer le titre d'une liste
function editListTitle(boardId, listId, newTitle) {
    const boards = getBoards();
    const board = boards.find(b => b.id === boardId);
    const list = board.lists.find(l => l.id === listId);
    list.title = newTitle;

    saveBoards(boards);
    renderBoards();
}

// Fonction pour supprimer un tableau
function deleteBoard(boardId) {
    let boards = getBoards();
    boards = boards.filter(b => b.id !== boardId);

    saveBoards(boards);
    renderBoards();
}

// Fonction pour supprimer une liste
function deleteList(boardId, listId) {
    const boards = getBoards();
    const board = boards.find(b => b.id === boardId);
    board.lists = board.lists.filter(l => l.id !== listId);

    saveBoards(boards);
    renderBoards();
}

// Fonction pour récupérer les tableaux depuis le localStorage
function getBoards() {
    return JSON.parse(localStorage.getItem('boards')) || [];
}

// Fonction pour sauvegarder les tableaux dans le localStorage
function saveBoard(board) {
    const boards = getBoards();
    boards.push(board);
    saveBoards(boards);
}

// Fonction pour sauvegarder les tableaux dans le localStorage
function saveBoards(boards) {
    localStorage.setItem('boards', JSON.stringify(boards));
}

// Rendre les tableaux au chargement de la page
renderBoards();
