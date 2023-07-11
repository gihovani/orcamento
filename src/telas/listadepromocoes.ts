import {criarElementoHtml} from "../util/helper";
import {ICarrinho} from "../contratos/carrinho";
import {ITela} from "../contratos/tela";
import {ApiConfiguracoes} from "../servicos/apiconfiguracoes";
import {TituloEDescricaoDaPagina} from "./componentes/tituloedescricaodapagina";

export class ListaDePromocoes implements ITela {
    constructor(public carrinho: ICarrinho) {
    }

    private htmlListaDePromocoesAtivas(): HTMLElement {
        const div = criarElementoHtml('div', ['row', 'regras']);
        const produtos = this.carrinho.promocoes;
        produtos.map(regra => {
            const divProduto = criarElementoHtml('div', ['col-6', 'mb-3', 'regra', `${regra.promocao_aplicada ? 'regra-ativa' : 'inative'}`]);
            divProduto.innerHTML = `<div class="regra-texto">
    <h4>${regra.nome}</h4>
    <h5>${regra.descricao || ''}</h5>
    ${regra.promocao_aplicada ? '<span>Promoção Ativada</span>' : ''}
</div>
            ${regra.imagem_desktop ? `<img src="${regra.imagem_desktop}" alt="${regra.nome}" title="${regra.promocao_aplicada ? 'Promoção Válida' : 'Promoção Inválida'}">` : ''}`;
            div.appendChild(divProduto);
        });
        return div;
    }

    private htmlListaDePromocoes(): HTMLElement {
        document.getElementById('lista-de-promocoes')?.remove();
        const div = criarElementoHtml('div', ['lista-de-promocoes', 'row']);
        div.setAttribute('id', 'lista-de-promocoes');

        const tituloDescricao = new TituloEDescricaoDaPagina(div);
        if (this.carrinho.promocoes.length < 1 || ApiConfiguracoes.instancia().loja.nome === 'uc') {
            tituloDescricao.mostrar('Nenhuma promoção cadastrada.', 'Que pena não encontramos nenhuma promoção para este cliente!');
            return div;
        }
        tituloDescricao.mostrar('Lista de Promoções.');
        div.appendChild(this.htmlListaDePromocoesAtivas());
        return div;
    };

    conteudo(): HTMLElement {
        const main = criarElementoHtml('main');
        main.appendChild(this.htmlListaDePromocoes());
        return main;
    }
}