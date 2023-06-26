import {criarElementoHtml, formataNumeroEmDinheiro} from "../util/helper";
import {ICarrinho} from "../contratos/carrinho";
import {Tela} from "../contratos/tela";
import {IProduto} from "../contratos/entidades/produto";
import {IApiProduto} from "../contratos/servicos/apiproduto";

export class ListagemDeProdutos extends Tela {
    private temFiltro = false;
    public numeroItensPorPagina = 16;
    public paginaAtual = 1;
    public ultimaPagina = 1;
    private produtos: IProduto[] = [];

    constructor(public elemento: HTMLElement, public apiProduto: IApiProduto, public carrinho: ICarrinho) {
        super();
        this.apiProduto.listar().then((produtos) => {
            this.produtos = produtos;
            this.renderizar();
        });
    }

    adicionar(produto: IProduto) {
        const inputQuantidade = document.getElementById( `quantidade-${produto.id}`) as HTMLInputElement;
        let quantidade = 1;
        if (inputQuantidade) {
            quantidade = parseInt(inputQuantidade.value);
        }
        this.carrinho.adicionarProduto(produto, quantidade);
        alert(`Produto ${produto.id} foi adicionado com sucesso!`);
        this.carrinho.totalizar(true);
        console.log(this.carrinho);
    }

    temProximaPagina(): boolean {
        return this.paginaAtual < this.ultimaPagina;
    }

    proximaPagina() {
        if (this.temProximaPagina()) {
            this.paginaAtual++;
        }
        this.renderizar();
    }

    temPaginaAnterior(): boolean {
        return this.paginaAtual > 1;
    }

    paginaAnterior() {
        if (this.temPaginaAnterior()) {
            this.paginaAtual--;
        }
        this.renderizar();
    }

    temPaginacao(): boolean {
        this.ultimaPagina = Math.ceil(this.produtos.length / this.numeroItensPorPagina);
        return this.ultimaPagina > 1;
    }

    paginaNumero(numero: number) {
        if (this.ultimaPagina >= numero && numero > 0) {
            this.paginaAtual = numero;
        }
        this.renderizar();
    }

    produtosPaginado(): IProduto[] {
        if (!this.temPaginacao()) {
            return this.produtos;
        }

        let paginacao: IProduto[] = [];
        const produtos = this.produtos;
        const inicio = (this.paginaAtual * this.numeroItensPorPagina) - this.numeroItensPorPagina;
        const limite = inicio + this.numeroItensPorPagina;
        for (let i = inicio; i < limite; i++) {
            if (produtos[i] != null) {
                paginacao.push(produtos[i]);
            }
        }
        return paginacao;
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

    htmlFiltroDosProdutos(): HTMLElement {
        const divFiltro = criarElementoHtml('div', ['lista-de-produtos-filtros', 'row', 'g-3', 'align-items-center']);
        const filtroMarca = this.htmlFiltroDoProdutoPorAtributo('marca', 'Marca');
        filtroMarca.addEventListener('change', (event) => {
            this.temFiltro = true;
            this.produtos = this.apiProduto.filtrarPorMarca((event.target as HTMLInputElement).value);
            this.renderizar();
        });
        divFiltro.appendChild(filtroMarca);

        const filtroCategoria = this.htmlFiltroDoProdutoPorAtributo('categorias', 'Categoria');
        filtroCategoria.addEventListener('change', (event) => {
            this.temFiltro = true;
            this.produtos = this.apiProduto.filtrarPorCategoria((event.target as HTMLInputElement).value);
            this.renderizar();
        });
        divFiltro.appendChild(filtroCategoria);

        const removerFiltro = criarElementoHtml('button', ['btn', 'btn-info'], [], 'Todos');
        if (!this.temFiltro) {
            removerFiltro.setAttribute('disabled', 'disabled');
        }
        removerFiltro.addEventListener('click', () => {
            this.temFiltro = false;
            this.apiProduto.listar().then((produtos) => {
                this.produtos = produtos;
                this.renderizar();
            });
        });
        divFiltro.appendChild(removerFiltro);

        return divFiltro;
    }

    htmlListaDeProdutos(): HTMLElement {
        const div = criarElementoHtml('div', ['lista-de-produtos', 'row', 'row-cols-1', 'row-cols-sm-2', 'row-cols-md-4', 'g-4']);
        this.produtosPaginado().map(produto => {
            // let search = basket.find((x) => x.id === id) || [];
            let precoFormatado = formataNumeroEmDinheiro(produto.preco);
            const divProduto = criarElementoHtml('div', ['col']);
            divProduto.setAttribute('id', `produto-id-${produto.id}`);
            divProduto.innerHTML = `<div class="card shadow-sm">
        <img height="200" src="${produto.imagem}" alt="${produto.nome}" class="card-img-top img-fluid img-thumbnail" />
        <div class="card-body">
          <h2 class="card-title">${produto.nome}</h2>
          <p class="card-text">${produto.descricao}</p>
          <div class="card-footer">
            <h3 class="text-center">R$ ${precoFormatado} </h3>
            <form class="row row-cols-lg-auto g-3 align-items-center">
            <div class="input-group mb-3">
              <input id="quantidade-${produto.id}" class="form-control" type="number" step="1" min="1" max="100" value="1" aria-label="Quantidade" />
              <button class="input-group-text botao-adicionar"><i class="bi bi-plus-lg"></i></button>
            </div>
            </form>
          </div>
        </div>
    </div>`;
            divProduto.querySelector('.botao-adicionar')
                .addEventListener('click', () => this.adicionar(produto));
            div.appendChild(divProduto);
        });
        return div;
    };
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
        const div = criarElementoHtml('div', ['lista-de-produtos-paginacao', 'row']);
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

    conteudo(): HTMLElement {
        const div = criarElementoHtml('div');
        div.appendChild(this.htmlFiltroDosProdutos());
        div.appendChild(this.htmlListaDeProdutos());
        div.appendChild(this.htmlPaginacao());
        return div;
    }
}