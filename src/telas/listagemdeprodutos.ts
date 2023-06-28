import {criarElementoHtml, formataNumeroEmDinheiro} from "../util/helper";
import {ICarrinho} from "../contratos/carrinho";
import {IProduto} from "../contratos/entidades/produto";
import {IApiProduto} from "../contratos/servicos/apiproduto";
import {TelaComPaginacao} from "./telacompaginacao";
import {INotificacao} from "../contratos/componentes/notificacao";
import {ICarregando} from "../contratos/componentes/carregando";

export class ListagemDeProdutos extends TelaComPaginacao {
    private temFiltro = false;

    constructor(
        public apiProduto: IApiProduto,
        public carrinho: ICarrinho,
        public notificacao: INotificacao,
        public carregando: ICarregando
    ) {
        super();
        this.pegaDadosDosProdutos();
    }

    pegaDadosDosProdutos () {
        this.carregando.mostrar()
        this.apiProduto.listar(false).then((produtos) => {
            this.itens = produtos;
            document.dispatchEvent(new CustomEvent('atualizar-tela', {detail: 'conteudo'}));
        }).finally(() => this.carregando.esconder());
    }

    adicionar(produto: IProduto) {
        const inputQuantidade = document.getElementById(`quantidade-${produto.id}`) as HTMLInputElement;
        const carrinhoMenu = document.querySelectorAll('.navbar-nav li');
        const $carrinho = carrinhoMenu[carrinhoMenu.length- 2];
        let quantidadeItensUnicos;
        let labelCarrinho = document.createElement('span');
        let quantidade = 1;
        
        $carrinho.classList.add('menu-carrinho');
        labelCarrinho.classList.add('label-quantidade');
        if (inputQuantidade) {
            quantidade = parseInt(inputQuantidade.value);
        }
        this.notificacao.mostrar('Sucesso', `Produto ${produto.id} foi adicionado ao carrinho com sucesso!`,'success');
        const cardProduto = document.querySelector(`#produto-id-${produto.id} .card`);

        this.carrinho.adicionarProduto(produto, quantidade);
        this.carrinho.totalizar(true);
        quantidadeItensUnicos = this.carrinho.produtos.length;
        labelCarrinho.innerHTML = `${quantidadeItensUnicos}`;
        $carrinho.appendChild(labelCarrinho);
        this.htmlLabelProdutoAdicionadoNoCardDoProduto(cardProduto);
    }
    htmlLabelProdutoAdicionadoNoCardDoProduto(card) {
        const labelAdicionado = document.createElement('span');
        labelAdicionado.classList.add('label-item-adicionado');
        labelAdicionado.innerHTML = 'Adicionado ao carrinho';
        card.appendChild(labelAdicionado);
        setTimeout(() => {
            const labels = document.querySelectorAll('.label-item-adicionado');
            labels.forEach((label) => {
                label.remove();
            })
        },5000)
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
        const div = criarElementoHtml('div', ['col-12', 'input-filters', 'pt-3', 'pb-3']);
        const titleFilter = document.createElement('h2');
        const filtroMarca = this.htmlFiltroDoProdutoPorAtributo('marca', 'Marca');
        const inputNome = criarElementoHtml('input',[],[{nome:'name',valor:'produtoNome'}, {nome: 'type',valor:'text'}, {nome:'placeholder',valor:'Digite o nome do produto'}]);
        const codigoBarras = criarElementoHtml('input',[],[{nome:'name',valor:'codigoBarras'}, {nome: 'type',valor:'text'}, {nome:'placeholder',valor:'Digite o código de barras'}]);
        const rangePrice = criarElementoHtml('input',[],[{nome:'name',valor:'priceRange'}, {nome: 'type',valor:'range'},{nome: 'min',valor:'1'},{nome: 'max',valor:'100'},{nome: 'value',valor:'1'}]);

        titleFilter.innerHTML = 'Filtros';
        titleFilter.classList.add('filtersTitle');
        div.appendChild(titleFilter);
        div.appendChild(inputNome);
        div.appendChild(codigoBarras);
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

        const removerFiltro = criarElementoHtml('button', ['btn', 'btn-info'], [], 'Listar todos os produtos');
        if (!this.temFiltro) {
            removerFiltro.setAttribute('disabled', 'disabled');
        }
        removerFiltro.addEventListener('click', () => {
            this.temFiltro = false;
            this.pegaDadosDosProdutos();
        });
        div.appendChild(rangePrice);
        div.appendChild(removerFiltro);
        form.appendChild(div);
        return form;
    }
    htmlItens(): HTMLElement {
        const main = criarElementoHtml('main');
        main.appendChild(this.htmlFiltroDosProdutos());
        main.classList.add('listagem-content');
        const divProdutos = criarElementoHtml('div', ['lista-de-produtos', 'row', 'row-cols-2', 'row-cols-xs-2', 'row-cols-sm-3', 'row-cols-md-3', 'row-cols-xl-4', 'g-4']);
        this.itensPaginado().map(produto => {
            let produtoEstaNoCarrinho = this.carrinho.produtos.find((item) => item.produto.id === produto.id);
            let precoFormatado = formataNumeroEmDinheiro(produto.preco);
            const divProduto = criarElementoHtml('div', ['col']);
            divProduto.setAttribute('id', `produto-id-${produto.id}`);
            divProduto.innerHTML = `<div class="card ">
        <img height="200" src="${produto.imagem}" alt="${produto.nome}" class="card-img-top img-fluid img-thumbnail" />
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
            divProduto.querySelector('.botao-adicionar')
                .addEventListener('click', (e) => {
                    e.preventDefault();
                    this.adicionar(produto)
                });
            divProdutos.appendChild(divProduto);
        });
        main.appendChild(divProdutos);
        return main;
    };
}