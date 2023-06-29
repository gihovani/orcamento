import {IEndereco} from "../entidades/endereco";

export interface IApiCep {
    dados: IEndereco;
    consultar(cep: string): Promise<IEndereco>;
}