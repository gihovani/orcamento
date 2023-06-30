import {criarElementoHtml, formataNumeroEmDinheiro} from "../util/helper";
import {ITela} from "../contratos/tela";
import {INotificacao} from "../contratos/componentes/notificacao";
import {IApiBin} from "../contratos/servicos/apibin";
import {IApiParcelamento} from "../contratos/servicos/apiparcelamento";
import {ICarrinho, ICarrinhoProduto} from "../contratos/carrinho";
import {ICarregando} from "../contratos/componentes/carregando";
import {IApiCliente} from "../contratos/servicos/apicliente";
import {IApiCep} from "../contratos/servicos/apicep";
import {DadosDoCliente} from "./componentes/dadosdocliente";
import {DadosDoEndereco} from "./componentes/dadosdoendereco";
import {ApiFormasDeEntregaMagento} from "../servicos/apiformasdeentrega";

export class FormularioPagamento implements ITela {
    constructor(
        public carrinho: ICarrinho,
        public apiCliente: IApiCliente,
        public apiCep: IApiCep,
        public apiParcelamento: IApiParcelamento,
        public apiBin: IApiBin,
        public notificacao: INotificacao,
        public carregando: ICarregando
    ) {
    }

    conteudo(): HTMLElement {
        const main = criarElementoHtml('main', ['row']);
        main.innerHTML = `<div class="container">
    <div class="py-5 text-center">
        <h2>Dados de Pagamento</h2>
        <p class="lead">Os dados abaixo serão os mesmos que aparecerão na nota fiscal.</p>
    </div>
    <div class="row">
        <div class="col-md-4 order-md-2 mb-4">
            <h4 class="d-flex justify-content-between align-items-center mb-3">
                <span class="text-muted">Carrinho</span>
                <span class="badge badge-secondary badge-pill">3</span>
            </h4>
            <div id="itens-do-carrinho"></div>
            <form id="formulario-de-codigo-promocional" class="card p-2" onsubmit="alert('ainda nao disponivel!');return false" autocomplete="off">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Código Promocional" id="codigo-promocional">
                    <div class="input-group-append">
                        <button type="submit" class="btn btn-secondary">Aplicar</button>
                    </div>
                </div>
            </form>
        </div>
        <div class="col-md-8 order-md-1" id="formulario-de-pagamento"></div>
    </div>
</div>`;
        main.querySelector('#itens-do-carrinho').append(this.htmlItensCarrinho());
        main.querySelector('#formulario-de-pagamento').append(this.htmlFormularioDePagamento());
        return main;
    }

    htmlItemCarrinho(item: ICarrinhoProduto) {
        const li = criarElementoHtml('li', ['list-group-item', 'd-flex', 'justify-content-between']);
        li.innerHTML = `<div>
                        <h6 class="my-0">SKU: ${item.produto.id}</h6>
                        <small class="text-muted">${item.produto.nome}</small>
                    </div>
                    <span class="text-muted">${item.quantidade}x R$ ${formataNumeroEmDinheiro(item.preco_unitario)}</span>`
        return li;
    }

    htmlDescontos() {

        const li = criarElementoHtml('li', ['list-group-item', 'd-flex', 'justify-content-between', 'bg-light']);
        if (!this.carrinho.totalizador?.valor_desconto) {
            return li;
        }

        li.innerHTML = `<div class="text-success">
                        <h6 class="my-0">Descontos</h6>
                        <small>xxxx</small>
                    </div>
                    <span class="text-success">R$ ${formataNumeroEmDinheiro(this.carrinho.totalizador?.valor_desconto)}</span>`;
        return li;
    }

    htmlTotal() {
        const li = criarElementoHtml('li', ['list-group-item', 'd-flex', 'justify-content-between']);
        li.innerHTML = `<span>Total</span>
                    <strong>${formataNumeroEmDinheiro(this.carrinho.totalizador?.valor_total)}</strong>`;
        return li;
    }

    htmlItensCarrinho(): HTMLElement {
        const ul = criarElementoHtml('ul', ['list-group', 'mb-3', 'sticky-top']);
        this.carrinho.produtos.map(item => {
            ul.append(this.htmlItemCarrinho(item));
        });
        ul.append(this.htmlDescontos());
        ul.append(this.htmlTotal());
        return ul;
    }

    htmlFormularioDePagamento(): HTMLElement {
        const form = criarElementoHtml('form', ['needs-validation']);
        form.setAttribute('autocomplete', 'off');
        const dadosDoCliente = new DadosDoCliente(form, this.apiCliente, this.notificacao, this.carregando);
        dadosDoCliente.mostrar();
        form.append(criarElementoHtml('hr', ['mb-4']));

        const dadosDoEndereco = new DadosDoEndereco(form, this.apiCep, this.notificacao, this.carregando);
        dadosDoEndereco.mostrar();
        const button = criarElementoHtml('button', ['btn', 'btn-secondary'], [{
            nome: 'type',
            valor: 'button'
        }], 'Opções de Entrega');
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const apiFormasDeEntregaMagento = new ApiFormasDeEntregaMagento();
            try {
                const endereco = dadosDoEndereco.pegaDados();
                apiFormasDeEntregaMagento.consultar(endereco.cep, this.carrinho).then((formas) => {
                    form.querySelector('#form-entrega')?.remove();
                    const div = criarElementoHtml('div', ['form-check']);
                    div.setAttribute('id', 'form-entrega');
                    formas.map((forma) => {
                        const divCheck = criarElementoHtml('div', ['form-check']);
                        const input = criarElementoHtml('input', ['form-check-input']);
                        input.setAttribute('type', 'radio');
                        input.setAttribute('name', 'forma-entrega');
                        input.setAttribute('id', `form-entrega-${forma.tipo}`);
                        divCheck.append(input);
                        const label = criarElementoHtml('label', ['form-check-label']);
                        label.innerHTML = `${forma.titulo} - R$ ${formataNumeroEmDinheiro(forma.valor)} - ${forma.prazodeentrega}`;
                        label.setAttribute('for', `form-entrega-${forma.tipo}`);
                        divCheck.append(label);
                        div.appendChild(divCheck);
                    });
                    form.querySelector(`#${dadosDoEndereco.ID}`).append(div);
                }).catch(error => this.notificacao.mostrar('Erro', error, 'danger'))
                    .finally(() => this.carregando.esconder());
            } catch (error) {
                this.notificacao.mostrar('Erro', error, 'danger');
                this.carregando.esconder()
            }
        });
        form.append(button);
        form.append(criarElementoHtml('hr', ['mb-4']));

        const submit = criarElementoHtml('button', ['btn', 'btn-primary'], [{
            nome: 'type',
            valor: 'button'
        }], 'SALVAR PEDIDO');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                const cliente = dadosDoCliente.pegaDados();
                this.apiCliente.salvar(cliente).then(() => {
                    this.notificacao.mostrar('Sucesso', `O Pedido do Cliente ${cliente.nome} Foi Salvo!`, 'success');
                })
                    .catch(error => this.notificacao.mostrar('Erro', error, 'danger'))
                    .finally(() => this.carregando.esconder());
            } catch (error) {
                this.notificacao.mostrar('Erro', error, 'danger');
                this.carregando.esconder()
            }
        });
        form.append(submit);
        return form;
    }
}
