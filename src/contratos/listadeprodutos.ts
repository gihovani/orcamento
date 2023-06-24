import {IProduto} from "./produto";

export interface IListaDeProduto {
    filtros: Map<string, string[]>;
    produtos: IProduto[];

    filtrarPorCategoria: (nome: string) => IProduto[];
    filtrarPorMarca: (nome: string) => IProduto[];
    filtrarPorPreco: (valorMinimo: number, valorMaximo: number) => IProduto[];
    filtrarPorCodigoBarra: (codigoBarra: string) => IProduto[];
    dadosProduto: (id: string) => IProduto | undefined;
    atualizaFiltros: () => void;
}