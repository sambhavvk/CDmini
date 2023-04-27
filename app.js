// app.js
document.getElementById('parseButton').addEventListener('click', () => {
    const inputGrammar = document.getElementById('inputGrammar').value;
    const grammar = parseGrammar(inputGrammar);
    const parser = new LL1Parser(grammar);

    visualizeParsing(parser);
});

function parseGrammar(input) {
    const lines = input.split('\n').filter(line => line.trim() !== '');
    const grammar = {};

    for (let line of lines) {
        const [nonTerminal, production] = line.split(' -> ');
        if (!grammar[nonTerminal]) {
            grammar[nonTerminal] = [];
        }
        grammar[nonTerminal].push(production);
    }

    return grammar;
}

function visualizeParsing(parser) {
    const output = document.getElementById('output');
    output.innerHTML = '';

    const firstSetsTable = createTable('First Sets', parser.firstSets);
    const followSetsTable = createTable('Follow Sets', parser.followSets);
    const parseTable = createTable('Parse Table', parser.parseTable);

    output.appendChild(firstSetsTable);
    output.appendChild(followSetsTable);
    output.appendChild(parseTable);
}

function createTable(title, data) {
    const table = document.createElement('table');
    const caption = document.createElement('caption');
    caption.textContent = title;
    table.appendChild(caption);

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    let headerCreated = false;

    for (let key in data) {
        const row = document.createElement('tr');

        if (!headerCreated) {
            const headerRow = document.createElement('tr');
            const thKey = document.createElement('th');
            thKey.textContent = 'Non-Terminal';
            headerRow.appendChild(thKey);

            const thValue = document.createElement('th');
            thValue.textContent = title === 'Parse Table' ? 'Production' : 'Set';
            headerRow.appendChild(thValue);

            if (title === 'Parse Table') {
                const keys = Object.keys(data[key]);
                for (let subKey of keys) {
                    const th = document.createElement('th');
                    th.textContent = subKey;
                    headerRow.appendChild(th);
                }
            }
            thead.appendChild(headerRow);
            headerCreated = true;
        }

        const keyCell = document.createElement('td');
        keyCell.textContent = key;
        row.appendChild(keyCell);

        if (title !== 'Parse Table') {
            const setCell = document.createElement('td');
            setCell.textContent = `{${[...data[key]].join(', ')}}`;
            row.appendChild(setCell);
        }

        for (let subKey in data[key]) {
            if (title === 'Parse Table') {
                const cell = document.createElement('td');
                cell.textContent = data[key][subKey];
                row.appendChild(cell);
            }
        }
        tbody.appendChild(row);
    }

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}
