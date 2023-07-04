import {ITela} from "../contratos/tela";
import {criarElementoHtml} from "../util/helper";
import {IApiProduto} from "../contratos/servicos/apiproduto";
import {INotificacao} from "../contratos/componentes/notificacao";
import {ICarregando} from "../contratos/componentes/carregando";
import {IApiConfiguracoes} from "../contratos/servicos/apiconfiguracoes";
import {ApiConfiguracoes} from "../servicos/apiconfiguracoes";
import {TituloEDescricaoDaPagina} from "./componentes/tituloedescricaodapagina";

export class FormularioConfiguracoes implements ITela {
    private _configuracoes: IApiConfiguracoes;

    constructor(
        public apiProduto: IApiProduto,
        public notificacao: INotificacao,
        public carregando: ICarregando
    ) {
        this._configuracoes = ApiConfiguracoes.instancia();
    }

    private pegaDadosDoFormulario(form: HTMLElement): IApiConfiguracoes {
        const lojaSelecionada = (form.querySelector('#configuracao-loja') as HTMLInputElement)?.value
        this._configuracoes.loja = this._configuracoes.disponiveis()[lojaSelecionada];
        this._configuracoes.versao = (form.querySelector('#configuracao-versao') as HTMLInputElement)?.value;
        this._configuracoes.offline = !!(form.querySelector('#configuracao-offline') as HTMLInputElement)?.checked;
        this._configuracoes.retirada_permitida = !!(form.querySelector('#configuracao-retirada-permitida') as HTMLInputElement)?.checked;
        return this._configuracoes;
    }

    conteudo(): HTMLElement {
        const main = criarElementoHtml('main');
        const tituloDescricao = new TituloEDescricaoDaPagina(main);
        tituloDescricao.mostrar('Configurações do Sistema');
        const form = criarElementoHtml(
            'form', ['p-5', 'rounded', 'mt-3', 'mb-3', 'row', 'needs-validation'],
            [{nome: 'autocomplete', valor: 'off'}]
        );
        main.appendChild(form);
        form.innerHTML = `
<div class="mb-3 col-6">
    <label class="form-label" for="configuracao-loja">Loja</label>
    <select id="configuracao-loja" class="form-select" required></select>
</div>
<div class="mb-3 col-6">
    <label class="form-label" for="configuracao-versao">Versão</label>
    <input class="form-control" type="text" id="configuracao-versao" maxlength="10" required value="${this._configuracoes.versao}" />
</div>
<div class="mb-3 col-6 form-check form-switch">
    <input role="switch" class="form-check-input" type="checkbox" id="configuracao-offline" value="1" ${this._configuracoes.offline ? 'checked' : ''} />
    <label class="form-check-label" for="configuracao-offline">Offline</label>
</div>
<div class="mb-3 col-6 form-check form-switch">
    <input role="switch" class="form-check-input" type="checkbox" id="configuracao-retirada-permitida" value="1" ${this._configuracoes.retirada_permitida ? 'checked' : ''} />
    <label class="form-check-label" for="configuracao-retirada-permitida">Entrega No Local</label>
</div>
<button type="submit" class="btn btn-primary">SALVAR</button>`;
        const seletorLoja = main.querySelector('#configuracao-loja');
        const lojaSelecionada = this._configuracoes.loja;
        this._configuracoes.disponiveis().forEach((loja, index) => {
            const atributos = [{
                nome: 'value', valor: String(index)
            }, {
                nome: 'label', valor: loja.titulo
            }];
            const options = criarElementoHtml('option', [], atributos);
            if (lojaSelecionada.titulo === loja.titulo) {
                options.setAttribute('selected', 'selected')
            }
            seletorLoja.appendChild(options);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.carregando.mostrar();
            try {
                console.log(this.pegaDadosDoFormulario(form));
                this.apiProduto.listar(true).then(() => {
                    this.notificacao.mostrar('Sucesso', 'Suas Confiruações Foram Atualizadas!', 'success');
                }).finally(() => this.carregando.esconder());
            } catch (error) {
                this.notificacao.mostrar('Erro', `Não foi possivel salvar a configuração! ${error}`, 'danger');
                this.carregando.esconder();
            }
        });
        return main;
    }
}