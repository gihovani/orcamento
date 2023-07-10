export interface IApiConfiguracoes {
    loja: IApiConfiguracoesLoja;
    versao: string;
    offline: boolean;
    retirada_permitida: boolean;
    forma_pagamento_cartao_credito: boolean;
    forma_pagamento_cartao_maquineta: boolean;
    forma_pagamento_boleto: boolean;
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
