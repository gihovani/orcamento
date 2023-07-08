import {IEndereco} from "./endereco";

export interface IFormaDeEntrega {
    tipo: string;
    titulo: string;
    prazodeentrega: string;
    valor: number;
    observacoes?: string;
    endereco?: IEndereco;
}