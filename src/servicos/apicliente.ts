import {Cliente} from "../entidades/cliente";
import {validarCPF} from "../util/validacoes";
import {IApiCliente} from "../contratos/servicos/apicliente";
import {ICliente} from "../contratos/entidades/cliente";

export class ApiClienteMock implements IApiCliente {
    dados: ICliente;
    constructor() {
        this.dados = new Cliente();
    }
    salvar(cliente: ICliente): Promise<ICliente> {
        this.dados = cliente;
        return new Promise<ICliente>((resolve, reject) => {
            if (!cliente.nome) {
                reject('O cliente não pode ser salvo!');
                return;
            }
            resolve(cliente)
        });
    }

    consultar(documento: string): Promise<ICliente> {
        return new Promise<ICliente>((resolve, reject) => {
            if (!validarCPF(documento)) {
                reject('O CPF deve ser um némero válido!');
                return;
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
    dados: ICliente;
    salvar(cliente: ICliente): Promise<ICliente> {
        this.dados = cliente;
        return new Promise<ICliente>((resolve, reject) => {
            if (!cliente.nome) {
                reject('O cliente não pode ser salvo!');
                return;
            }
            resolve(cliente)
        });
    }

    consultar(documento: string): Promise<ICliente> {
        return new Promise<ICliente>((resolve, reject) => {
            if (!validarCPF(documento)) {
                reject('O CPF deve ser um némero válido!');
                return;
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