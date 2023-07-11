import {IFormaDePagamento} from "../contratos/entidades/formadepagamento";
import {validarBandeiraCartaoDeCredito, validarCartaoDeCredito} from "../util/validacoes";


abstract class FormaDePagamento implements IFormaDePagamento {
    private _tipo: string;
    private _parcelamento?: number;
    abstract numero_maximo_parcelas: number;
    abstract valor_minimo_parcela: number;

    constructor(tipo: string, parcelamento?: number) {
        this.tipo = tipo;
        parcelamento && (this.parcelamento = parcelamento);
    }

    set parcelamento(valor: number) {
        if (isNaN(valor)) {
            throw Error('Forma de Pagamento Inválida: o Parcelamento é obrigatório!');
        }
        if (valor < 1) {
            throw new Error('Forma de Pagamento Inválida: Parcelamento não pode ser menor que 1');
        }
        this._parcelamento = valor;
    }

    set tipo(valor: string) {
        if (['Boleto', 'Cartão De Crédito', 'Cartão Maquineta'].indexOf(valor) < 0) {
            throw new Error(`Forma de Pagamento Inválida: Tipo (${valor}) não aceito!`);
        }
        this._tipo = valor;
    }

    get parcelamento(): number {
        return this._parcelamento;
    }

    get tipo(): string {
        return this._tipo;
    }

    numeroParcelasDisponiveis(valor: number): number {
        let parcelas = 1;
        while (valor / parcelas > this.valor_minimo_parcela && parcelas < this.numero_maximo_parcelas) {
            parcelas++;
        }
        return parcelas;
    }
}

export class Boleto extends FormaDePagamento {
    numero_maximo_parcelas: number = 6;
    valor_minimo_parcela: number = 200;

    constructor(parcelamento?: number) {
        super('Boleto', parcelamento);
    }
}

export class CartaoDeCredito extends FormaDePagamento {
    private _bandeira: string;
    private _nome: string;
    private _numero: string;
    private _data_expiracao: string;
    private _codigo_verificacao: string;
    numero_maximo_parcelas: number = 12;
    valor_minimo_parcela: number = 100;

    constructor(
        parcelamento?: number,
        bandeira?: string,
        nome?: string,
        numero?: string,
        data_expiracao?: string,
        codigo_verificacao?: string
    ) {
        super('Cartão De Crédito', parcelamento);
        bandeira && (this.bandeira = bandeira);
        nome && (this.nome = nome);
        numero && (this.numero = numero);
        data_expiracao && (this.data_expiracao = data_expiracao);
        codigo_verificacao && (this.codigo_verificacao = codigo_verificacao);
    }

    set bandeira(valor: string) {
        if (!validarBandeiraCartaoDeCredito(valor)) {
            throw new Error(`Cartão de Crédito Inválido: Bandeira (${valor}) não aceita!`);
        }
        this._bandeira = valor;
    }

    set nome(valor: string) {
        if (!valor) {
            throw Error("Cartão de Crédito Inválido: o nome é obrigatório!");
        }
        this._nome = valor;
    }

    set numero(valor: string) {
        if (!validarCartaoDeCredito(valor)) {
            throw Error("Cartão de Crédito Inválido: o número do cartão de crédito deve ser válido!");
        }
        this._numero = valor;
    }

    set data_expiracao(valor: string) {
        if (!valor) {
            throw Error("Cartão de Crédito Inválido: a data de expiração é obrigatória!");
        }
        const [mes, ano] = valor.split('/');
        if (valor.length !== 7 || !mes || !ano) {
            throw Error("Cartão de Crédito Inválido: a data de expiração deve ter 7 caracteres. Ex: 12/2040!");
        }
        if (new Date(parseInt(ano), parseInt(mes) - 1, 31) < new Date()) {
            throw Error("Cartão de Crédito Inválido: a data de expiração está vencida.");
        }

        this._data_expiracao = valor;
    }

    set codigo_verificacao(valor: string) {
        valor = valor.replace(/\s/g, '');
        if (!(valor.length === 3 || valor.length === 4)) {
            throw Error("Cartão de Crédito Inválido: o código de verificação deve ter 3 ou 4 caracteres!");
        }
        this._codigo_verificacao = valor;
    }

    get bandeira(): string {
        return this._bandeira;
    }

    get nome(): string {
        return this._nome;
    }

    get numero(): string {
        return this._numero;
    }

    get data_expiracao(): string {
        return this._data_expiracao;
    }

    get codigo_verificacao(): string {
        return this._codigo_verificacao;
    }
}

export class CartaoMaquineta extends FormaDePagamento {
    private _bandeira: string;
    private _codigo_nsu: string;
    private _codigo_autorizacao: string;
    numero_maximo_parcelas: number = 36;
    valor_minimo_parcela: number = 50;

    constructor(
        parcelamento?: number,
        bandeira?: string,
        codigo_nsu?: string,
        codigo_autorizacao?: string
    ) {
        super('Cartão Maquineta', parcelamento);
        bandeira && (this.bandeira = bandeira);
        codigo_nsu && (this.codigo_nsu = codigo_nsu);
        codigo_autorizacao && (this.codigo_autorizacao = codigo_autorizacao);
    }

    set bandeira(valor: string) {
        if (!validarBandeiraCartaoDeCredito(valor)) {
            throw new Error(`Cartão de Maquineta Inválido: Bandeira (${valor}) não aceita!`);
        }
        this._bandeira = valor;
    }

    set codigo_nsu(valor: string) {
        valor = valor.replace(/\s/g, '');
        if (!(valor.length >= 3)) {
            throw Error("Cartão de Maquineta Inválido: o código nsu deve ter 3 ou mais caracteres!");
        }
        this._codigo_nsu = valor;
    }

    set codigo_autorizacao(valor: string) {
        valor = valor.replace(/\s/g, '');
        if (!(valor.length >= 3)) {
            throw Error("Cartão de Maquineta Inválido: o código de autorização deve ter 3 ou mais caracteres!");
        }
        this._codigo_autorizacao = valor;
    }

    get bandeira(): string {
        return this._bandeira
    }

    get codigo_nsu(): string {
        return this._codigo_nsu;
    }

    get codigo_autorizacao(): string {
        return this._codigo_autorizacao;
    }
}