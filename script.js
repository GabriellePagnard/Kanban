document.getElementById('create-board').addEventListener('click', createBoard);

function createBoard() {
    const boardTitle = prompt('Enter board title:');
    if (!boardTitle) return;

    const board = document.createElement('div');
    board.className = 'board';

    const boardHeader = document.createElement('div');
    boardHeader.className = 'board-header';

    const title = document.createElement('h2');
    title.className = 'board-title';
    title.textContent = boardTitle;

    const addListBtn = document.createElement('button');
    addListBtn.textContent = 'Add List';
    addListBtn.addEventListener('click', () => createList(board));

    boardHeader.appendChild(title);
    boardHeader.appendChild(addListBtn);
    board.appendChild(boardHeader);

    document.getElementById('boards-container').appendChild(board);
}

function createList(board) {
    const listTitle = prompt('Enter list title:');
    if (!listTitle) return;

    const list = document.createElement('div');
    list.className = 'list';

    const title = document.createElement('h3');
    title.textContent = listTitle;

    const addCardBtn = document.createElement('button');
    addCardBtn.textContent = 'Add Card';
    addCardBtn.addEventListener('click', () => createCard(list));

    list.appendChild(title);
    list.appendChild(addCardBtn);

    board.appendChild(list);
}

function createCard(list) {
    const cardText = prompt('Enter card text:');
    if (!cardText) return;

    const card = document.createElement('div');
    card.className = 'card';
    card.textContent = cardText;

    list.appendChild(card);
}
