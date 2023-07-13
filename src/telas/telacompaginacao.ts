import {criarElementoHtml} from "../util/helper";
import {ITela} from "../contratos/tela";

export abstract class TelaComPaginacao implements ITela {
    protected _filtroAtraso = 500;
    private _numeroItensPorPagina = 20;
    public paginaAtual = 1;
    public ultimaPagina = 1;
    public itens: any[] = [];
    public elemento: HTMLElement;

    constructor() {
        this.elemento = criarElementoHtml('main', ['listagem-de-produtos', 'row']);
    }

    set numeroItensPorPagina(numero: number) {
        if (isNaN(numero)) {
            throw Error("Páginação inválida: o número de itens por página de ver um número!");
        }
        if (numero < 1 || numero > 100) {
            throw Error("Páginação inválida: o número de itens por página deve ser um número entre 1 e 100!");
        }
        this._numeroItensPorPagina = numero;
    }

    get numeroItensPorPagina(): number {
        return this._numeroItensPorPagina;
    }

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

    private htmlPaginacaoBotaoVoltar(): HTMLElement {
        const li = criarElementoHtml('li', ['page-item', 'disabled']);
        const botao = criarElementoHtml('a', ['page-link'], [{nome: 'href', valor: '#'}], 'Voltar');
        if (this.temPaginaAnterior()) {
            li.classList.remove('disabled');
            botao.addEventListener('click', () => this.paginaAnterior());
        }
        li.appendChild(botao);
        return li;
    }

    private htmlPaginacaoBotaoAvancar(): HTMLElement {
        const li = criarElementoHtml('li', ['page-item', 'disabled']);
        const botao = criarElementoHtml('a', ['page-link'], [{nome: 'href', valor: '#'}], 'Avançar');
        if (this.temProximaPagina()) {
            li.classList.remove('disabled');
            botao.addEventListener('click', () => this.proximaPagina());
        }
        li.appendChild(botao);
        return li;
    }

    private htmlPaginacaoPorNumero(): HTMLElement {
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

    private htmlInformacoesDaPaginacao(): HTMLElement {
        const div = criarElementoHtml('div', ['col-12', 'col-lg-6']);
        const label = criarElementoHtml('div', ['input-group']);
        label.innerHTML = `<span class="input-group-text">
Mostrando ${((this.numeroItensPorPagina * (this.paginaAtual - 1)) + 1)} a ${this.paginaAtual * this.numeroItensPorPagina} de ${this.itens.length}
</span>
<label class="input-group-text" for="itens-por-pagina">Itens por página</label>`;
        const input = criarElementoHtml('input', ['form-control']);
        input.setAttribute('id', 'itens-por-pagina')
        input.setAttribute('aria-label', 'Itens por página');
        input.setAttribute('type', 'number');
        input.setAttribute('step', '4');
        input.setAttribute('min', '1');
        input.setAttribute('max', '100');
        input.setAttribute('value', String(this.numeroItensPorPagina));
        let timeoutId;
        input.addEventListener('keyup', (event) => {
            event.preventDefault();
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                this.numeroItensPorPagina = parseInt((event.target as HTMLInputElement).value);
                this.atualizaHtmlItens(1);
            }, this._filtroAtraso);
        });
        label.appendChild(input);
        div.appendChild(label)
        return div;
    }

    htmlPaginacao(): void {
        let div = this.elemento.querySelector('#lista-de-produtos-paginacao');
        if (div) {
            div.innerHTML = '';
        } else {
            div = criarElementoHtml('div', ['lista-de-produtos-paginacao', 'row', 'pt-3', 'pb-3']);
            div.setAttribute('id', 'lista-de-produtos-paginacao');
            this.elemento.appendChild(div);
        }
        if (!this.temPaginacao()) {
            return;
        }

        const nav = criarElementoHtml('nav', ['col-12', 'col-lg-3', 'offset-lg-3']);
        nav.setAttribute('aria-label', 'Page navigation example');
        const ul = criarElementoHtml('ul', ['pagination']);
        ul.appendChild(this.htmlPaginacaoBotaoVoltar());
        ul.appendChild(this.htmlPaginacaoPorNumero());
        ul.appendChild(this.htmlPaginacaoBotaoAvancar());
        nav.appendChild(ul);
        div.appendChild(nav);
        div.appendChild(this.htmlInformacoesDaPaginacao());
    }

    abstract htmlItens(): void;

    abstract atualizaHtmlItens(numeroPagina: number);

    conteudo(): HTMLElement {
        this.htmlItens();
        this.htmlPaginacao();
        return this.elemento;
    }
}