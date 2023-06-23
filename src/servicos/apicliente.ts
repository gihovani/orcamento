import {Cliente} from "../entidades/cliente";
import {validarCPF} from "../util/validacoes";
import {ICliente} from "../contratos/cliente";

export interface IApiCliente {
    consultar(documento: string): Promise<ICliente>;
}

export class ApiClienteMock implements IApiCliente {
    consultar(documento: string): Promise<ICliente> {
        return new Promise<ICliente>((resolve, reject) => {
            if (!validarCPF(documento)) {
                reject('O CPF deve ser um némero válido!');
            }
            const cliente = new Cliente(
                '041.843.018-78',
                'Dino da Silva Sauro',
                'M',
                '01/01/2000',
                'Cirurgião-Dentista',
                'dino@mt2015.com',
                'CRO-1234',
                'SC',
                '0.000.001',
                'SC',
                '(48) 99999-9999',
                '(48) 99999-9999'
            );
            resolve(cliente);
        });
    }
}

export class ApiClienteMagento implements IApiCliente {
    consultar(documento: string): Promise<ICliente> {
        return new Promise<ICliente>((resolve, reject) => {
            if (!validarCPF(documento)) {
                reject('O CPF deve ser um némero válido!');
            }
            documento = documento.replace(/\D/g, '');
            // fetch(`https://api.com.br/${documento}/`)
            //     .then(response => response.json())
            //     .then(data => {
            //         if (('erro' in data)) {
            //             reject('CPF não encontrado na base de dados!');
            //             return;
            //         }
                    const cliente = new Cliente(
                        '041.843.018-78',
                        'Dino da Silva Sauro',
                        'M',
                        '01/01/2000',
                        'Cirurgião-Dentista',
                        'dino@mt2015.com',
                        'CRO-1234',
                        'SC',
                        '0.000.001',
                        'SC',
                        '(48) 99999-9999',
                        '(48) 99999-9999'
                    );
                    resolve(cliente);
                // })
                // .catch(error => reject('Erro na requisição da api consulta cliente!'));
        });
    }
}