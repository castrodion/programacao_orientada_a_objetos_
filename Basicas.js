// ---------------------------------------------
// Basicas.js
// Descreve a estrutura base do jogo: Engine, Sala, Mochila, Ferramenta e Objeto
// Contém a lógica principal do jogo e a estrutura para salas e interações
// ---------------------------------------------

import { validate } from "bycontract";
import promptsync from "prompt-sync";
const prompt = promptsync({ sigint: true });

export class Ferramenta {
  #nome;

  constructor(nome) {
    validate(nome, "String");
    this.#nome = nome;
  }

  get nome() {
    return this.#nome;
  }

  usar() {
    return true;
  }
}

export class Mochila {
  #ferramentas;

  constructor() {
    this.#ferramentas = [];
  }

  guarda(ferramenta) {
    validate(ferramenta, Ferramenta);
    if (this.#ferramentas.length < 2) {
      this.#ferramentas.push(ferramenta);
      return true;
    } else {
      return false;
    }
  }

  pega(nomeFerramenta) {
    validate(arguments, ["String"]);
    return this.#ferramentas.find((f) => f.nome === nomeFerramenta);
  }

  tem(nomeFerramenta) {
    validate(arguments, ["String"]);
    return this.#ferramentas.some((f) => f.nome === nomeFerramenta);
  }

  remove(nomeFerramenta) {
    validate(nomeFerramenta, "String");
    const index = this.#ferramentas.findIndex((f) => f.nome === nomeFerramenta);
    if (index >= 0) {
      this.#ferramentas.splice(index, 1);
      return true;
    }
    return false;
  }

  inventario() {
    return this.#ferramentas.map((f) => (typeof f.descricaoInventario === "string" ? f.descricaoInventario : f.nome)).join(", ");
  }
}

export class Objeto {
  #nome;
  #descricaoAntesAcao;
  #descricaoDepoisAcao;
  #acaoOk;

  constructor(nome, descricaoAntesAcao, descricaoDepoisAcao) {
    validate(arguments, ["String", "String", "String"]);
    this.#nome = nome;
    this.#descricaoAntesAcao = descricaoAntesAcao;
    this.#descricaoDepoisAcao = descricaoDepoisAcao;
    this.#acaoOk = false;
  }

  get nome() {
    return this.#nome;
  }

  get acaoOk() {
    return this.#acaoOk;
  }

  set acaoOk(acaoOk) {
    validate(acaoOk, "Boolean");
    this.#acaoOk = acaoOk;
  }

  get descricao() {
    return this.#acaoOk ? this.#descricaoDepoisAcao : this.#descricaoAntesAcao;
  }

  usar(ferramenta) {
    return false;
  }
}

export class Sala {
  #nome;
  #objetos;
  #ferramentas;
  #portas;
  #engine;

  constructor(nome, engine) {
    validate(arguments, ["String", Engine]);
    this.#nome = nome;
    this.#objetos = new Map();
    this.#ferramentas = new Map();
    this.#portas = new Map();
    this.#engine = engine;
  }

  get nome() {
    return this.#nome;
  }

  get objetos() {
    return this.#objetos;
  }

  get ferramentas() {
    return this.#ferramentas;
  }

  get portas() {
    return this.#portas;
  }

  get engine() {
    return this.#engine;
  }

  objetosDisponiveis() {
    return [...this.#objetos.values()].map((obj) => obj.nome + ":" + obj.descricao);
  }

  ferramentasDisponiveis() {
    return [...this.#ferramentas.values()].map((f) => f.nome);
  }

  portasDisponiveis() {
    return [...this.#portas.values()].map((sala) => sala.nome);
  }

  pega(nomeFerramenta) {
    validate(nomeFerramenta, "String");
    const ferramenta = this.#ferramentas.get(nomeFerramenta);
    if (ferramenta != null) {
      if (this.#engine.mochila.guarda(ferramenta)) {
        this.#ferramentas.delete(nomeFerramenta);
        return true;
      } else {
        console.log("Mochila cheia! Remova uma ferramenta antes.");
        return false;
      }
    }
    return false;
  }

  sai(porta) {
    validate(porta, "String");
    return this.#portas.get(porta);
  }

  textoDescricao() {
    let descricao = "Você está no " + this.nome + "\n";
    descricao += this.objetos.size === 0 ? "Não há objetos na sala\n" : "Objetos: " + this.objetosDisponiveis().join(", ") + "\n";
    descricao += this.ferramentas.size === 0 ? "Não há ferramentas na sala\n" : "Ferramentas: " + this.ferramentasDisponiveis().join(", ") + "\n";
    descricao += "Portas: " + this.portasDisponiveis().join(", ") + "\n";
    return descricao;
  }

  usa(ferramenta, objeto) {
    return false;
  }
}

export class Engine {
  #mochila;
  #salaCorrente;
  #fim;

  constructor() {
    this.#mochila = new Mochila();
    this.#salaCorrente = null;
    this.#fim = false;
    global.engine = this;
    this.criaCenario();
  }

  get mochila() {
    return this.#mochila;
  }

  get salaCorrente() {
    return this.#salaCorrente;
  }

  set salaCorrente(sala) {
    validate(sala, Sala);
    this.#salaCorrente = sala;
  }

  indicaFimDeJogo(resultado) {
    this.#fim = true;

    if (resultado === "vitoria") {
      console.log(
        "\nVocê encontra o diamante e cumpre o trabalho. Enquanto se afasta da mansão, ouve ao longe as sirenes da polícia.\nAs luzes azuis e vermelhas se distanciam no retrovisor. Missão cumprida."
      );
    } else if (resultado === "derrota") {
      console.log(
        "\nVocê quebra o pote errado! O som alto aciona o alarme.\nAs luzes vermelhas piscam e passos se aproximam rapidamente... Você foi pego em flagrante pela polícia. Missão fracassada."
      );
    }

    // Pequena pausa antes de encerrar para que o jogador leia a mensagem
    setTimeout(() => process.exit(0), 1800);
  }

  criaCenario() {
    // Aqui você define as salas, objetos, ferramentas e conexões
  }

  joga() {
    let novaSala = null;
    let acao = "";
    let tokens = null;
    while (!this.#fim) {
      console.log("-------------------------");
      console.log(this.salaCorrente.textoDescricao());
      acao = prompt("O que voce deseja fazer? ");
      tokens = acao.trim().split(" ");

      switch (tokens[0]) {
        case "fim":
          this.#fim = true;
          break;
        case "pegar":
          if (this.salaCorrente.pega(tokens[1])) {
            console.log("Ok! " + tokens[1] + " guardado!");
          } else {
            console.log("Não foi possível guardar " + tokens[1]);
          }
          break;
        case "remover":
          if (this.#mochila.remove(tokens[1])) {
            console.log(tokens[1] + " foi removido da mochila.");
          } else {
            console.log("Ferramenta " + tokens[1] + " não encontrada na mochila.");
          }
          break;
        case "inventario":
          console.log("Ferramentas disponíveis para serem usadas: " + this.#mochila.inventario());
          break;
        case "usar":
          if (tokens.length === 2) {
            if (this.salaCorrente.usa(null, tokens[1])) {
              console.log("Feito !!");
            } else {
              console.log("Não foi possível usar " + tokens[1]);
            }
          } else if (tokens.length === 3) {
            if (this.salaCorrente.usa(tokens[1], tokens[2])) {
              console.log("Feito !!");
            } else {
              console.log("Não foi possível usar " + tokens[1] + " sobre " + tokens[2]);
            }
          } else {
            console.log("Comando inválido. Use: usar <objeto> ou usar <ferramenta> <objeto>");
          }
          break;
        case "ir_para":
          if (!tokens[1]) {
            console.log("Informe para qual sala deseja ir.");
            break;
          }
          novaSala = this.salaCorrente.sai(tokens[1]);
          if (novaSala == null) {
            console.log("Sala desconhecida ...");
          } else {
            this.#salaCorrente = novaSala;
          }
          break;
        default:
          console.log("Comando desconhecido: " + tokens[0]);
          break;
      }
    }
    console.log("Jogo encerrado!");
  }
}
