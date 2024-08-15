document.getElementById('create-board').addEventListener('click', createBoard);

let draggedCard = null;
let touchStartY = 0;
let touchMoveY = 0;

/**
 * Crée un nouveau tableau et l'enregistre dans le stockage local.
 */
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

/**
 * Crée une nouvelle liste pour un tableau donné.
 * @param {number} boardId - L'identifiant du tableau auquel ajouter la liste.
 */
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

/**
 * Crée une nouvelle carte pour une liste donnée dans un tableau.
 * @param {number} boardId - L'identifiant du tableau contenant la liste.
 * @param {number} listId - L'identifiant de la liste à laquelle ajouter la carte.
 */
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

/**
 * Gère l'affichage des tableaux et permet le drag-and-drop pour les cartes.
 */
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
        addListBtn.textContent = '➕';
        addListBtn.className = 'emoji-button text-green-500';
        addListBtn.addEventListener('click', () => createList(board.id));

        boardHeader.appendChild(title);
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

            const addCardBtn = document.createElement('button');
            addCardBtn.textContent = '➕';
            addCardBtn.className = 'emoji-button text-green-500';
            addCardBtn.addEventListener('click', () => createCard(board.id, list.id));

            listHeader.appendChild(listTitle);
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

                cardHeader.appendChild(cardText);
                cardElement.appendChild(cardHeader);
                cardElement.appendChild(cardDescription);

                cardElement.addEventListener('dragstart', (e) => {
                    draggedCard = cardElement;
                    e.target.classList.add('dragging');
                });

                cardElement.addEventListener('dragend', (e) => {
                    draggedCard = null;
                    e.target.classList.remove('dragging');
                });

                // Gestion des événements tactiles pour mobile
                cardElement.addEventListener('touchstart', (e) => {
                    touchStartY = e.touches[0].clientY;
                    draggedCard = cardElement;
                    e.target.classList.add('dragging');
                });

                cardElement.addEventListener('touchmove', (e) => {
                    touchMoveY = e.touches[0].clientY;
                    const afterElement = getDragAfterElement(listElement, touchMoveY);
                    if (afterElement == null) {
                        listElement.appendChild(draggedCard);
                    } else {
                        listElement.insertBefore(draggedCard, afterElement);
                    }
                });

                cardElement.addEventListener('touchend', (e) => {
                    draggedCard = null;
                    e.target.classList.remove('dragging');
                });

                listElement.appendChild(cardElement);
            });

            listElement.addEventListener('dragover', (e) => {
                e.preventDefault();
                const afterElement = getDragAfterElement(listElement, e.clientY);
                if (afterElement == null) {
                    listElement.appendChild(draggedCard);
                } else {
                    listElement.insertBefore(draggedCard, afterElement);
                }
            });

            boardElement.appendChild(listElement);
        });

        boardsContainer.appendChild(boardElement);
    });
}

/**
 * Récupère l'élément suivant où insérer la carte lors du drag-and-drop.
 * @param {Element} container - Le conteneur des cartes.
 * @param {number} y - La position verticale de la souris.
 * @returns {Element} - L'élément après lequel insérer la carte.
 */
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

/**
 * Récupère les tableaux enregistrés dans le stockage local.
 * @returns {Array} - La liste des tableaux sauvegardés.
 */
function getBoards() {
    return JSON.parse(localStorage.getItem('boards')) || [];
}

/**
 * Enregistre un nouveau tableau dans le stockage local.
 * @param {Object} board - Le tableau à enregistrer.
 */
function saveBoard(board) {
    const boards = getBoards();
    boards.push(board);
    saveBoards(boards);
}

/**
 * Enregistre tous les tableaux dans le stockage local.
 * @param {Array} boards - La liste des tableaux à sauvegarder.
 */
function saveBoards(boards) {
    localStorage.setItem('boards', JSON.stringify(boards));
}

// Affiche les tableaux existants au chargement de la page
renderBoards();
