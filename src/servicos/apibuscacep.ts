import {validarCEP} from "../util/validacoes";
import {Endereco} from "../entidades/endereco";
import {IEndereco} from "../contratos/entidades/endereco";
import {IApiCep} from "../contratos/servicos/apicep";

export class ApiCepMock implements IApiCep {
    consultar(cep: string): Promise<IEndereco> {
        return new Promise<IEndereco>((resolve, reject) => {
            if (!validarCEP(cep)) {
                reject('O Cep deve ser um némero válido! Ex: 88100-000');
                return;
            }
            const endereco = new Endereco(
                '88100-000',
                'Rua do GG2',
                'GG2',
                'Santa Catarina',
                'SC'
            );
            resolve(endereco);
        });
    }
}

export class ApiCepViaCep implements IApiCep {
    consultar(cep: string): Promise<IEndereco> {
        return new Promise<IEndereco>((resolve, reject) => {
            if (!validarCEP(cep)) {
                reject('O Cep deve ser um número válido! Ex: 88100-000');
                return;
            }
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (('erro' in data)) {
                        reject('CEP não encontrado na base de dados!');
                        return;
                    }
                    const endereco = new Endereco(
                        data['cep'],
                        data['logradouro'],
                        data['bairro'],
                        data['localidade'],
                        data['uf']
                    );
                    resolve(endereco);
                })
                .catch(error => reject('Erro ao buscar o endereço!'));
        });
    }
}