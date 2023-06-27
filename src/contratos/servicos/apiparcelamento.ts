import {ICarrinho} from "../carrinho";

export interface IApiParcelamento {
    consultar(tipo: string, carrinho: ICarrinho): Promise<number>;
}