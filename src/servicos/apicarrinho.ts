import {ICarrinho, ICarrinhoProduto} from "../contratos/carrinho";
import {Carrinho} from "../entidades/carrinho";
import {IApiCarrinho} from "../contratos/servicos/apicarrinho";
import {ApiConfiguracoes} from "./apiconfiguracoes";
import {Produto} from "../entidades/produto";

interface CarrinhoMagento {
    total?: string;
    isGuestCheckoutAllowed?: boolean;
    possible_onepage_checkout?: boolean;
    extra_actions?: string;
    data_id?: number;
    subtotal?: string;
    storeId?: string;
    summary_count?: number;
    items?: CarrinhoItemMagento[];
    website_id?: string;
    subtotalAmount?: string
}

interface CarrinhoItemMagento {
    product_url?: string;
    amount_discount?: string;
    product_image?: CarrinhoItemImagemMagento;
    is_visible_in_site_visibility?: boolean;
    product_price?: string;
    unit_final_price?: number;
    product_sku?: string;
    gift_sub_total?: null;
    product_id?: string;
    options?: any[];
    product_brand?: string;
    gifts?: any[];
    canApplyMsrp?: boolean;
    item_id?: string;
    product_price_value?: number;
    message?: string;
    product_name?: string;
    lovers?: number;
    product_type?: string;
    is_gift?: boolean;
    configure_url?: string;
    subtotal?: number;
    qty?: number;
    name_rule?: null;
    product_has_url?: boolean;
    product_category?: string
}

interface CarrinhoItemImagemMagento {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
}

abstract class ApiCarrinho implements IApiCarrinho {
    dados: ICarrinho;

    itemMagentoTransformaICarrinhoProduto(item: CarrinhoItemMagento): ICarrinhoProduto {
        const produto = new Produto(
            item.product_sku,
            item.product_id,
            item.product_name,
            parseFloat(String(item.product_price_value)),
            item.is_visible_in_site_visibility,
            '',
            parseFloat(String(item.unit_final_price)),
            item.product_image?.src,
            item.product_url,
            item.product_category,
            item.product_brand,
            ''
        );
        return {
            quantidade: parseInt(String(item.qty)),
            preco_unitario: parseFloat(String(item.unit_final_price)),
            desconto: (parseFloat(String(item.product_price_value)) - parseFloat(String(item.unit_final_price))),
            produto: produto,
            personalizacao: ''
        }
    }

    carrinhoMagentoTransformaICarrinho(carrinho: CarrinhoMagento): ICarrinho {
        this.dados.totalizador.valor_total = parseFloat(carrinho.total);
        this.dados.totalizador.valor_subtotal = parseFloat(carrinho.subtotal);
        this.dados.produtos = [];
        carrinho.items.forEach(item => {
            this.dados.produtos.push(this.itemMagentoTransformaICarrinhoProduto(item));
        });
        return this.dados;
    }

    abstract totalizar(): Promise<ICarrinho>
}

export class ApiCarrinhoMock extends ApiCarrinho {
    dados: ICarrinho;

    constructor() {
        super();
        this.dados = new Carrinho();
    }

    totalizar(): Promise<ICarrinho> {
        return new Promise<ICarrinho>((resolve, reject) => {
            let result = {
                cart: {
                    "summary_count": 1,
                    "subtotalAmount": "17.9900",
                    "subtotal": "<span class=\"price\">R$17,99<\/span>",
                    "possible_onepage_checkout": true,
                    "total": "17.9900",
                    "items": [
                        {
                            "product_type": "simple",
                            "options": [],
                            "qty": 1,
                            "item_id": "226728063",
                            "configure_url": "https:\/\/www.dentalspeed.com\/checkout\/cart\/configure\/id\/226728063\/product_id\/261551\/",
                            "is_visible_in_site_visibility": true,
                            "product_id": "261551",
                            "product_name": "Tubo Simples Para Colagem Edgewise\/Ricketts 022 com Gancho - Orthometric",
                            "product_sku": "ORL19790A",
                            "product_url": "https:\/\/www.dentalspeed.com\/tubo-simples-para-colagem-edgewisericketts-022-cgancho-orthometric.html",
                            "product_has_url": true,
                            "product_price": "<span class=\"price\">R$17,99<\/span>",
                            "product_price_value": 17.99,
                            "product_image": {
                                "src": "https:\/\/cdn.dentalspeed.com\/produtos\/150\/tubo-simples-para-colagem-edgewise-ricketts-022-com-gancho-19790.jpg",
                                "alt": "Tubo Simples Para Colagem Edgewise\/Ricketts 022 com Gancho - Orthometric",
                                "width": 75,
                                "height": 75
                            },
                            "canApplyMsrp": false,
                            "message": "",
                            "product_brand": "ORTHOMETRIC",
                            "product_category": "Tubo para Colagem - 20486",
                            "gifts": [],
                            "gift_sub_total": null,
                            "name_rule": null,
                            "lovers": 0,
                            "amount_discount": "0.00",
                            "unit_final_price": 17.99,
                            "subtotal": 17.99,
                            "is_gift": false
                        }
                    ],
                    "extra_actions": "",
                    "isGuestCheckoutAllowed": false,
                    "website_id": "14",
                    "storeId": "18",
                    "data_id": 1688488638
                }
            };
            if (!result.hasOwnProperty('cart')) {
                reject('Carrinho vazio');
                return;
            }

            resolve(this.carrinhoMagentoTransformaICarrinho(result.cart));
        });
    }
}

export class ApiCarrinhoMagento extends ApiCarrinho {
    dados: ICarrinho;

    constructor() {
        super();
        this.dados = new Carrinho();
    }

    totalizar(): Promise<ICarrinho> {
        return new Promise<ICarrinho>(async (resolve, reject) => {
            const url_base = ApiConfiguracoes.instancia().loja.url_base;
            try {
                // customer/section/load/?sections=cart
                const response = await fetch(`${url_base}rest/V2/estimate/shipping/`);
                let result = await response.json();
                if (result.message) {
                    reject(result.message);
                    return;
                }
                if (!result.hasOwnProperty('cart')) {
                    reject('Carrinho vazio');
                    return;
                }

                resolve(this.carrinhoMagentoTransformaICarrinho(result.cart));
            } catch (error) {
                reject(error);
            }
        });
    }
}
