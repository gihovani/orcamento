import {IVendedor} from "../contratos/entidades/vendedor";
import {Vendedor} from "../entidades/vendedor";
import {IApiVendedor} from "../contratos/servicos/apivendedor";


export class ApiVendedorMock implements IApiVendedor {
    private vendedor: Vendedor;
    autenticar(login: string, senha: string): Promise<IVendedor> {
        return new Promise<IVendedor>((resolve, reject) => {
            if (login === 'gg2' && senha === 'gg2') {
                this.vendedor = new Vendedor('Dino da Silva Sauro', login, '', true, true);
            }
            if (login === 'teste' && senha === 'teste') {
                this.vendedor = new Vendedor('Usuário de Teste HSB', login, '', true, false);
            }
            if (this.vendedor !== undefined && this.vendedor.esta_ativo) {
                resolve(this.vendedor);
                return;
            }
            reject('Login e Senha Inválidos!');
        });
    }
    estaLogado(): boolean {
        return this.vendedor !== undefined && this.vendedor.esta_ativo;
    }
    ehAdministrador(): boolean {
        return this.vendedor !== undefined && this.vendedor.administrador;
    }
}