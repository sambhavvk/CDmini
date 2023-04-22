// ll1-parser.js
class LL1Parser {
    constructor(grammar) {
        this.grammar = grammar;
        this.firstSets = this.computeFirstSets();
        this.followSets = this.computeFollowSets();
        this.parseTable = this.constructParseTable();
    }

    computeFirstSets() {
        const first = {};

        for (let nonTerminal in this.grammar) {
            first[nonTerminal] = new Set();
        }

        let changed;
        do {
            changed = false;

            for (let nonTerminal in this.grammar) {
                const productions = this.grammar[nonTerminal];

                for (let production of productions) {
                    const symbols = production.split(' ');

                    let nullable = true;
                    for (let symbol of symbols) {
                        if (this.isNonTerminal(symbol)) {
                            if (!first[symbol]) {
                                first[symbol] = new Set();
                            }

                            first[nonTerminal] = new Set([...first[nonTerminal], ...first[symbol]]);

                            if (!first[symbol].has('ε')) {
                                nullable = false;
                                break;
                            }
                        } else {
                            first[nonTerminal].add(symbol);
                            nullable = false;
                            break;
                        }
                    }

                    if (nullable) {
                        first[nonTerminal].add('ε');
                    }
                }
            }
        } while (changed);

        return first;
    }

    computeFollowSets() {
        const follow = {};

        for (let nonTerminal in this.grammar) {
            follow[nonTerminal] = new Set();
        }
        follow[this.startSymbol] = new Set(['$']);

        let changed;
        do {
            changed = false;

            for (let nonTerminal in this.grammar) {
                const productions = this.grammar[nonTerminal];

                for (let production of productions) {
                    const symbols = production.split(' ');

                    for (let i = 0; i < symbols.length; i++) {
                        const symbol = symbols[i];

                        if (this.isNonTerminal(symbol)) {
                            let tailFirst = new Set();

                            for (let j = i + 1; j < symbols.length; j++) {
                                if (this.isNonTerminal(symbols[j])) {
                                    tailFirst = new Set([...tailFirst, ...this.firstSets[symbols[j]]]);

                                    if (!this.firstSets[symbols[j]].has('ε')) {
                                        break;
                                    }
                                } else {
                                    tailFirst.add(symbols[j]);
                                    break;
                                }
                            }

                            if (tailFirst.size === 0 || tailFirst.has('ε')) {
                                tailFirst.delete('ε');
                                follow[symbol] = new Set([...follow[symbol], ...follow[nonTerminal]]);
                            }

                            follow[symbol] = new Set([...follow[symbol], ...tailFirst]);
                        }
                    }
                }
            }
        } while (changed);

        return follow;
    }

    constructParseTable() {
        const table = {};
    
        for (let nonTerminal in this.grammar) {
            table[nonTerminal] = {};
    
            for (let production of this.grammar[nonTerminal]) {
                const firstSet = this.computeFirstSetOfProduction(production);
    
                for (let terminal of firstSet) {
                    if (terminal !== 'ε') {
                        table[nonTerminal][terminal] = production;
                    }
                }
    
                if (firstSet.has('ε')) {
                    for (let terminal of this.followSets[nonTerminal]) {
                        if (terminal !== 'ε') {
                            table[nonTerminal][terminal] = production;
                        }
                    }
                }
            }
        }
    
        return table;
    }
    computeFirstSetOfProduction(production) {
        const firstSet = new Set();
        const symbols = production.split(' ');
    
        let nullable = true;
        for (let symbol of symbols) {
            if (this.isNonTerminal(symbol)) {
                firstSet.add(...this.firstSets[symbol]);
    
                if (!this.firstSets[symbol].has('ε')) {
                    nullable = false;
                    break;
                }
            } else {
                firstSet.add(symbol);
                nullable = false;
                break;
            }
        }
    
        if (nullable) {
            firstSet.add('ε');
        }
    
        return firstSet;
    }
    
    isNonTerminal(symbol) {
        return this.grammar.hasOwnProperty(symbol);
    }
}        