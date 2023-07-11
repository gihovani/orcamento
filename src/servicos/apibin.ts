import {IApiBin} from "../contratos/servicos/apibin";


export class ApiBin implements IApiBin {
    consultar(numero: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (numero.startsWith('4')) {
                resolve('VISA');
                return;
            }
            if (numero.startsWith('5')) {
                resolve('MASTERCARD');
                return;
            }
            reject('A bandeira do cartão não pode ser encontrada!');
        });
    }
}