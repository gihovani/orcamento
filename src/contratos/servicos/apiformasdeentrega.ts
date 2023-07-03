import {IFormaDeEntrega} from "../entidades/formadeentrega";
import {ICarrinho} from "../carrinho";

export interface IApiFormasDeEntrega {
    dados: IFormaDeEntrega;
    consultar(cep: string, carrinho: ICarrinho): Promise<IFormaDeEntrega[]>;
}