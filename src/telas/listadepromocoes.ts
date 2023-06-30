import {criarElementoHtml} from "../util/helper";
import {ICarrinho} from "../contratos/carrinho";
import {ITela} from "../contratos/tela";
import {ApiConfiguracoes} from "../servicos/apiconfiguracoes";

export class ListaDePromocoes implements ITela {
    constructor(public carrinho: ICarrinho) {
    }

    htmlListaDePromocoesAtivas(): HTMLElement {
        const div = criarElementoHtml('div', ['row','regras']);
        const produtos = this.carrinho.promocoes;
        produtos.map(regra => {
            const divProduto = criarElementoHtml('div', ['col-6', 'mb-3','regra', `${regra.promocao_aplicada ? 'regra-ativa' : 'inative'}`]);
            divProduto.innerHTML = `
            <div class="regra-texto">
                <h4>${regra.nome}</h4>
                <h5>${regra.descricao}</h5>
                ${regra.promocao_aplicada ? '<span>Promoção Ativada</span>' : ''}
            </div>
            ${regra.imagem_desktop ? `<img src="${regra.imagem_desktop}" alt="${regra.nome}" title="${regra.promocao_aplicada ? 'Promoção Válida' : 'Promoção Inválida'}">` : ''}`;
            div.appendChild(divProduto);
        });
        return div;
    }

    htmlListaDePromocoes(): HTMLElement {
        let div = document.getElementById('lista-de-promocoes');
        if (!div) {
            div = criarElementoHtml(
                'div',
                ['lista-de-promocoes', 'row'],
                [{nome: 'id', valor: 'lista-de-promocoes'}]
            );
        } else {
            div.innerHTML = '';
        }
        if (this.carrinho.promocoes.length < 1 || ApiConfiguracoes.instancia().loja.nome === 'uc') {
            div.innerHTML = `<div class="bg-body-tertiary p-5 rounded mt-3">
    <h2>Nenhuma promoção cadastrada.</h2>
    <p class="lead">Que pena não encontramos nenhuma promoção para este cliente!</p>
  </div>`;
            return div;
        }
        div.appendChild(this.htmlListaDePromocoesAtivas());

        return div;
    };

    conteudo(): HTMLElement {
        const main = criarElementoHtml('main');
        main.appendChild(this.htmlListaDePromocoes());
        return main;
    }
}