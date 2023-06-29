import {criarElementoHtml, formataNumeroEmDinheiro} from "../util/helper";
import {ICarrinho} from "../contratos/carrinho";
import {IProduto} from "../contratos/entidades/produto";
import {IApiProduto} from "../contratos/servicos/apiproduto";
import {TelaComPaginacao} from "./telacompaginacao";
import {ICarregando} from "../contratos/componentes/carregando";

export class ListagemDeProdutos extends TelaComPaginacao {
    private _filtroAtraso = 500;

    constructor(
        public apiProduto: IApiProduto,
        public carrinho: ICarrinho,
        public carregando: ICarregando
    ) {
        super();
        this.pegaDadosDosProdutos();
    }

    pegaDadosDosProdutos() {
        this.eventos();
        this.carregando.mostrar();
        this.apiProduto.listar(false).then((produtos) => {
            this.itens = produtos;
            this.atualizarHtmlCartoesDosProdutos();
        }).finally(() => this.carregando.esconder());
    }

    adicionar(produto: IProduto) {
        const inputQuantidade = document.getElementById(`quantidade-${produto.id}`) as HTMLInputElement;
        let quantidade = 1;
        if (inputQuantidade) {
            quantidade = parseInt(inputQuantidade.value);
        }
        this.carrinho.adicionarProduto(produto, quantidade);
        this.carrinho.totalizar(true);

        this.atualizarQuantidadeDeItensNoCarrinho();

        const divProduto = (document.querySelector(`#produto-id-${produto.id} .card`) as HTMLDivElement);
        divProduto.querySelector('.label-item-adicionado')?.remove();
        divProduto.append(this.htmlInformacaoProdutoAdicionadoNoCarrinho());
    }

    htmlInformacaoProdutoAdicionadoNoCarrinho(): HTMLElement {
        return criarElementoHtml('span', ['label-item-adicionado'], [], 'Adicionado ao carrinho');
    }

    htmlFiltroDoProdutoPorAtributo(atributo: string, titulo: string): HTMLElement {
        const select = criarElementoHtml('select', ['form-select'], [{nome: 'name', valor: `filtro-${atributo}`}]);
        const option = criarElementoHtml('option', [], [{nome: 'value', valor: ''}, {nome: 'label', valor: titulo}]);
        select.appendChild(option);
        const filtros = this.apiProduto.filtros();
        filtros.has(atributo) && filtros.get(atributo).map(valor => {
            const option = criarElementoHtml('option', [], [{nome: 'value', valor}, {nome: 'label', valor}]);
            select.appendChild(option);
        });
        return select;
    }

    filtroPorMarca(): HTMLElement {
        const filtroMarca = this.htmlFiltroDoProdutoPorAtributo('marca', 'Marca');
        filtroMarca.addEventListener('change', (event) => {
            event.preventDefault();
            this.itens = this.apiProduto.filtrarPorMarca((event.target as HTMLInputElement).value);
            this.atualizarHtmlCartoesDosProdutos();
        });
        return filtroMarca;
    }

    fitroPorCategoria(): HTMLElement {
        const filtro = this.htmlFiltroDoProdutoPorAtributo('categorias', 'Categoria');
        filtro.addEventListener('change', (event) => {
            event.preventDefault();
            this.itens = this.apiProduto.filtrarPorCategoria((event.target as HTMLInputElement).value);
            this.atualizarHtmlCartoesDosProdutos();
        });
        return filtro;
    }

    filtroPorNome(): HTMLElement {
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
                this.atualizarHtmlCartoesDosProdutos();
            }, this._filtroAtraso);
        });
        return filtro;
    }

    filtroCodigoDeBarras(): HTMLElement {
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
                this.atualizarHtmlCartoesDosProdutos();
            }, this._filtroAtraso);
        });
        return filtro;
    }

    filtroPorPreco(): HTMLElement {
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
                this.atualizarHtmlCartoesDosProdutos();
            }, this._filtroAtraso);
        });
        div.appendChild(filtroPorPreco);
        div.appendChild(mostradorValor);
        return div;
    }

    botaoListarRemoverFiltro(): HTMLElement {
        const botaoListarTodos = criarElementoHtml('button', ['btn', 'btn-info'], [], 'Listar todos os produtos');
        botaoListarTodos.addEventListener('click', (event) => {
            event.preventDefault();
            if (this.apiProduto.produtos.length > this.itens.length) {
                this.pegaDadosDosProdutos();
            }
        });
        return botaoListarTodos;
    }

    htmlFiltrosDosProdutos(): HTMLElement {
        const form = criarElementoHtml(
            'form',
            ['lista-de-produtos-filtros', 'row', 'g-3', 'align-items-center']
        );
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

    htmlCartoesDosProdutos(): HTMLElement {
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
            let precoFormatado = formataNumeroEmDinheiro(produto.preco);
            const divProduto = criarElementoHtml('div', ['col']);
            divProduto.setAttribute('id', `produto-id-${produto.id}`);
            divProduto.innerHTML = `<div class="card">
        <img height="200" width="200" src="${produto.imagem}" alt="${produto.nome}" class="card-img-top img-fluid img-thumbnail" />
        <div class="card-body">
          <h2 class="card-title">${produto.nome}</h2>
          <p class="card-text fs-6">${produto.descricao}</p>
          <div class="card-footer">
            <h3 class="price">R$ ${precoFormatado} </h3>
            <form class="row row-cols-lg-auto g-3 align-items-center">
                <div class="linha-acao mb-3">
                    <input id="quantidade-${produto.id}"
                        type="number" step="1" min="1" max="100"
                        aria-label="Quantidade" class="form-control"
                        value="${produtoEstaNoCarrinho?.quantidade || 1}" />
                    <button class="input-group-text botao-adicionar">
                        Adicionar
                    </button>
                </div>
            </form>
          </div>
        </div>
    </div>`;
            if (produtoEstaNoCarrinho?.quantidade) {
                divProduto.querySelector('.card')
                    .append(this.htmlInformacaoProdutoAdicionadoNoCarrinho());
            }
            divProduto.querySelector('.botao-adicionar')
                .addEventListener('click', (event) => {
                    event.preventDefault();
                    this.adicionar(produto);
                });
            div.appendChild(divProduto);
        });
        return div;
    }

    htmlItens(): HTMLElement {
        const main = criarElementoHtml('main', ['listagem-de-produtos']);
        main.appendChild(this.htmlFiltrosDosProdutos());
        main.appendChild(this.htmlCartoesDosProdutos());
        return main;
    };

    atualizarQuantidadeDeItensNoCarrinho() {
        const informaQuantidadeNoCarrinho = criarElementoHtml('span', ['label-quantidade'], [], String(this.carrinho.produtos.length));
        const menuCarrinho = document.getElementById('menu-carrinho');
        menuCarrinho.querySelector('.label-quantidade')?.remove();
        menuCarrinho.appendChild(informaQuantidadeNoCarrinho);
    }

    atualizarHtmlCartoesDosProdutos() {
        this.paginaAtual = 1;
        document.dispatchEvent(new CustomEvent('atualizar-produtos', {detail: 'conteudo'}));
    }

    eventos() {
        document.addEventListener('atualizar-produtos', (event) => {
            event.preventDefault();
            this.htmlCartoesDosProdutos();
            this.htmlPaginacao();
        });
    }
}