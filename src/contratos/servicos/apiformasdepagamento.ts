import {IFormaDePagamento} from "../entidades/formadepagamento";

export interface IApiFormasDePagamento {
    dados: IFormaDePagamento;
    consultar(): Promise<IFormaDePagamento[]>;
}