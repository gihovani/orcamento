import {IFormaDeEntrega} from "../entidades/formadeentrega";
import {ICarrinho} from "../carrinho";

export interface IApiFormasDeEntrega {
    consultar(cep: string, carrinho: ICarrinho): Promise<IFormaDeEntrega[]>;
}