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

    const card = {
        id: Date.now(),
        text: cardText,
        description: '',
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

        const addListBtn = document.createElement('button');
        addListBtn.textContent = 'Ajouter Liste';
        addListBtn.className = 'bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600';
        addListBtn.addEventListener('click', () => createList(board.id));

        boardHeader.appendChild(title);
        boardHeader.appendChild(addListBtn);
        boardElement.appendChild(boardHeader);

        board.lists.forEach(list => {
            const listElement = document.createElement('div');
            listElement.className = 'list p-2 bg-gray-100 rounded mt-4';

            const listTitle = document.createElement('h3');
            listTitle.textContent = list.title;
            listTitle.className = 'text-lg font-semibold text-gray-800';

            const addCardBtn = document.createElement('button');
            addCardBtn.textContent = 'Ajouter Carte';
            addCardBtn.className = 'bg-blue-500 text-white px-2 py-1 mt-2 rounded hover:bg-blue-600';
            addCardBtn.addEventListener('click', () => createCard(board.id, list.id));

            listElement.appendChild(listTitle);
            listElement.appendChild(addCardBtn);

            list.cards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.className = `card p-2 mt-2 rounded shadow ${card.color}`;
                cardElement.textContent = card.text;
                cardElement.draggable = true;

                cardElement.addEventListener('dragstart', () => {
                    cardElement.classList.add('dragging');
                });

                cardElement.addEventListener('dragend', () => {
                    cardElement.classList.remove('dragging');
                });

                cardElement.addEventListener('click', () => editCard(board.id, list.id, card.id));

                listElement.appendChild(cardElement);
            });

            listElement.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingCard = document.querySelector('.dragging');
                if (draggingCard) {
                    listElement.appendChild(draggingCard);
                }
            });

            boardElement.appendChild(listElement);
        });

        boardsContainer.appendChild(boardElement);
    });
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
