import {ListaDeProduto} from "./entidades/listadeproduto";
import {Carrinho} from "./entidades/carrinho";
import {Produto} from "./entidades/produto";
import {pegaDadosGoogleMerchant, pegaTextoDoElementoXml, transformaDinheiroEmNumero} from "./util/helper";

const listaDeProduto = new ListaDeProduto();
const sacola = new Carrinho();
pegaDadosGoogleMerchant('xml/google.xml', (data) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, 'text/xml');
    listaDeProduto.produtos = Array.from(xmlDoc.querySelectorAll('item')).map(item => {
        const price = pegaTextoDoElementoXml(item, 'price');
        const sale_price = pegaTextoDoElementoXml(item, 'sale_price');
        return new Produto(
            pegaTextoDoElementoXml(item, 'id'),
            pegaTextoDoElementoXml(item, 'title'),
            transformaDinheiroEmNumero(price),
            pegaTextoDoElementoXml(item, 'availability') === 'In Stock',
            pegaTextoDoElementoXml(item, 'title'),
            transformaDinheiroEmNumero(sale_price),
            pegaTextoDoElementoXml(item, 'image_link'),
            pegaTextoDoElementoXml(item, 'link'),
            pegaTextoDoElementoXml(item, 'product_type').split(',')[0],
            pegaTextoDoElementoXml(item, 'brand'),
            pegaTextoDoElementoXml(item, 'gtin')
        );
    });
    for (let i = 0; i < 10; i++) {
        sacola.adicionarProduto(listaDeProduto.produtos[i], i + 1);
    }
    sacola.totalizar();
    listaDeProduto.atualizaFiltros();
    console.log(sacola);
    console.log(listaDeProduto);
    window['listaDeProduto'] = listaDeProduto;
    window['sacola'] = sacola;
});
