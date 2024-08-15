document.getElementById('create-board').addEventListener('click', createBoard);

function createBoard() {
    const boardTitle = prompt('Entrez le titre du tableau :');
    if (!boardTitle) return;

    const board = {
        id: Date.now(),
        title: boardTitle,
        lists: []
    };

    saveBoard(board);
    renderBoards();
}

function createList(boardId) {
    const listTitle = prompt('Entrez le titre de la liste :');
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

function createCard(boardId, listId) {
    const cardText = prompt('Entrez le texte de la carte :');
    if (!cardText) return;

    const cardDescription = prompt('Entrez une description pour la carte :');

    const card = {
        id: Date.now(),
        text: cardText,
        description: cardDescription || '',
        color: 'bg-white'
    };

    const boards = getBoards();
    const board = boards.find(b => b.id === boardId);
    const list = board.lists.find(l => l.id === listId);
    list.cards.push(card);

    saveBoards(boards);
    renderBoards();
}

function editCard(boardId, listId, cardId) {
    const boards = getBoards();
    const board = boards.find(b => b.id === boardId);
    const list = board.lists.find(l => l.id === listId);
    const card = list.cards.find(c => c.id === cardId);

    const newText = prompt('Modifier le texte de la carte:', card.text);
    if (newText !== null) card.text = newText;

    const newDescription = prompt('Modifier la description de la carte:', card.description);
    if (newDescription !== null) card.description = newDescription;

    const newColor = prompt('Modifier la couleur de la carte (classes Tailwind, ex: bg-red-500):', card.color);
    if (newColor !== null) card.color = newColor;

    saveBoards(boards);
    renderBoards();
}

function deleteCard(boardId, listId, cardId) {
    const boards = getBoards();
    const board = boards.find(b => b.id === boardId);
    const list = board.lists.find(l => l.id === listId);
    list.cards = list.cards.filter(c => c.id !== cardId);

    saveBoards(boards);
    renderBoards();
}

function editList(boardId, listId) {
    const boards = getBoards();
    const board = boards.find(b => b.id === boardId);
    const list = board.lists.find(l => l.id === listId);

    const newTitle = prompt('Modifier le titre de la liste:', list.title);
    if (newTitle !== null) list.title = newTitle;

    saveBoards(boards);
    renderBoards();
}

function deleteList(boardId, listId) {
    const boards = getBoards();
    const board = boards.find(b => b.id === boardId);
    board.lists = board.lists.filter(l => l.id !== listId);

    saveBoards(boards);
    renderBoards();
}

function editBoard(boardId) {
    const boards = getBoards();
    const board = boards.find(b => b.id === boardId);

    const newTitle = prompt('Modifier le titre du tableau:', board.title);
    if (newTitle !== null) board.title = newTitle;

    saveBoards(boards);
    renderBoards();
}

function deleteBoard(boardId) {
    let boards = getBoards();
    boards = boards.filter(b => b.id !== boardId);

    saveBoards(boards);
    renderBoards();
}

function renderBoards() {
    const boardsContainer = document.getElementById('boards-container');
    boardsContainer.innerHTML = '';

    const boards = getBoards();

    boards.forEach(board => {
        const boardElement = document.createElement('div');
        boardElement.className = 'board p-4';

        const boardHeader = document.createElement('div');
        boardHeader.className = 'board-header flex justify-between items-center';

        const title = document.createElement('h2');
        title.className = 'board-title text-xl font-bold text-gray-700';
        title.textContent = board.title;

        const editBoardBtn = document.createElement('button');
        editBoardBtn.textContent = '✏️';
        editBoardBtn.className = 'emoji-button text-blue-500';

        const deleteBoardBtn = document.createElement('button');
        deleteBoardBtn.textContent = '🗑️';
        deleteBoardBtn.className = 'emoji-button text-red-500';

        const addListBtn = document.createElement('button');
        addListBtn.textContent = '➕';
        addListBtn.className = 'emoji-button text-green-500';

        editBoardBtn.addEventListener('click', () => editBoard(board.id));
        deleteBoardBtn.addEventListener('click', () => deleteBoard(board.id));
        addListBtn.addEventListener('click', () => createList(board.id));

        boardHeader.appendChild(title);
        boardHeader.appendChild(editBoardBtn);
        boardHeader.appendChild(deleteBoardBtn);
        boardHeader.appendChild(addListBtn);
        boardElement.appendChild(boardHeader);

        board.lists.forEach(list => {
            const listElement = document.createElement('div');
            listElement.className = 'list p-2 bg-gray-100 rounded mt-4';

            const listHeader = document.createElement('div');
            listHeader.className = 'list-header flex justify-between items-center';

            const listTitle = document.createElement('h3');
            listTitle.textContent = list.title;
            listTitle.className = 'text-lg font-semibold text-gray-800';

            const editListBtn = document.createElement('button');
            editListBtn.textContent = '✏️';
            editListBtn.className = 'emoji-button text-blue-500';

            const deleteListBtn = document.createElement('button');
            deleteListBtn.textContent = '🗑️';
            deleteListBtn.className = 'emoji-button text-red-500';

            const addCardBtn = document.createElement('button');
            addCardBtn.textContent = '➕';
            addCardBtn.className = 'emoji-button text-green-500';

            editListBtn.addEventListener('click', () => editList(board.id, list.id));
            deleteListBtn.addEventListener('click', () => deleteList(board.id, list.id));
            addCardBtn.addEventListener('click', () => createCard(board.id, list.id));

            listHeader.appendChild(listTitle);
            listHeader.appendChild(editListBtn);
            listHeader.appendChild(deleteListBtn);
            listHeader.appendChild(addCardBtn);
            listElement.appendChild(listHeader);

            list.cards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.className = `card p-2 mt-2 rounded shadow ${card.color}`;
                cardElement.draggable = true;

                const cardHeader = document.createElement('div');
                cardHeader.className = 'card-header flex justify-between items-center';

                const cardText = document.createElement('div');
                cardText.textContent = card.text;

                const cardDescription = document.createElement('div');
                cardDescription.className = 'card-description';
                cardDescription.textContent = card.description;

                const editCardBtn = document.createElement('button');
                editCardBtn.textContent = '✏️';
                editCardBtn.className = 'emoji-button text-blue-500';

                const deleteCardBtn = document.createElement('button');
                deleteCardBtn.textContent = '🗑️';
                deleteCardBtn.className = 'emoji-button text-red-500';

                editCardBtn.addEventListener('click', () => editCard(board.id, list.id, card.id));
                deleteCardBtn.addEventListener('click', () => deleteCard(board.id, list.id, card.id));

                cardHeader.appendChild(cardText);
                cardHeader.appendChild(editCardBtn);
                cardHeader.appendChild(deleteCardBtn);

                cardElement.appendChild(cardHeader);
                if (card.description) {
                    cardElement.appendChild(cardDescription);
                }

                cardElement.addEventListener('dragstart', () => {
                    cardElement.classList.add('dragging');
                });

                cardElement.addEventListener('dragend', () => {
                    cardElement.classList.remove('dragging');
                });

                listElement.appendChild(cardElement);
            });

            listElement.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingCard = document.querySelector('.dragging');
                const afterElement = getDragAfterElement(listElement, e.clientY);
                if (afterElement == null) {
                    listElement.appendChild(draggingCard);
                } else {
                    listElement.insertBefore(draggingCard, afterElement);
                }
            });

            boardElement.appendChild(listElement);
        });

        boardsContainer.appendChild(boardElement);
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function getBoards() {
    return JSON.parse(localStorage.getItem('boards')) || [];
}

function saveBoard(board) {
    const boards = getBoards();
    boards.push(board);
    saveBoards(boards);
}

function saveBoards(boards) {
    localStorage.setItem('boards', JSON.stringify(boards));
}

renderBoards();
