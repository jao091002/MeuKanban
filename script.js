document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    loadListsFromStorage();
});

function initEventListeners() {
    document.body.addEventListener('click', (e) => {
        // Abrir formulário de novo card
        if (e.target.closest('.add-card-btn')) {
            const addCardBtn = e.target.closest('.add-card-btn');
            const form = addCardBtn.nextElementSibling;
            addCardBtn.style.display = 'none';
            form.style.display = 'flex';
            form.querySelector('textarea').focus();
        }

        // Fechar formulário
        if (e.target.closest('.close-form')) {
            const form = e.target.closest('.card-form');
            form.previousElementSibling.style.display = 'flex';
            form.style.display = 'none';
        }

        // Salvar card
        if (e.target.closest('.card-form')) {
            e.preventDefault();
            if (e.target.tagName === 'BUTTON' && e.target.type === 'submit') {
                const form = e.target.closest('.card-form');
                const textarea = form.querySelector('textarea');
                if (textarea.value.trim()) {
                    createNewCard(form);
                }
            }
        }

        // Deletar lista
        if (e.target.closest('.delete-list')) {
            const list = e.target.closest('.list');
            list.remove();
            saveListsToStorage();
        }
    });

    // Salvar título da lista ao editar
    document.body.addEventListener('input', (e) => {
        if (e.target.classList.contains('list-title')) {
            saveListsToStorage();
        }
    });
}

function toggleListForm(show) {
    const template = document.getElementById('listTemplate');
    const clone = template.content.cloneNode(true);
    const newList = clone.querySelector('.list');
    
    // Adicionar nova lista ao board
    document.getElementById('board').appendChild(newList);
    newList.querySelector('.list-title').focus();
    
    // Salvar ao sair do título
    newList.querySelector('.list-title').addEventListener('blur', saveListsToStorage);
    
    // Rolagem para a nova lista
    newList.scrollIntoView({ behavior: 'smooth' });
}

function createNewCard(form) {
    const textarea = form.querySelector('textarea');
    const cardContent = textarea.value.trim();
    
    if (cardContent) {
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = cardContent;
        
        const cardContainer = form.closest('.list').querySelector('.card-container');
        cardContainer.appendChild(card);
        
        textarea.value = '';
        saveListsToStorage();
    }
}

function saveListsToStorage() {
    const lists = Array.from(document.querySelectorAll('.list')).map(list => {
        return {
            title: list.querySelector('.list-title').textContent,
            cards: Array.from(list.querySelectorAll('.card')).map(card => ({
                content: card.textContent
            }))
        };
    });
    localStorage.setItem('kanbanLists', JSON.stringify(lists));
}

function loadListsFromStorage() {
    const savedLists = JSON.parse(localStorage.getItem('kanbanLists')) || [];
    savedLists.forEach(listData => {
        const template = document.getElementById('listTemplate');
        const clone = template.content.cloneNode(true);
        const newList = clone.querySelector('.list');
        
        // Preencher dados
        newList.querySelector('.list-title').textContent = listData.title;
        const cardContainer = newList.querySelector('.card-container');
        listData.cards.forEach(cardData => {
            const card = document.createElement('div');
            card.className = 'card';
            card.textContent = cardData.content;
            cardContainer.appendChild(card);
        });
        
        document.getElementById('board').appendChild(newList);
    });
}