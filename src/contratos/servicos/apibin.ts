export interface IApiBin {
    consultar(numero: string): Promise<string>;
}