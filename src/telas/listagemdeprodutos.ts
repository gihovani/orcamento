import {criarElementoHtml, formataNumeroEmDinheiro} from "../util/helper";
import {ICarrinho} from "../contratos/carrinho";
import {IApiProduto} from "../contratos/servicos/apiproduto";
import {TelaComPaginacao} from "./telacompaginacao";
import {ICarregando} from "../contratos/componentes/carregando";
import {CartaoDoProduto} from "./componentes/cartaodoproduto";
import {ICartaoDoProduto} from "../contratos/componentes/cartaodoproduto";

export class ListagemDeProdutos extends TelaComPaginacao {
    private _filtroAtraso = 500;

    constructor(
        public apiProduto: IApiProduto,
        public carrinho: ICarrinho,
        public carregando: ICarregando
    ) {
        super();
    }

    pegaDadosDosProdutos() {
        this.carregando.mostrar();
        this.apiProduto.listar(false).then((produtos) => {
            this.itens = produtos;
            this.atualizaHtmlItens(1);
            this.htmlFiltrosDosProdutos();
        }).finally(() => this.carregando.esconder());
    }

    adicionar(cartaoDoProduto: ICartaoDoProduto) {
        const quantidade = cartaoDoProduto.pegaQuantidade();
        this.carrinho.adicionarProduto(cartaoDoProduto.produto, quantidade);
        this.carrinho.totalizar(true);
        cartaoDoProduto.preencheQuantidade(quantidade);
        this.atualizarQuantidadeDeItensNoCarrinho();
    }


    private htmlFiltroDoProdutoPorAtributo(atributo: string, titulo: string): HTMLElement {
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
        return select;
    }

    private filtroPorMarca(): HTMLElement {
        const filtroMarca = this.htmlFiltroDoProdutoPorAtributo('marca', 'Marca');
        filtroMarca.addEventListener('change', (event) => {
            event.preventDefault();
            this.itens = this.apiProduto.filtrarPorMarca((event.target as HTMLInputElement).value);
            this.atualizaHtmlItens(1);
        });
        return filtroMarca;
    }

    private fitroPorCategoria(): HTMLElement {
        const filtro = this.htmlFiltroDoProdutoPorAtributo('categorias', 'Categoria');
        filtro.addEventListener('change', (event) => {
            event.preventDefault();
            this.itens = this.apiProduto.filtrarPorCategoria((event.target as HTMLInputElement).value);
            this.atualizaHtmlItens(1);
        });
        return filtro;
    }

    private filtroPorNome(): HTMLElement {
        const filtro = criarElementoHtml('input', [], [
            {nome: 'name', valor: 'filtro-nome'},
            {nome: 'type', valor: 'text'},
            {nome: 'placeholder', valor: 'Digite o nome do produto'}
        ]);
        let timeoutId;
        filtro.addEventListener('input', (event) => {
            event.preventDefault();
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                this.itens = this.apiProduto.filtrarPorNome((event.target as HTMLInputElement).value);
                this.atualizaHtmlItens(1);
            }, this._filtroAtraso);
        });
        return filtro;
    }

    private filtroCodigoDeBarras(): HTMLElement {
        const filtro = criarElementoHtml('input', [], [
            {nome: 'name', valor: 'filtro-codigo-barras'},
            {nome: 'type', valor: 'text'},
            {nome: 'placeholder', valor: 'Digite o código de barras'}
        ]);
        let timeoutId;
        filtro.addEventListener('input', (event) => {
            event.preventDefault();
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                this.itens = this.apiProduto.filtrarPorCodigoBarra((event.target as HTMLInputElement).value);
                this.atualizaHtmlItens(1);
            }, this._filtroAtraso);
        });
        return filtro;
    }

    private filtroPorPreco(): HTMLElement {
        const faixaDePrecos = this.apiProduto.faixaDePrecos;
        const div = criarElementoHtml('div');
        const filtroPorPreco = criarElementoHtml('input', [], [
            {nome: 'name', valor: 'filtro-faixa-de-preco'},
            {nome: 'type', valor: 'range'},
            {nome: 'step', valor: '0.5'},
            {nome: 'min', valor: String(faixaDePrecos.minimo)},
            {nome: 'max', valor: String(faixaDePrecos.maximo)},
            {nome: 'value', valor: String(faixaDePrecos.maximo)}
        ]);
        const mostradorValor = criarElementoHtml('output', [], [], `Até: ${faixaDePrecos.maximo}`);
        let timeoutId;
        filtroPorPreco.addEventListener('input', (event) => {
            event.preventDefault();
            event.preventDefault();
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                const valor = parseFloat((event.target as HTMLInputElement).value);
                mostradorValor.textContent = 'Até: ' + formataNumeroEmDinheiro(valor);
                this.itens = this.apiProduto.filtrarPorPreco(0, valor);
                this.atualizaHtmlItens(1);
            }, this._filtroAtraso);
        });
        div.appendChild(filtroPorPreco);
        div.appendChild(mostradorValor);
        return div;
    }

    private botaoListarRemoverFiltro(): HTMLElement {
        const botaoListarTodos = criarElementoHtml('button', ['btn', 'btn-info'], [], 'Listar todos os produtos');
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
        div.appendChild(this.filtroCodigoDeBarras());
        div.appendChild(this.filtroPorNome());
        div.appendChild(this.filtroPorMarca());
        div.appendChild(this.fitroPorCategoria());
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

    atualizaHtmlItens(numeroPagina: number) {
        this.paginaAtual = numeroPagina;
        this.htmlCartoesDosProdutos();
        this.atualizarQuantidadeDeItensNoCarrinho();
        this.htmlPaginacao();
    }

    htmlItens(): HTMLElement {
        const main = criarElementoHtml('main', ['listagem-de-produtos']);
        main.appendChild(this.htmlFiltrosDosProdutos());
        main.appendChild(this.htmlCartoesDosProdutos());
        return main;
    };

    private atualizarQuantidadeDeItensNoCarrinho() {
        const informaQuantidadeNoCarrinho = criarElementoHtml(
            'span',
            ['label-quantidade'],
            [],
            String(this.carrinho.produtos.length)
        );
        const menuCarrinho = document.getElementById('menu-carrinho');
        menuCarrinho.querySelector('.label-quantidade')?.remove();
        menuCarrinho.appendChild(informaQuantidadeNoCarrinho);
    }
}