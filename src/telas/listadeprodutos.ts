import {IListaDeProduto} from "../contratos/listadeprodutos";
import {criarElementoHtml, formataNumeroEmDinheiro} from "../util/helper";
import {IProduto} from "../contratos/produto";
import {ICarrinho} from "../contratos/carrinho";
import {Tela} from "../contratos/tela";

export class HTMLListaDeProduto extends Tela {
    private temFiltro = false;
    public numeroItensPorPagina = 15;
    public paginaAtual = 1;
    public ultimaPagina = 1;
    private produtos: IProduto[] = [];

    constructor(public elemento: HTMLElement, public listaDeProdutos: IListaDeProduto, public carrinho: ICarrinho) {
        super();
        this.produtos = this.listaDeProdutos.produtos;
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
        this.listaDeProdutos.filtros.get(atributo).map(valor => {
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
            this.produtos = this.listaDeProdutos.filtrarPorMarca((event.target as HTMLInputElement).value);
            this.renderizar();
        });
        divFiltro.appendChild(filtroMarca);

        const filtroCategoria = this.htmlFiltroDoProdutoPorAtributo('categorias', 'Categoria');
        filtroCategoria.addEventListener('change', (event) => {
            this.temFiltro = true;
            this.produtos = this.listaDeProdutos.filtrarPorCategoria((event.target as HTMLInputElement).value);
            this.renderizar();
        });
        divFiltro.appendChild(filtroCategoria);

        const removerFiltro = criarElementoHtml('button', ['btn', 'btn-info'], [], 'Todos');
        if (!this.temFiltro) {
            removerFiltro.setAttribute('disabled', 'disabled');
        }
        removerFiltro.addEventListener('click', () => {
            this.temFiltro = false;
            this.produtos = this.listaDeProdutos.produtos;
            this.renderizar();
        });
        divFiltro.appendChild(removerFiltro);

        return divFiltro;
    }

    htmlListaDeProdutos(): HTMLElement {
        const div = criarElementoHtml('div', ['lista-de-produtos', 'row']);
        this.produtosPaginado().map(produto => {
            // let search = basket.find((x) => x.id === id) || [];
            let precoFormatado = formataNumeroEmDinheiro(produto.preco);
            const divProduto = criarElementoHtml('div', ['col', 'produto', 'text-center']);
            divProduto.setAttribute('id', `produto-id-${produto.id}`);
            divProduto.innerHTML = `
        <img width="220" src="${produto.imagem}" alt="${produto.nome}" />
        <div class="detalhes">
          <h3>${produto.nome}</h3>
          <p>${produto.descricao}</p>
          <div class="preco-quantidade">
            <h2>R$ ${precoFormatado} </h2>
            <div class="botoes">
              <label for="quantidade-${produto.id}" class="sr-only">Quantidade</label>
              <input id="quantidade-${produto.id}" class="quantidade" type="number" step="1" min="1" max="100" value="1" />
              <button class="botao-adicionar"><i class="bi bi-plus-lg"></i></button>
            </div>
          </div>
        </div>
    `;
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

    html(): HTMLElement {
        const div = criarElementoHtml('div');
        div.appendChild(this.htmlFiltroDosProdutos());
        div.appendChild(this.htmlListaDeProdutos());
        div.appendChild(this.htmlPaginacao());
        return div;
    }
}