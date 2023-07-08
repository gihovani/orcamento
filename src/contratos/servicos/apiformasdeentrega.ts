import {IFormaDeEntrega} from "../entidades/formadeentrega";
import {ICarrinho} from "../carrinho";
import {IEndereco} from "../entidades/endereco";

export interface IApiFormasDeEntrega {
    dados: IFormaDeEntrega;
    consultar(endereco: IEndereco, carrinho: ICarrinho): Promise<IFormaDeEntrega[]>;
}