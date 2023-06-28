import {IEndereco} from "../entidades/endereco";

export interface IApiEndereco {
    dados: IEndereco;
    salvar(endereco: IEndereco): Promise<IEndereco>;
}