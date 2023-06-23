import {ICliente} from "../contratos/cliente";
import {IEndereco} from "../contratos/endereco";
import {IApiCep} from "../servicos/apibuscacep";
import {IApiCliente} from "../servicos/apicliente";

export class ClienteCadastro {
    private _cliente: ICliente;
    private _endereco: IEndereco;

    constructor(private _apiCep: IApiCep, private _apiCliente: IApiCliente) {
    }

    set cliente(cliente: ICliente) {
        this._cliente = cliente;
    }

    set endereco(endereco: IEndereco) {
        this._endereco = endereco;
    }

    get cliente() {
        return this._cliente;
    }

    get endereco() {
        return this._endereco;
    }

    buscarEnderecoPorCep(cep: string) {
        this._apiCep.consultar(cep)
            .then(endereco => {
                this.endereco = endereco;
            })
            .catch(error => console.log(error));
    }

    buscarClientePorDocumento(documento: string) {
        this._apiCliente.consultar(documento)
            .then(cliente => {
                this.cliente = cliente;
            })
            .catch(error => console.log(error));
    }
}