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
            <form class="card p-2" onsubmit="alert('ainda nao disponivel!');return false">
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
        const dadosDoCliente = new DadosDoCliente(form, this.apiCliente, this.carregando);
        dadosDoCliente.mostrar();
        form.append(criarElementoHtml('hr', ['mb-4']));

        const dadosDoEndereco = new DadosDoEndereco(form, this.apiCep, this.carregando);
        dadosDoEndereco.mostrar();
        const button = criarElementoHtml('button', ['btn', 'btn-primary'], [{
            nome: 'type',
            valor: 'submit'
        }], 'Finalizar Compra');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                const cliente = dadosDoCliente.pegaDados();
                const endereco = dadosDoEndereco.pegaDados();
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
        form.append(button);
        return form;
    }
}
