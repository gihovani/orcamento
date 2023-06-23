import {IProduto} from "../contratos/produto";

export class ListaDeProduto {
    filtros: Map<string, string[]>;
    produtos: IProduto[];

    constructor() {
        this.produtos = [];
        this.filtros = new Map();
    }

    adicionarProduto(produto: IProduto) {
        this.produtos.push(produto);
    }

    adicionarFiltro(atributo: string, valor: string) {
        if (!valor) return;
        if (this.filtros.has(atributo)) {
            const filtro = this.filtros.get(atributo);
            const item = filtro.find(filtroValor => filtroValor === valor);
            if (!item) {
                filtro.push(valor);
            }
        } else {
            this.filtros.set(atributo, [valor]);
        }
    }

    filtraProdutos(atributo: string, valor: string) {
        this.produtos = this.produtos.filter(item => item[atributo] === valor);
    }

    filtrarPorCategoria(nome: string) {
        this.filtraProdutos('categorias', nome);
    }

    filtrarPorMarca(nome: string) {
        this.filtraProdutos('marca', nome);
    }

    filtrarPorPreco(valorMinimo: number, valorMaximo: number) {
        this.produtos = this.produtos.filter(item => item.preco >= valorMinimo && item.preco <= valorMaximo);
    }

    dadosProduto(id: string): IProduto {
        return this.produtos.find(produto => produto.id === id);
    }

    atualizaFiltros() {
        this.filtros = new Map();
        for (const produto of this.produtos) {
            this.adicionarFiltro('categorias', produto.categorias);
            this.adicionarFiltro('marca', produto.marca);
        }
    }
}
