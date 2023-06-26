import {criarElementoHtml} from "../util/helper";
import {ITela} from "../contratos/tela";

export abstract class TelaComPaginacao implements ITela {
    public numeroItensPorPagina = 16;
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
        document.dispatchEvent(new CustomEvent('atualizar-tela', {detail: 'conteudo'}));
    }

    temPaginaAnterior(): boolean {
        return this.paginaAtual > 1;
    }

    paginaAnterior() {
        if (this.temPaginaAnterior()) {
            this.paginaAtual--;
        }
        document.dispatchEvent(new CustomEvent('atualizar-tela', {detail: 'conteudo'}));
    }

    temPaginacao(): boolean {
        this.ultimaPagina = Math.ceil(this.itens.length / this.numeroItensPorPagina);
        return this.ultimaPagina > 1;
    }

    paginaNumero(numero: number) {
        if (this.ultimaPagina >= numero && numero > 0) {
            this.paginaAtual = numero;
        }
        document.dispatchEvent(new CustomEvent('atualizar-tela', {detail: 'conteudo'}));
    }

    itensPaginado(): any[] {
        if (!this.temPaginacao()) {
            return this.itens;
        }

        let paginacao: any[] = [];
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

    htmlPaginacaoBotaoNumero(numero: number): HTMLElement {
        const li = criarElementoHtml('li', ['page-item', 'disabled']);
        const botao = criarElementoHtml('a', ['page-link'], [{nome: 'href', valor: '#'}], String(numero));
        li.classList.remove('disabled');
        botao.addEventListener('click', () => this.paginaNumero(numero));
        li.appendChild(botao);
        return li;
    }

    htmlPaginacao(): HTMLElement {
        const div = criarElementoHtml('div', ['lista-de-produtos-paginacao', 'row', 'pt-3', 'pb-3']);
        if (!this.temPaginacao()) {
            return div;
        }

        const nav = criarElementoHtml('nav', [], [{'nome': 'aria-label', 'valor': 'Page navigation example'}]);
        const ul = criarElementoHtml('ul', ['pagination', 'justify-content-center']);
        ul.appendChild(this.htmlPaginacaoBotaoVoltar());
        ul.appendChild(this.htmlPaginacaoBotaoNumero(3));
        ul.appendChild(this.htmlPaginacaoBotaoAvancar());
        nav.appendChild(ul);
        div.appendChild(nav);
        return div;
    }

    abstract htmlItens(): HTMLElement;

    conteudo(): HTMLElement {
        const div = criarElementoHtml('div');
        div.appendChild(this.htmlItens());
        div.appendChild(this.htmlPaginacao());
        return div;
    }
}