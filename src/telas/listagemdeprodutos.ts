import {criarElementoHtml, formataNumeroEmDinheiro} from "../util/helper";
import {ICarrinho} from "../contratos/carrinho";
import {IApiProduto} from "../contratos/servicos/apiproduto";
import {TelaComPaginacao} from "./telacompaginacao";
import {ICarregando} from "../contratos/componentes/carregando";
import {BarraDeNavegacao} from "./barradenavegacao";
import {CartaoDoProduto} from "./componentes/formularios/cartaodoproduto";

export class ListagemDeProdutos extends TelaComPaginacao {
    private _filtroAtraso = 500;

    constructor(
        public apiProduto: IApiProduto,
        public carrinho: ICarrinho,
        public barraDeNavegacao: BarraDeNavegacao,
        public carregando: ICarregando
    ) {
        super();
    }

    pegaDadosDosProdutos(): void {
        this.carregando.mostrar();
        this.apiProduto.listar(false).then((produtos) => {
            this.itens = produtos;
            this.atualizaHtmlItens(1);
            this.htmlFiltrosDosProdutos();
        }).finally(() => this.carregando.esconder());
    }

    private adicionar(event: CustomEvent) {
        const cartao = (event.detail as CartaoDoProduto);
        let personalizacao = '';
        if (cartao.produto.personalizado) {
            personalizacao = window.prompt('Informe a personalizacao: ', 'Linha1: [] | Linha2: []');
            if (!personalizacao) {
                return;
            }
        }
        const quantidade = cartao.pegaDados();
        cartao.preencheDados(quantidade);
        this.carrinho.adicionarProduto(cartao.produto, quantidade, false, personalizacao);
        this.barraDeNavegacao.atualizarQuantidadeDeItensNoCarrinho();
    }

    private produtosSimilares(event: CustomEvent) {
        const filtroAgrupador = (document.getElementById('filtro-agrupador') as HTMLInputElement);
        if (!filtroAgrupador) {
            return;
        }

        const cartao = (event.detail as CartaoDoProduto);
        filtroAgrupador.value = cartao.produto.agrupador;
        filtroAgrupador.dispatchEvent(new Event('keyup'));
    }

    private seletorFiltroDoProdutoPorAtributo(atributo: string, titulo: string, nomeFuncaoDoFiltro: string): HTMLElement {
        const select = criarElementoHtml('select', ['form-select'], [{nome: 'name', valor: `filtro-${atributo}`}]);
        const option = criarElementoHtml('option', [], [{nome: 'value', valor: ''}, {nome: 'label', valor: titulo}]);
        select.appendChild(option);
        const filtros = this.apiProduto.filtros();
        if (!filtros.has(atributo)) {
            return select;
        }
        const opcoes = filtros.get(atributo);
        opcoes.sort((a, b) => a.localeCompare(b));
        opcoes.map(valor => {
            const option = criarElementoHtml('option', [], [{nome: 'value', valor}, {nome: 'label', valor}]);
            select.appendChild(option);
        });
        select.addEventListener('change', (event) => {
            event.preventDefault();
            this.itens = this.apiProduto[nomeFuncaoDoFiltro]((event.target as HTMLInputElement).value);
            this.atualizaHtmlItens(1);
        });
        return select;
    }

    private campoFiltroDoProdutoPorAtributo(atributo: string, titulo: string, nomeFuncaoDoFiltro: string): HTMLElement {
        const input = criarElementoHtml('input', [], [
            {nome: 'id', valor: `filtro-${atributo}`},
            {nome: 'name', valor: `filtro-${atributo}`},
            {nome: 'type', valor: 'text'},
            {nome: 'placeholder', valor: `Digite o ${titulo} do produto`}
        ]);
        let timeoutId;
        input.addEventListener('keyup', (event) => {
            event.preventDefault();
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                this.itens = this.apiProduto[nomeFuncaoDoFiltro]((event.target as HTMLInputElement).value);
                this.atualizaHtmlItens(1);
            }, this._filtroAtraso);
        });
        return input;
    }

    private filtroPorPreco(): HTMLElement {
        const faixaDePrecos = this.apiProduto.faixaDePrecos;
        const div = criarElementoHtml('div', ['input-group', 'mb-4']);
        const input = criarElementoHtml('input', ['form-control'], [
            {nome: 'name', valor: 'filtro-faixa-de-preco'},
            {nome: 'type', valor: 'range'},
            {nome: 'step', valor: '0.5'},
            {nome: 'min', valor: String(faixaDePrecos.minimo)},
            {nome: 'max', valor: String(faixaDePrecos.maximo)},
            {nome: 'value', valor: String(faixaDePrecos.maximo)}
        ]);
        const mostradorValor = criarElementoHtml(
            'span',
            ['input-group-text'],
            [],
            'Max: ' + formataNumeroEmDinheiro(faixaDePrecos.maximo)
        );
        let timeoutId;
        input.addEventListener('input', (event) => {
            event.preventDefault();
            event.preventDefault();
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                const valor = parseFloat((event.target as HTMLInputElement).value);
                mostradorValor.textContent = 'Max: ' + formataNumeroEmDinheiro(valor);
                this.itens = this.apiProduto.filtrarPorPreco(0, valor);
                this.atualizaHtmlItens(1);
            }, this._filtroAtraso);
        });
        div.appendChild(input);
        div.appendChild(mostradorValor);
        return div;
    }

    private filtroPorSituacao(): HTMLElement {
        const select = criarElementoHtml('select', ['form-select'], [{nome: 'name', valor: `filtro-situacao`}]);
        select.appendChild(criarElementoHtml('option', [], [{nome: 'value', valor: ''}, {
            nome: 'label',
            valor: 'Situacao'
        }]));
        select.appendChild(criarElementoHtml('option', [], [{nome: 'value', valor: '1'}, {
            nome: 'label',
            valor: 'Em Estoque'
        }]));
        select.appendChild(criarElementoHtml('option', [], [{nome: 'value', valor: '0'}, {
            nome: 'label',
            valor: 'Esgotado'
        }]));

        select.addEventListener('change', (event) => {
            event.preventDefault();
            const valor = (event.target as HTMLInputElement).value;
            if (valor === '' && this.apiProduto.produtos.length > this.itens.length) {
                this.pegaDadosDosProdutos();
            } else {
                this.itens = this.apiProduto.filtrarPorSituacao(!!parseInt(valor));
                this.atualizaHtmlItens(1);
            }
        });
        return select;
    }

    private botaoListarRemoverFiltro(): HTMLElement {
        const botaoListarTodos = criarElementoHtml('button', ['btn', 'btn-primary', 'w-100'], [], 'Listar todos os produtos');
        botaoListarTodos.addEventListener('click', (event) => {
            event.preventDefault();
            if (this.apiProduto.produtos.length > this.itens.length) {
                this.pegaDadosDosProdutos();
            }
        });
        return botaoListarTodos;
    }

    private htmlFiltrosDosProdutos(): void {
        let form = this.elemento.querySelector('#lista-de-produtos-filtros');
        if (form) {
            form.innerHTML = '';
        } else {
            form = criarElementoHtml('form', [
                'lista-de-produtos-filtros', 'row', 'g-3', 'col-md-3', 'align-items-center'
            ]);
            form.setAttribute('id', 'lista-de-produtos-filtros');
            this.elemento.appendChild(form);
        }
        const div = criarElementoHtml('div', ['col-12', 'filtros-campo', 'pt-3', 'pb-3']);
        const titulo = criarElementoHtml('h2', ['filtros-titulo'], [], 'Filtros');
        div.appendChild(titulo);
        div.appendChild(this.campoFiltroDoProdutoPorAtributo('codigo-de-barras', 'Código de Barras', 'filtrarPorCodigoBarra'));
        div.appendChild(this.campoFiltroDoProdutoPorAtributo('agrupador', 'Agrupador', 'filtrarPorAgrupador'));
        div.appendChild(this.campoFiltroDoProdutoPorAtributo('sku', 'SKU', 'filtrarPorSku'));
        div.appendChild(this.campoFiltroDoProdutoPorAtributo('nome', 'Nome', 'filtrarPorNome'));
        div.appendChild(this.seletorFiltroDoProdutoPorAtributo('marca', 'Marca', 'filtrarPorMarca'));
        div.appendChild(this.seletorFiltroDoProdutoPorAtributo('categorias', 'Categoria', 'filtrarPorCategoria'));
        div.appendChild(this.filtroPorSituacao());
        div.appendChild(this.filtroPorPreco());
        div.appendChild(this.botaoListarRemoverFiltro());
        form.appendChild(div);
    }

    private htmlCartoesDosProdutos(): void {
        let div = (this.elemento.querySelector('#lista-de-produtos') as HTMLElement);
        if (div) {
            div.innerHTML = '';
        } else {
            div = criarElementoHtml('div', [
                'lista-de-produtos', 'row', 'row-cols-2', 'row-cols-xs-2',
                'row-cols-sm-3', 'row-cols-md-3', 'row-cols-xl-4', 'col-md-9', 'g-4'
            ]);
            div.setAttribute('id', 'lista-de-produtos');
            this.elemento.appendChild(div);
        }

        const itens = this.itensPaginado();
        if (itens.length < 1) {
            div.appendChild(criarElementoHtml('div', ['col', 'text-center'], [], 'Nenhum produto encontrado'));
            return;
        }

        itens.map(produto => {
            const produtoEstaNoCarrinho = this.carrinho.produtos.find((item) => item.produto.sku === produto.sku);
            const cartao = new CartaoDoProduto(div, produto, (event: CustomEvent) => {
                this.adicionar(event);
            }, (event: CustomEvent) => {
                this.produtosSimilares(event);
            });
            cartao.mostrar();
            if (produtoEstaNoCarrinho?.quantidade) {
                cartao.preencheDados(produtoEstaNoCarrinho.quantidade);
            }
        });
    }

    atualizaHtmlItens(numeroPagina: number): void {
        this.paginaAtual = numeroPagina;
        this.htmlCartoesDosProdutos();
        this.htmlPaginacao();
    }

    htmlItens(): void {
        this.htmlFiltrosDosProdutos();
        this.htmlCartoesDosProdutos();
    };
}