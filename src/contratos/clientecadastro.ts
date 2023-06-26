import {IEndereco} from "./endereco";
import {ICliente} from "./cliente";

export class IClienteCadastro {
    cliente: ICliente;
    endereco: IEndereco;
    salvar: () => void;
}