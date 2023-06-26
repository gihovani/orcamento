import {IProduto} from "../entidades/produto";

export interface IApiProduto {
    filtrarPorCategoria: (nome: string) => IProduto[];
    filtrarPorMarca: (nome: string) => IProduto[];
    filtrarPorPreco: (valorMinimo: number, valorMaximo: number) => IProduto[];
    filtrarPorCodigoBarra: (codigoBarra: string) => IProduto[];
    filtros: () => Map<string, string[]>;
    consultar: (id: string) => IProduto | undefined;
    listar: () => Promise<IProduto[]>;
}