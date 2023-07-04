import {ICarrinho} from "../carrinho";

export interface IApiCarrinho {
    totalizar(): Promise<ICarrinho>;
}