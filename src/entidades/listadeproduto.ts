import {IProduto} from "../contratos/produto";
import {IListaDeProduto} from "../contratos/listadeprodutos";

export class ListaDeProduto implements IListaDeProduto {
    private _filtros: Map<string, string[]>;
    private _produtos: IProduto[];

    constructor(produtos: IProduto[] = []) {
        this.produtos = produtos;
    }

    set produtos(produtos: IProduto[]) {
        this._produtos = produtos;
        this.atualizaFiltros();
    }

    get produtos(): IProduto[] {
        return this._produtos;
    }

    get filtros(): Map<string, string[]> {
        return this._filtros;
    }

    private adicionarFiltro(atributo: string, valor: string) {
        if (!valor) return;
        if (this._filtros.has(atributo)) {
            const filtro = this._filtros.get(atributo);
            const item = filtro.find(filtroValor => filtroValor === valor);
            if (!item) {
                filtro.push(valor);
            }
        } else {
            this._filtros.set(atributo, [valor]);
        }
    }

    private filtraProdutos(atributo: string, valor: string): IProduto[] {
        return this.produtos.filter(item => item[atributo] === valor);
    }

    filtrarPorCategoria(nome: string): IProduto[] {
        return this.filtraProdutos('categorias', nome);
    }

    filtrarPorMarca(nome: string): IProduto[] {
        return this.filtraProdutos('marca', nome);
    }

    filtrarPorCodigoBarra(codigoBarra: string): IProduto[] {
        return this.filtraProdutos('codigo_barras', codigoBarra);
    }

    filtrarPorPreco(valorMinimo: number, valorMaximo: number): IProduto[] {
        return this.produtos.filter(item => item.preco >= valorMinimo && item.preco <= valorMaximo);
    }

    dadosProduto(id: string): IProduto | undefined {
        return this._produtos.find(produto => produto.id === id);
    }

    atualizaFiltros() {
        this._filtros = new Map();
        for (const produto of this.produtos) {
            this.adicionarFiltro('categorias', produto.categorias);
            this.adicionarFiltro('marca', produto.marca);
        }
    }
}
