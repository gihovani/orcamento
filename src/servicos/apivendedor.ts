import {IVendedor} from "../contratos/entidades/vendedor";
import {Vendedor} from "../entidades/vendedor";
import {IApiVendedor} from "../contratos/servicos/apivendedor";


export class ApiVendedorMock implements IApiVendedor {
    private vendedor: Vendedor;
    autenticar(login: string, senha: string): Promise<IVendedor> {
        return new Promise<IVendedor>((resolve, reject) => {
            if (login !== 'gg2' || senha !== 'gg2') {
                reject('Login e Senha Inválidos!');
            }
            this.vendedor = new Vendedor('Dino da Silva Sauro', login, '', true);
            resolve(this.vendedor);
        });
    }
    estaLogado(): boolean {
        return this.vendedor !== undefined && this.vendedor.estaAtivo;
    }
}