import {IConfiguracoes} from "../contratos/entidades/configuracoes";

export class Configuracoes implements IConfiguracoes {
    nome_loja: string;
    url_google_merchant: string;
    versao: string;
    constructor() {
        this.nome_loja = 'Loja do GG2';
        this.url_google_merchant = 'xml/google.xml';
        this.versao = '1.0';
    }
}
