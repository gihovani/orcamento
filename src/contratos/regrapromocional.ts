import {ICarrinhoProduto} from "./carrinho";

/**
 * - tipos
 * -- valor_porcentagem : Percentagem do desconto do preço do produto
 * -- valor_fixo : Desconto de valor fixo por produto
 * -- valor_unico : Desconto de valor fixo para todo o carrinho
 * -- brinde_unico : Adicionar automaticamente itens promocionais
 * -- brinde_escolha : Adicionar automaticamente itens promocionais a cada
 *
 *
 * - operações
 * --  == : igual
 * --  != : diferente
 * --  > : maior
 * --  < : menor
 * --  >= : maior ou igual
 * --  <= : menor ou igual
 * --  {} : contém
 * --  !{} : não contém
 * --  () : é um dos
 * --  !() : não é um dos
 */
export interface IRegraPromocionalCondicao {
    tipo: 'id' | 'preco' | 'categorias' | 'marca';
    operacao: 'igual' | 'diferente' | 'maior' | 'menor' | 'maior_igual' | 'menor_igual' | 'e_um_dos' | 'nao_e_um_dos';
    valor: string;
}

export interface IRegraPromocionalAcao {
    tipo: 'desconto_porcentagem' | 'desconto_fixo' | 'valor_unitario' | 'brinde_unico' | 'brinde_escolha';
    valor: number;
    valor_maximo?: number;
    skus?: string[];
}

export interface IRegraPromocional {
    nome: string;
    prioridade: number;
    situacao: boolean;
    dataInicio: Date;
    dataFim: Date;
    condicoes: IRegraPromocionalCondicao[];
    acao: IRegraPromocionalAcao;
    descricao?: string;
    atendeCriteriosDaPromocao: (produtos: ICarrinhoProduto[]) => boolean;
    aplicarPromocao: () => void;
}