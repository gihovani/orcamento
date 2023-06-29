import {IProduto} from "../entidades/produto";


export type IApiProdutoFiltro = Map<string, string[]>;
export type IApiProdutoCache = { produtos: IProduto[], filtros: IApiProdutoFiltro };
export type IApiProdutoFaixaPreco = { minimo: number, maximo: number };

export interface IApiProduto {
    produtos: IProduto[];
    faixaDePrecos: IApiProdutoFaixaPreco;

    filtrarPorCategoria: (nome: string) => IProduto[];
    filtrarPorMarca: (nome: string) => IProduto[];
    filtrarPorPreco: (valorMinimo: number, valorMaximo: number) => IProduto[];
    filtrarPorCodigoBarra: (codigoBarra: string) => IProduto[];
    filtrarPorNome: (nome: string) => IProduto[];
    filtrarPorSku: (sku: string) => IProduto[];
    filtros: () => Map<string, string[]>;
    consultar: (id: string) => IProduto | undefined;
    listar: (limparCache: boolean) => Promise<IProduto[]>;
}