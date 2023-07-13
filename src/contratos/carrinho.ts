import {IProduto} from "./entidades/produto";
import {IRegraPromocional} from "./regrapromocional";

export interface ICarrinhoTotalizador {
    quantidade_produtos: number;
    valor_total: number;
    valor_subtotal: number;
    valor_desconto: number;
    detalhes_decontos: string[];
}

export interface ICarrinhoProduto {
    quantidade: number;
    preco_unitario: number;
    desconto: number;
    produto: IProduto;
    personalizacao?: string;
}

export interface ICarrinho {
    produtos: ICarrinhoProduto[];
    brindes: ICarrinhoProduto[];
    promocoes: IRegraPromocional[];
    totalizador: ICarrinhoTotalizador;
    adicionarProduto: (produto: IProduto, quantidade?: number, update?: boolean, personalizacao?: string) => void;
    removerProduto: (produto: IProduto) => void;
    adicionarBrinde: (produto: IProduto, quantidade?: number) => void;
    removerBrinde: (produto: IProduto) => void;
    aplicarPromocoes: () => void;
    totalizar: () => void;
}