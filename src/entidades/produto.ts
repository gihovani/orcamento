import {IProduto} from "../contratos/entidades/produto";

export class Produto implements IProduto {
    private _sku: string;
    private _agrupador: string;
    private _nome: string;
    private _preco: number;
    private _situacao: boolean;
    private _preco_promocional?: number;
    descricao?: string;
    imagem?: string;
    link?: string;
    categorias?: string;
    marca?: string;
    codigo_barras?: string;

    constructor(
        sku: string,
        agrupador: string,
        nome: string,
        preco: number,
        situacao: boolean,
        descricao?: string | null,
        preco_promocional?: number | null,
        imagem?: string | null,
        link?: string | null,
        categorias?: string | null,
        marca?: string | null,
        codigo_barras?: string | null
    ) {
        this.sku = sku;
        this.agrupador = agrupador;
        this.nome = nome;
        this.preco = preco;
        this.situacao = situacao;
        this.preco_promocional = preco_promocional;
        this.descricao = descricao;
        this.imagem = imagem;
        this.link = link;
        this.categorias = categorias;
        this.marca = marca;
        this.codigo_barras = codigo_barras;
    }

    set sku(sku: string) {
        if (!sku) {
            throw Error("Produto Inválido: o sku do produto é obrigatório!")
        }
        this._sku = sku;
    }

    set agrupador(agrupador: string) {
        if (!agrupador) {
            throw Error("Produto Inválido: o agrupador do produto é obrigatório!")
        }
        this._agrupador = agrupador;
    }

    set nome(nome: string) {
        if (!nome) {
            throw Error("Produto Inválido: o nome do produto é obrigatório!")
        }
        this._nome = nome;
    }

    set preco(preco: number) {
        if (!preco && isNaN(preco)) {
            throw Error("Produto Inválido: o preço do produto deve ser um número!")
        }
        this._preco = preco;
    }

    set situacao(situacao: boolean) {
        this._situacao = !!situacao;
    }

    set preco_promocional(preco_promocional: number) {
        if (preco_promocional && isNaN(preco_promocional)) {
            throw Error("Produto Inválido: o preço promocional do produto deve ser um número!")
        }
        this._preco_promocional = preco_promocional;
    }

    get sku(): string {
        return this._sku;
    }

    get agrupador(): string {
        return this._agrupador;
    }

    get nome(): string {
        return this._nome;
    }

    get preco(): number {
        return this._preco;
    }

    get situacao(): boolean {
        return this._situacao;
    }

    get preco_promocional(): number | null {
        return this._preco_promocional;
    }

    get personalizado(): boolean {
        return this._nome.toLowerCase().indexOf('personalizad') > -1;
    }
}
