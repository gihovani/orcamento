import {validarCEP} from "../util/validacoes";
import {IFormaDeEntrega} from "../contratos/entidades/formadeentrega";
import {IApiFormasDeEntrega} from "../contratos/servicos/apiformasdeentrega";
import {FormaDeEntrega} from "../entidades/formadeentrega";
import {ICarrinho} from "../contratos/carrinho";
import {ApiConfiguracoes} from "./apiconfiguracoes";

export class ApiFormasDeEntregaMock implements IApiFormasDeEntrega {
    dados: IFormaDeEntrega;
    constructor() {
        this.dados = new FormaDeEntrega();
    }
    consultar(cep: string, carrinho: ICarrinho): Promise<IFormaDeEntrega[]> {
        return new Promise<IFormaDeEntrega[]>((resolve, reject) => {
            if (!validarCEP(cep)) {
                reject('O Cep deve ser um némero válido! Ex: 88100-000');
                return;
            }
            if (carrinho.produtos.length === 0) {
                reject(`Os produtos devem ser informados!`);
                return;
            }
            const formaDeEntrega = new FormaDeEntrega(
                'expresso',
                'Frete Expresso',
                'Chegará em até 31 dias úteis',
                0
            );
            resolve([formaDeEntrega]);
        });
    }
}

export class ApiFormasDeEntregaMagento implements IApiFormasDeEntrega {
    dados: IFormaDeEntrega;
    constructor() {
        this.dados = new FormaDeEntrega();
    }
    consultar(cep: string, carrinho: ICarrinho): Promise<IFormaDeEntrega[]> {
        const url_base = ApiConfiguracoes.instancia().loja.url_base;
        return new Promise<IFormaDeEntrega[]>(async (resolve, reject) => {
            if (!validarCEP(cep)) {
                reject('O Cep deve ser um némero válido! Ex: 88100-000');
                return;
            }
            if (carrinho.produtos.length === 0) {
                reject(`Os produtos devem ser informados!`);
                return;
            }
            const items = carrinho.produtos.map(item => {
                return {sku: item.produto.id, qty: item.quantidade};
            });

            try {
                const postcode = cep;
                const response = await fetch(`${url_base}rest/V2/estimate/shipping/`, {
                    method: 'POST', // or 'PUT'
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({estimate_shipping: {postcode, items}})
                });
                let result = await response.json();
                if (result.message) {
                    reject(result.message);
                    return;
                }
                const formasDeEntrega = result.map(item => new FormaDeEntrega(
                    item['code'],
                    item['title'],
                    item['deadline'],
                    item['price'],
                    item['method_description']
                ));
                resolve(formasDeEntrega);
            } catch (error) {
                reject(error);
            }
        });
    }
}