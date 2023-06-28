export interface IApiConfiguracoes {
    loja: IApiConfiguracoesLoja;
    versao: string;
    disponiveis: () => IApiConfiguracoesLoja[];
}

export interface IApiConfiguracoesLoja {
    nome: string;
    titulo: string;
    estilos: string;
    url_base: string;
    google_merchant: IApiConfiguracoesGoogleMerchant;
}

export interface IApiConfiguracoesGoogleMerchant {
    url: string;
    filtros: string;
}
