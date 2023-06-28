import {ApiCepViaCep} from "../servicos/apibuscacep";
import {ApiClienteMock} from "../servicos/apicliente";
const apiCep = new ApiCepViaCep();
const apiCliente = new ApiClienteMock();

apiCep.consultar('88106-000').then((dados) => {
    console.log(`Bairro do Cep ${dados.cep}: [Picadas do Sul]: `, dados.bairro == 'Picadas do Sul');
});

apiCliente.consultar('041.843.018-78').then((dados) => {
    console.log(`Nome do Cliente ${dados.nome}: [Dino da Silva Sauro]: `, dados.nome == 'Dino da Silva Sauro');
});