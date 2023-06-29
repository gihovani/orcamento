import {IApiConfiguracoes, IApiConfiguracoesLoja} from "../contratos/servicos/apiconfiguracoes";

export class ApiConfiguracoes implements IApiConfiguracoes {
    static _instancia: IApiConfiguracoes;
    loja: IApiConfiguracoesLoja;
    versao: string;

    constructor() {
        this.loja = this.disponiveis()[0];
        this.versao = '1.0';
    }

    static instancia(): ApiConfiguracoes {
        if (!ApiConfiguracoes._instancia) {
            ApiConfiguracoes._instancia = new ApiConfiguracoes();
        }
        return ApiConfiguracoes._instancia;
    }

    disponiveis(): IApiConfiguracoesLoja[] {
        return [{
            nome: 'teste',
            titulo: 'Loja do GG2',
            url_base: 'https://www.utilidadesclinicas.com.br/',
            estilos: 'tema-ds.css',
            google_merchant: {
                url: 'xml/teste.xml',
                filtros: null
            }
        }, {
            nome: 'uc',
            titulo: 'Utilidades Clínicas',
            url_base: 'https://www.utilidadesclinicas.com.br/',
            estilos: 'tema-uc.css',
            google_merchant: {
                url: 'https://gg2.com.br/xml/?feed=google_feed.xml',
                filtros: null
            }
        }, {
            nome: 'dc',
            titulo: 'Dental Cremer',
            url_base: 'https://www.dentalcremer.com.br/',
            estilos: 'tema-dc.css',
            google_merchant: {
                url: 'https://gg2.com.br/xml/?feed=google_feed_dc.xml',
                filtros: null
            }
        }, {
            nome: 'ds',
            titulo: 'Dental Speed',
            url_base: 'https://www.dentalspeed.com/',
            estilos: 'tema-ds.css',
            google_merchant: {
                url: 'https://gg2.com.br/xml/?feed=google_feed_ds.xml',
                filtros: null
            }
        }, {
            nome: 'colgate',
            titulo: 'Colgate',
            url_base: 'https://www.dentalspeed.com/',
            estilos: 'tema-colgate.css',
            google_merchant: {
                url: 'https://gg2.com.br/xml/?feed=google_feed_ds.xml',
                filtros: 'marca=COLGATE'
            }
        }];
    }
}
