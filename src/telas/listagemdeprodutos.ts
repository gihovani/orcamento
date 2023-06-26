import {criarElementoHtml, formataNumeroEmDinheiro} from "../util/helper";
import {ICarrinho} from "../contratos/carrinho";
import {IProduto} from "../contratos/entidades/produto";
import {IApiProduto} from "../contratos/servicos/apiproduto";
import {TelaComPaginacao} from "./telacompaginacao";

export class ListagemDeProdutos extends TelaComPaginacao {
    private temFiltro = false;

    constructor(public apiProduto: IApiProduto, public carrinho: ICarrinho) {
        super();
        this.apiProduto.listar().then((produtos) => {
            this.itens = produtos;
            document.dispatchEvent(new CustomEvent('atualizar-tela', {detail: 'conteudo'}));
        });
    }

    adicionar(produto: IProduto) {
        const inputQuantidade = document.getElementById(`quantidade-${produto.id}`) as HTMLInputElement;
        let quantidade = 1;
        if (inputQuantidade) {
            quantidade = parseInt(inputQuantidade.value);
        }
        alert(`Produto ${produto.id} foi adicionado com sucesso!`);

        const cardProduto = document.querySelector(`#produto-id-${produto.id} .card`);
        cardProduto.classList.add('bg-success');
        this.carrinho.adicionarProduto(produto, quantidade);
        this.carrinho.totalizar(true);
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
        const form = criarElementoHtml('form', ['lista-de-produtos-filtros', 'row', 'g-3', 'align-items-center']);
        const div = criarElementoHtml('div', ['col-12', 'input-group', 'pt-3', 'pb-3']);
        const filtroMarca = this.htmlFiltroDoProdutoPorAtributo('marca', 'Marca');
        filtroMarca.addEventListener('change', (event) => {
            this.temFiltro = true;
            this.itens = this.apiProduto.filtrarPorMarca((event.target as HTMLInputElement).value);
            document.dispatchEvent(new CustomEvent('atualizar-tela', {detail: 'conteudo'}));
        });
        div.appendChild(filtroMarca);

        const filtroCategoria = this.htmlFiltroDoProdutoPorAtributo('categorias', 'Categoria');
        filtroCategoria.addEventListener('change', (event) => {
            this.temFiltro = true;
            this.itens = this.apiProduto.filtrarPorCategoria((event.target as HTMLInputElement).value);
            document.dispatchEvent(new CustomEvent('atualizar-tela', {detail: 'conteudo'}));
        });
        div.appendChild(filtroCategoria);

        const removerFiltro = criarElementoHtml('button', ['btn', 'btn-info'], [], 'Todos');
        if (!this.temFiltro) {
            removerFiltro.setAttribute('disabled', 'disabled');
        }
        removerFiltro.addEventListener('click', () => {
            this.temFiltro = false;
            this.apiProduto.listar().then((produtos) => {
                this.itens = produtos;
                document.dispatchEvent(new CustomEvent('atualizar-tela', {detail: 'conteudo'}));
            });
        });
        div.appendChild(removerFiltro);
        form.appendChild(div);
        return form;
    }

    htmlItens(): HTMLElement {
        const div = criarElementoHtml('div');
        div.appendChild(this.htmlFiltroDosProdutos());

        const divProdutos = criarElementoHtml('div', ['lista-de-produtos', 'row', 'row-cols-1', 'row-cols-sm-2', 'row-cols-md-4', 'g-4']);
        this.itensPaginado().map(produto => {
            let produtoEstaNoCarrinho = this.carrinho.produtos.find((item) => item.produto.id === produto.id);
            let precoFormatado = formataNumeroEmDinheiro(produto.preco);
            const divProduto = criarElementoHtml('div', ['col']);
            divProduto.setAttribute('id', `produto-id-${produto.id}`);
            divProduto.innerHTML = `<div class="card shadow-sm ${produtoEstaNoCarrinho ? 'bg-success' : ''}">
        <img height="200" src="${produto.imagem}" alt="${produto.nome}" class="card-img-top img-fluid img-thumbnail" />
        <div class="card-body">
          <h2 class="card-title">${produto.nome}</h2>
          <p class="card-text">${produto.descricao}</p>
          <div class="card-footer">
            <h3 class="text-center">R$ ${precoFormatado} </h3>
            <form class="row row-cols-lg-auto g-3 align-items-center">
            <div class="input-group mb-3">
              <input id="quantidade-${produto.id}"
                type="number" step="1" min="1" max="100"
                aria-label="Quantidade" class="form-control"
                value="${produtoEstaNoCarrinho?.quantidade || 1}" />
              <button class="input-group-text botao-adicionar">
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
            </form>
          </div>
        </div>
    </div>`;
            divProduto.querySelector('.botao-adicionar')
                .addEventListener('click', (e) => {
                    e.preventDefault();
                    this.adicionar(produto)
                });
            divProdutos.appendChild(divProduto);
        });
        div.appendChild(divProdutos);
        return div;
    };
}