import {ITela} from "../contratos/tela";
import {criarElementoHtml} from "../util/helper";
import {IApiVendedor} from "../contratos/servicos/apivendedor";
import {INotificacao} from "../contratos/componentes/notificacao";

export class FormularioLogin implements ITela {
    constructor(public apiVendedor: IApiVendedor, public notificacao: INotificacao) {}

    conteudo(): HTMLElement {
        const main = criarElementoHtml('main');
        main.innerHTML = `<form class="bg-body-tertiary p-5 rounded mt-5 mb-5 m-auto text-center form-login needs-validation" autocomplete="off">
    <h1 class="h3 mb-3 fw-normal">FAÇA O LOGIN</h1>
    <div class="form-floating mb-3">
      <input type="text" class="form-control" id="login" placeholder="Login">
      <label for="login">Login</label>
    </div>
    <div class="form-floating mb-3">
      <input type="password" class="form-control" id="senha" placeholder="Senha">
      <label for="senha">Senha</label>
    </div>

    <div class="form-check text-start my-3">
      <input class="form-check-input" type="checkbox" value="lembrar-senha" id="lembrar-senha">
      <label class="form-check-label" for="lembrar-senha">Salvar senha</label>
    </div>
    <button class="btn btn-primary w-100 py-2" type="submit">ENTRAR</button>
  </form>`;
        const form = main.querySelector('form') as HTMLFormElement;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const login = (form.querySelector('#login') as HTMLInputElement)?.value;
            const senha = (form.querySelector('#senha') as HTMLInputElement)?.value;
            if (login.length && senha.length) {
                this.apiVendedor.autenticar(login, senha).then((vendedor) => {
                    document.dispatchEvent(new CustomEvent('autenticacao',  { detail: vendedor }));
                }).catch(error => {
                    this.notificacao.mostrar('Error', error, 'danger');
                });
            }
        });
        return main;
    }
}