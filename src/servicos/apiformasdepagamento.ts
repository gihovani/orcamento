import {IApiFormasDePagamento} from "../contratos/servicos/apiformasdepagamento";
import {IFormaDePagamento} from "../contratos/entidades/formadepagamento";
import {Boleto, CartaoDeCredito, CartaoMaquineta} from "../entidades/formadepagamento";
import {IApiConfiguracoes} from "../contratos/servicos/apiconfiguracoes";
import {ApiConfiguracoes} from "./apiconfiguracoes";

export class ApiFormasDePagamentoMagento implements IApiFormasDePagamento {
    dados: IFormaDePagamento;
    configuracoes: IApiConfiguracoes;

    constructor() {
        this.dados = new Boleto(1);
        this.configuracoes = ApiConfiguracoes.instancia();
    }

    consultar(): Promise<IFormaDePagamento[]> {
        const formas = [];
        return new Promise<IFormaDePagamento[]>((resolve, reject) => {
            if (this.configuracoes.forma_pagamento_boleto) {
                formas.push(new Boleto());
            }
            if (this.configuracoes.forma_pagamento_cartao_credito) {
                formas.push(new CartaoDeCredito());
            }
            if (this.configuracoes.forma_pagamento_cartao_maquineta) {
                formas.push(new CartaoMaquineta());
            }
            resolve(formas);
        });
    }
}
