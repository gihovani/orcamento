import {criarElementoHtml, formataNumeroEmDinheiro} from "../util/helper";
import {ICarrinho} from "../contratos/carrinho";
import {IApiProduto} from "../contratos/servicos/apiproduto";
import {TelaComPaginacao} from "./telacompaginacao";
import {ICarregando} from "../contratos/componentes/carregando";
import {CartaoDoProduto} from "./componentes/cartaodoproduto";
import {ICartaoDoProduto} from "../contratos/componentes/cartaodoproduto";
import {BarraDeNavegacao} from "./barradenavegacao";

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

    adicionar(cartaoDoProduto: ICartaoDoProduto): void {
        let personalizacao = '';
        if (cartaoDoProduto.produto.personalizado) {
            personalizacao = window.prompt('Informe a personalizacao: ', 'Linha1: [] | Linha2: []');
            if (!personalizacao) {
                return;
            }
        }
        const quantidade = cartaoDoProduto.pegaQuantidade();
        cartaoDoProduto.preencheQuantidade(quantidade);
        this.carrinho.adicionarProduto(cartaoDoProduto.produto, quantidade, false, personalizacao);
        this.barraDeNavegacao.atualizarQuantidadeDeItensNoCarrinho();
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
            {nome: 'name', valor: `filtro-${atributo}`},
            {nome: 'type', valor: 'text'},
            {nome: 'placeholder', valor: `Digite o ${titulo} do produto`}
        ]);
        let timeoutId;
        input.addEventListener('input', (event) => {
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
        select.append(criarElementoHtml('option', [], [{nome: 'value', valor: ''}, {
            nome: 'label',
            valor: 'Situacao'
        }]));
        select.append(criarElementoHtml('option', [], [{nome: 'value', valor: '1'}, {
            nome: 'label',
            valor: 'Em Estoque'
        }]));
        select.append(criarElementoHtml('option', [], [{nome: 'value', valor: '0'}, {
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

    private htmlFiltrosDosProdutos(): HTMLElement {
        let form = document.getElementById('lista-de-produtos-filtros');
        if (!form) {
            form = criarElementoHtml(
                'form',
                ['lista-de-produtos-filtros', 'row', 'g-3', 'align-items-center'],
                [{nome: 'id', valor: 'lista-de-produtos-filtros'}]
            );
        } else {
            form.innerHTML = '';
        }
        const div = criarElementoHtml('div', ['col-12', 'filtros-campo', 'pt-3', 'pb-3']);
        const titulo = criarElementoHtml('h2', ['filtros-titulo'], [], 'Filtros');
        div.appendChild(titulo);
        div.appendChild(this.campoFiltroDoProdutoPorAtributo('codigo-de-barras', 'Código de Barras', 'filtrarPorCodigoBarra'));
        div.appendChild(this.campoFiltroDoProdutoPorAtributo('sku', 'SKU', 'filtrarPorSku'));
        div.appendChild(this.campoFiltroDoProdutoPorAtributo('nome', 'Nome', 'filtrarPorNome'));
        div.appendChild(this.seletorFiltroDoProdutoPorAtributo('marca', 'Marca', 'filtrarPorMarca'));
        div.appendChild(this.seletorFiltroDoProdutoPorAtributo('categorias', 'Categoria', 'filtrarPorCategoria'));
        div.appendChild(this.filtroPorSituacao());
        div.appendChild(this.filtroPorPreco());
        div.appendChild(this.botaoListarRemoverFiltro());
        form.appendChild(div);
        return form;
    }

    private htmlCartoesDosProdutos(): HTMLElement {
        let div = document.getElementById('lista-de-produtos');
        if (!div) {
            div = criarElementoHtml('div', [
                'lista-de-produtos', 'row', 'row-cols-2', 'row-cols-xs-2',
                'row-cols-sm-3', 'row-cols-md-3', 'row-cols-xl-4', 'g-4'
            ], [{nome: 'id', valor: 'lista-de-produtos'}]);
        } else {
            div.innerHTML = '';
        }

        const itens = this.itensPaginado();
        if (itens.length < 1) {
            div.appendChild(criarElementoHtml('div', ['col', 'text-center'], [], 'Nenhum produto encontrado'));
            return div;
        }

        itens.map(produto => {
            let produtoEstaNoCarrinho = this.carrinho.produtos.find((item) => item.produto.id === produto.id);
            const cartao = new CartaoDoProduto(div, produto);
            cartao.mostrar((event) => {
                event.preventDefault();
                this.adicionar(cartao);
            });
            if (produtoEstaNoCarrinho?.quantidade) {
                cartao.preencheQuantidade(produtoEstaNoCarrinho.quantidade);
            }
        });
        return div;
    }

    atualizaHtmlItens(numeroPagina: number): void {
        this.paginaAtual = numeroPagina;
        this.htmlCartoesDosProdutos();
        this.htmlPaginacao();
    }

    htmlItens(): HTMLElement {
        const main = criarElementoHtml('main', ['listagem-de-produtos']);
        main.appendChild(this.htmlFiltrosDosProdutos());
        main.appendChild(this.htmlCartoesDosProdutos());
        return main;
    };
}