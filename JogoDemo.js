// --------------------------------------------------------
// JogoDemo.js — Classe principal que instancia e conecta as salas
// --------------------------------------------------------
import promptsync from "prompt-sync";
const prompt = promptsync({ sigint: true });
import { Engine } from "./Basicas.js";
import { HallEntrada, SalaDeEstar, Quarto, Banheiro, Cozinha, Biblioteca, Sotao } from "./SalasDemo.js";

export class JogoDemo extends Engine {
  constructor() {
    super();
  }

  criaCenario() {
    let hall = new HallEntrada(this);
    let sala = new SalaDeEstar(this);
    let quarto = new Quarto(this);
    let banheiro = new Banheiro(this);
    let cozinha = new Cozinha(this);
    let biblioteca = new Biblioteca(this);
    let sotao = new Sotao(this);

    hall.portas.set(sala.nome, sala);
    sala.portas.set(hall.nome, hall);
    sala.portas.set(quarto.nome, quarto);
    sala.portas.set(banheiro.nome, banheiro);
    quarto.portas.set(sala.nome, sala);
    banheiro.portas.set(sala.nome, sala);
    sala.portas.set(cozinha.nome, cozinha);
    cozinha.portas.set(sala.nome, sala);
    cozinha.portas.set(biblioteca.nome, biblioteca);
    biblioteca.portas.set(cozinha.nome, cozinha);
    biblioteca.portas.set(sotao.nome, sotao);
    sotao.portas.set(biblioteca.nome, biblioteca);

    this.salaCorrente = hall;
  }

  joga() {
    let novaSala = null;
    let acao = "";
    let tokens = null;
    while (!this.fim) {
      console.log("-------------------------");
      console.log(this.salaCorrente.textoDescricao());
      acao = prompt("O que você deseja fazer? ");
      tokens = acao.trim().split(" ");
      switch (tokens[0]) {
        case "fim":
          console.log(
            "Você decide interromper a missão. Ao analisar as consequências, conclui que não estava tão preparado quanto pensava.\nEnquanto foge da mansão, ouve o alarme tocar ao longe. Mas você sai a tempo e não é pego. Missão abandonada."
          );
          this.indicaFimDeJogo();
          process.exit(0);
        case "pegar":
          const nome = tokens[1];
          const ferramenta = this.salaCorrente.ferramentas.get(nome);

          if (nome === "bateria" && ferramenta) {
            const lanterna = this.mochila.pega("lanterna");
            if (lanterna && typeof lanterna.carregar === "function") {
              lanterna.carregar();
              this.salaCorrente.ferramentas.delete(nome);
              console.log("Você pegou a bateria. A lanterna foi recarregada e agora tem 1 uso disponível.");
            } else {
              console.log("Você encontrou uma bateria, mas não possui lanterna para usá-la. Ela foi descartada.");
              this.salaCorrente.ferramentas.delete(nome);
            }
          } else if (this.salaCorrente.pega(nome)) {
            console.log("Você pegou " + nome + ".");
          } else {
            console.log("Você não conseguiu pegar " + nome + ". Talvez não esteja ao seu alcance.");
          }
          break;
        case "remover":
          if (this.mochila.remove(tokens[1])) {
            console.log("Você removeu " + tokens[1] + " da mochila.");
          } else {
            console.log("Não há " + tokens[1] + " na sua mochila.");
          }
          break;
        case "inventario":
          console.log("Ferramentas com você: " + this.mochila.inventario());
          break;
        case "usar":
          if (tokens.length === 2) {
            const ferramenta = this.mochila.pega(tokens[1]);
            if (ferramenta && typeof ferramenta.usar === "function") {
              if (ferramenta.usar(this.salaCorrente?.nome)) {
                console.log("Você usou " + tokens[1] + ".");
              } else {
                console.log("Não foi possível usar a " + tokens[1] + ".");
              }
            } else {
              if (this.salaCorrente.usa(null, tokens[1])) {
                console.log("Você interagiu com " + tokens[1] + ".");
                if (this.fim) process.exit(0);
              } else {
                console.log("Nada acontece ao tentar usar " + tokens[1] + ".");
              }
            }
          } else if (tokens.length === 3) {
            if (this.salaCorrente.usa(tokens[1], tokens[2])) {
              console.log("Você usou " + tokens[1] + " em " + tokens[2] + ".");
              if (this.fim) process.exit(0);
            } else {
              console.log("Não foi possível usar " + tokens[1] + " em " + tokens[2] + ".");
            }
          } else {
            console.log("Comando inválido. Use: usar <objeto> ou usar <ferramenta> <objeto>");
          }
          break;
        case "abrir":
          if (tokens.length === 2) {
            if (this.salaCorrente.usa(null, tokens[1])) {
              console.log("Você abriu o " + tokens[1] + ".");
              if (this.fim) process.exit(0);
            } else {
              console.log("Você não conseguiu abrir o " + tokens[1] + ".");
            }
          } else if (tokens.length === 3) {
            if (this.salaCorrente.usa(tokens[1], tokens[2])) {
              console.log("Você usou " + tokens[1] + " para abrir " + tokens[2] + ".");
              if (this.fim) process.exit(0);
            } else {
              console.log("Não foi possível abrir " + tokens[2] + " com " + tokens[1] + ".");
            }
          } else {
            console.log("Comando inválido. Use: abrir <objeto> ou abrir <ferramenta> <objeto>");
          }
          break;
        case "ir":
          novaSala = this.salaCorrente.sai(tokens[1]);
          if (novaSala == null) {
            console.log("Você tenta ir para " + tokens[1] + ", mas não encontra passagem disponível.");
          } else {
            this.salaCorrente = novaSala;
            console.log("Você se move para " + novaSala.nome + ". O ambiente muda e o tempo parece correr mais rápido. Cada segundo conta.");
          }
          break;
        default:
          console.log("Comando desconhecido: " + tokens[0] + ". Você hesita por um momento, mas logo retoma o foco.");
          break;
      }
    }
    console.log("Jogo encerrado!");
    process.exit(0);
  }
}
