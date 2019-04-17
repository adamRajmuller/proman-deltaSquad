// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    _appendToElement: function (elementToExtend, textToAppend, prepend = false) {
        // function to append new DOM elements (represented by a string) to an existing DOM element
        let fakeDiv = document.createElement('div');
        fakeDiv.innerHTML = textToAppend.trim();

        for (let childNode of fakeDiv.childNodes) {
            if (prepend) {
                elementToExtend.prependChild(childNode);
            } else {
                elementToExtend.appendChild(childNode);
            }
        }

        return elementToExtend.lastChild;
    },
    init: function () {
        // This function should run once, when the page is loaded.
        // this.loadBoards();
        this.loadBoards();

    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for(let board of boards){
            boardList += `
                <section class="board">
                    <div class="board-header"><span class="board-title">${board.title}</span>
                        <button class="board-add">Add Card</button>
                        <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                    </div>
                    <div id="boardSlot${board.id}" class="board-columns"></div>
                </section>
            `;
        }

        const outerHtml = `
            <div class="board-container">
                ${boardList}
            </div>
        `;

        this._appendToElement(document.querySelector('#boards'), outerHtml);

        for (let board of boards) {
            this.loadCards(board.id)
        }
        dom.addCard()

    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, function(cards){
            dom.showCards(cards, boardId);
        })
    },
    showCards: function (cards, boardId) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let statusList= [];
        let innerHtml = ``;
        for (let card of cards) {
            if (!statusList.includes(card.status_id)) {
                statusList.push(card.status_id);
            }
        }
        //             <div class="board-column-title">New</div>
        //             <div class="board-column-content">
        //                 <div class="card">
        //                     <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
        //                     <div class="card-title">Card 1</div>
        //                 </div>
        //                 <div class="card">
        //                     <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
        //                     <div class="card-title">Card 2</div>
        //                 </div>
        //             </div>
        for (let status of statusList) {
            innerHtml += `
                <div class="board-column">
                <div class="board-column-title" id="${boardId}/${status}">
                    ${status}
                </div>
                <div class="board-column-content">
                    ${cards.map(function (card) {
                return `
                            ${(card.status_id === status) ? `<div class="card">
                                                                <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                                                                <div class="card-title">${card.title}</div>
                                                            </div>` : ''}
                        `
            }).join('')}
                </div>
                </div>
            `;
        }
            const outerHtml = `
            <div class="board-column">
                ${innerHtml}
            </div>
        `;

        this._appendToElement(document.querySelector(`#boardSlot${boardId}`), innerHtml);

    },
    // here comes more features
    addCard: function () {
        let addButtons = document.querySelectorAll('.board-add');
        let addMe = `<div class="card">
                    <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                    <div class="card-title">newTestCard</div>
                    </div>`;
        for (let button of addButtons) {
            button.addEventListener('click', function() {
                dom._appendToElement(button.parentElement.nextElementSibling.childNodes[0], addMe)
            })
        }
    }
};
