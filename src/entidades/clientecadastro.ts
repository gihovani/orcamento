import {ICliente} from "../contratos/cliente";
import {IEndereco} from "../contratos/endereco";
import {IClienteCadastro} from "../contratos/clientecadastro";

export class ClienteCadastro implements IClienteCadastro {
    cliente: ICliente;
    endereco: IEndereco;

    salvar() {
        if (!this.cliente) {
            throw new Error('Cliente não informado');
        }
        if (!this.endereco) {
            throw new Error('Endereço não informado');
        }
        /*
        this._apiCliente.salvar(this.cliente, this.endereco)
            .then(cliente => {
                this.cliente = cliente;
            })
            .catch(error => console.log(error));
        */
    }
}
