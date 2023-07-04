import {criarElementoHtml} from "../util/helper";
import {ITela} from "../contratos/tela";

export abstract class TelaComPaginacao implements ITela {
    public numeroItensPorPagina = 20;
    public paginaAtual = 1;
    public ultimaPagina = 1;
    public itens: any[] = [];

    temProximaPagina(): boolean {
        return this.paginaAtual < this.ultimaPagina;
    }

    proximaPagina() {
        if (this.temProximaPagina()) {
            this.paginaAtual++;
        }
        this.atualizaHtmlItens(this.paginaAtual);
    }

    temPaginaAnterior(): boolean {
        return this.paginaAtual > 1;
    }

    paginaAnterior() {
        if (this.temPaginaAnterior()) {
            this.paginaAtual--;
        }
        this.atualizaHtmlItens(this.paginaAtual);
    }

    temPaginacao(): boolean {
        this.ultimaPagina = Math.ceil(this.itens.length / this.numeroItensPorPagina);
        return this.ultimaPagina > 1;
    }

    paginaNumero(numero: number) {
        if (this.ultimaPagina >= numero && numero > 0) {
            this.paginaAtual = numero;
        }
        this.atualizaHtmlItens(this.paginaAtual);
    }

    itensPaginado(): any[] {
        if (!this.temPaginacao()) {
            return this.itens;
        }

        const paginacao: any[] = [];
        const itens = this.itens;
        const inicio = (this.paginaAtual * this.numeroItensPorPagina) - this.numeroItensPorPagina;
        const limite = inicio + this.numeroItensPorPagina;
        for (let i = inicio; i < limite; i++) {
            if (itens[i] != null) {
                paginacao.push(itens[i]);
            }
        }
        return paginacao;
    }

    htmlPaginacaoBotaoVoltar(): HTMLElement {
        const li = criarElementoHtml('li', ['page-item', 'disabled']);
        const botao = criarElementoHtml('a', ['page-link'], [{nome: 'href', valor: '#'}], 'Voltar');
        if (this.temPaginaAnterior()) {
            li.classList.remove('disabled');
            botao.addEventListener('click', () => this.paginaAnterior());
        }
        li.appendChild(botao);
        return li;
    }

    htmlPaginacaoBotaoAvancar(): HTMLElement {
        const li = criarElementoHtml('li', ['page-item', 'disabled']);
        const botao = criarElementoHtml('a', ['page-link'], [{nome: 'href', valor: '#'}], 'Avançar');
        if (this.temProximaPagina()) {
            li.classList.remove('disabled');
            botao.addEventListener('click', () => this.proximaPagina());
        }
        li.appendChild(botao);
        return li;
    }

    htmlPaginacaoPorNumero(): HTMLElement {
        const li = criarElementoHtml('li', ['page-item']);
        if (this.ultimaPagina < 2) {
            return li;
        }

        const select = criarElementoHtml('select', ['page-link'], [{nome: 'name', valor: 'paginacao-por-numeros'}]);
        for (let numero = 1; numero <= this.ultimaPagina; numero++) {
            const atributos = [{nome: 'value', valor: String(numero)}];
            const option = criarElementoHtml('option', [], atributos, String(numero));
            if (numero === this.paginaAtual) {
                option.setAttribute('selected', 'selected');
            }
            select.appendChild(option);
        }
        select.addEventListener('change', (event) => this.paginaNumero(parseInt((event.target as HTMLSelectElement).value)));
        li.appendChild(select);
        return li;
    }

    htmlPaginacao(): HTMLElement {
        let div = document.getElementById('lista-de-produtos-paginacao');
        if (div) {
            div.innerHTML = '';
        } else {
            div = criarElementoHtml(
                'div',
                ['lista-de-produtos-paginacao', 'row', 'pt-3', 'pb-3']
            );
            div.setAttribute('id', 'lista-de-produtos-paginacao');
        }
        if (!this.temPaginacao()) {
            return div;
        }

        const nav = criarElementoHtml('nav', [], [{'nome': 'aria-label', 'valor': 'Page navigation example'}]);
        const ul = criarElementoHtml('ul', ['pagination', 'justify-content-center']);
        ul.appendChild(this.htmlPaginacaoBotaoVoltar());
        ul.appendChild(this.htmlPaginacaoPorNumero());
        ul.appendChild(this.htmlPaginacaoBotaoAvancar());
        nav.appendChild(ul);
        div.appendChild(nav);
        return div;
    }

    abstract htmlItens(): HTMLElement;

    abstract atualizaHtmlItens(numeroPagina: number);

    conteudo(): HTMLElement {
        const main = criarElementoHtml('main');
        main.appendChild(this.htmlItens());
        main.appendChild(this.htmlPaginacao());
        return main;
    }
}