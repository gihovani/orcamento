export interface IEndereco {
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    uf: string;
    numero?: string;
    telefone?: string;
    complemento?: string;
}