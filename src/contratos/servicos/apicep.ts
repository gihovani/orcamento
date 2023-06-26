import {IEndereco} from "../entidades/endereco";

export interface IApiCep {
    consultar(cep: string): Promise<IEndereco>;
}