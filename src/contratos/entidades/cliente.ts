export interface ICliente {
    documento: string;
    nome: string;
    sexo: string;
    data_nascimento: string;
    email: string;
    registro_uf?: string;
    rg_uf?: string;
    telefone?: string;
    celular?: string;
    profissao: string;
    registro?: string;
    rg?: string;
}