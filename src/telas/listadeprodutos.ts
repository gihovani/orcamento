import {IListaDeProduto} from "../contratos/listadeprodutos";
import {formataNumeroEmDinheiro} from "../util/helper";
import {IProduto} from "../contratos/produto";
import {ICarrinho} from "../contratos/carrinho";

export class HTMLListaDeProduto {
    public numeroItensPorPagina = 12;
    public paginaAtual = 1;
    public ultimaPagina = 1;
    private produtos: IProduto[] = [];

    constructor(public elemento: HTMLElement, public listaDeProdutos: IListaDeProduto, public carrinho: ICarrinho) {
        this.produtos = this.listaDeProdutos.produtos;
    }

    adicionar(produto: IProduto) {
        this.carrinho.adicionarProduto(produto);
        alert(`Produto ${produto.id} foi adicionado com sucesso!`);

        this.carrinho.totalizar();
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
        const select = document.createElement('select');
        select.setAttribute('name', `filtro-${atributo}`);
        const option = document.createElement('option');
        option.setAttribute('value', '');
        option.setAttribute('label', titulo);
        select.appendChild(option);
        this.listaDeProdutos.filtros.get(atributo).map(valor => {
            const option = document.createElement('option');
            option.setAttribute('value', valor);
            option.setAttribute('label', valor);
            select.appendChild(option);
        });
        return select;
    }
    htmlFiltroDosProdutos(): HTMLElement {
        const divFiltro = document.createElement('div');
        divFiltro.classList.add('lista-de-produtos-filtros');
        const filtroMarca = this.htmlFiltroDoProdutoPorAtributo('marca', 'Marca');
        filtroMarca.addEventListener('change', (event) => {
            this.produtos = this.listaDeProdutos.filtrarPorMarca((event.target as HTMLInputElement).value);
            this.renderizar();
        });
        divFiltro.appendChild(filtroMarca);

        const filtroCategoria = this.htmlFiltroDoProdutoPorAtributo('categorias', 'Categoria');
        filtroCategoria.addEventListener('change', (event) => {
            this.produtos = this.listaDeProdutos.filtrarPorCategoria((event.target as HTMLInputElement).value);
            this.renderizar();
        });
        divFiltro.appendChild(filtroCategoria);
        return divFiltro;
    }
    htmlListaDeProdutos(): HTMLElement {
        const self = this;
        const divListagem = document.createElement('div');
        divListagem.classList.add("lista-de-produtos");
        this.produtosPaginado().map(produto => {
            // let search = basket.find((x) => x.id === id) || [];
            let precoFormatado = formataNumeroEmDinheiro(produto.preco);
            const divProduto = document.createElement('div');
            divProduto.classList.add('produto');
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
                .addEventListener('click', () => self.adicionar(produto));
            divListagem.appendChild(divProduto);
        });
        return divListagem;
    };

    htmlPaginacao(): HTMLElement {
        const divPaginacao = document.createElement('div');
        divPaginacao.classList.add('lista-de-produtos-paginacao');
        if (!this.temPaginacao()) {
            return divPaginacao;
        }

        const botaoVoltar = document.createElement('button');
        botaoVoltar.classList.add('botao-voltar');
        botaoVoltar.setAttribute('disabled', 'disabled');
        botaoVoltar.innerText = 'Voltar';
        if (this.temPaginaAnterior()) {
            botaoVoltar.removeAttribute('disabled');
            botaoVoltar.addEventListener('click', () => this.paginaAnterior());
        }

        const botaoAvancar = document.createElement('button');
        botaoAvancar.classList.add('botao-avancar');
        botaoAvancar.setAttribute('disabled', 'disabled');
        botaoAvancar.innerText = 'Avançar';
        if (this.temProximaPagina()) {
            botaoAvancar.removeAttribute('disabled');
            botaoAvancar.addEventListener('click', () => this.proximaPagina());
        }
        divPaginacao.appendChild(botaoVoltar);
        divPaginacao.appendChild(botaoAvancar);
        return divPaginacao;
    }

    renderizar() {
        if (this.elemento.firstChild) {
            this.elemento.firstChild.remove();
        }
        const divListaDeProdutos = document.createElement('div');
        divListaDeProdutos.appendChild(this.htmlFiltroDosProdutos());
        divListaDeProdutos.appendChild(this.htmlListaDeProdutos());
        divListaDeProdutos.appendChild(this.htmlPaginacao());
        this.elemento.appendChild(divListaDeProdutos);
    }
}