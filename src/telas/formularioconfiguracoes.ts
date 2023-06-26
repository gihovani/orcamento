import {ITela} from "../contratos/tela";
import {criarElementoHtml} from "../util/helper";
import {IConfiguracoes} from "../contratos/entidades/configuracoes";
import {IApiProduto} from "../contratos/servicos/apiproduto";

export class FormularioConfiguracoes implements ITela {
    constructor(public configuracoes: IConfiguracoes, public apiProduto: IApiProduto) {}

    public pegaDadosDoFormulario(form: HTMLFormElement): IConfiguracoes {
        this.configuracoes.url_google_merchant = (form.querySelector('#url_google_merchant') as HTMLInputElement)?.value;
        this.configuracoes.nome_loja = (form.querySelector('#nome_loja') as HTMLInputElement)?.value;
        this.configuracoes.versao = (form.querySelector('#versao') as HTMLInputElement)?.value;
        return this.configuracoes;
    }

    conteudo(): HTMLElement {
        const main = criarElementoHtml('main', ['row']);
        main.innerHTML = `
            <form class="bg-body-tertiary p-5 rounded mt-3 mb-3 m-auto">
                <h1 class="h3 mb-3 fw-normal">Configurações do Sistema</h1>
                <div class="mb-3">
                    <label class="form-label" for="url_google_merchant">URL Google Merchant</label>
                    <select id="url_google_merchant" class="form-select">
                        <option value="xml/google.xml" ${(this.configuracoes.url_google_merchant === 'xml/google.xml') ? 'selected' : ''}>UC</option>
                        <option value="xml/googledc.xml" ${(this.configuracoes.url_google_merchant === 'xml/googledc.xml') ? 'selected' : ''}>DC</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label" for="nome_loja">Nome da Loja</label>
                    <input class="form-control" type="text" id="nome_loja" value="${this.configuracoes.nome_loja}" />
                </div>
                <div class="mb-3">
                    <label class="form-label" for="versao">Versão</label>
                    <input class="form-control" type="text" id="versao" maxlength="10" value="${this.configuracoes.versao}" />
                </div>
                <button type="submit" class="btn btn-primary">SALVAR</button>
            </form>
        `;
        const form = main.querySelector('form') as HTMLFormElement;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.pegaDadosDoFormulario(form);
            this.apiProduto.listar(true).then(() => {
                alert('Suas Confiruações Foram Atualizadas!');
                document.dispatchEvent(new CustomEvent('atualizar-tela', {detail: 'conteudo'}));
            });
        });
        return main;
    }
}