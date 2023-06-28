import {IApiEndereco} from "../contratos/servicos/apiendereco";
import {IEndereco} from "../contratos/entidades/endereco";

export class ApiEnderecoMock implements IApiEndereco {
    dados: IEndereco;
    salvar(endereco: IEndereco): Promise<IEndereco> {
        this.dados = endereco;
        return new Promise<IEndereco>((resolve, reject) => {
            if (!endereco.cep) {
                reject('O endereco não pode ser salvo!');
                return;
            }
            resolve(endereco)
        });
    }
}

export class ApiClienteMagento implements IApiEndereco {
    dados: IEndereco;
    salvar(endereco: IEndereco): Promise<IEndereco> {
        this.dados = endereco;
        return new Promise<IEndereco>((resolve, reject) => {
            if (!endereco.cep) {
                reject('O endereco não pode ser salvo!');
                return;
            }
            resolve(endereco)
        });
    }
}