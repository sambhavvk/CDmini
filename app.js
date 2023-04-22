// app.js
document.getElementById('parseButton').addEventListener('click', () => {
    const inputGrammar = document.getElementById('inputGrammar').value;
    const grammar = parseGrammar(inputGrammar);
    const parser = new LL1Parser(grammar);

    visualizeParsing(parser);
});

function parseGrammar(input) {
    const lines = input.split('\n');
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

    const firstSetsTable = createTable(parser.firstSets, 'First Sets');
    const followSetsTable = createTable(parser.followSets, 'Follow Sets');
    const parseTable = createTable(parser.parseTable, 'Parse Table');

    output.appendChild(firstSetsTable);
    output.appendChild(followSetsTable);
    output.appendChild(parseTable);
}

function createTable(data, title) {
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
            for (let subKey in data[key]) {
                const th = document.createElement('th');
                th.textContent = subKey;
                headerRow.appendChild(th);
            }
            thead.appendChild(headerRow);
            headerCreated = true;
        }

        for (let subKey in data[key]) {
            const cell = document.createElement('td');
            cell.textContent = data[key][subKey];
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}
